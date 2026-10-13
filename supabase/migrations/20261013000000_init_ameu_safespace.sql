-- ====================================================================
-- AMEU SafeSpace: Initial Database Schema, Functions & RLS Policies
-- Cyberbullying Reporting and Peer Support System
-- Version: 20261013000000_init_ameu_safespace.sql
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLE: reports
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code TEXT NOT NULL UNIQUE,
    reporting_for TEXT NOT NULL CHECK (reporting_for IN ('me', 'friend', 'not_sure')),
    incident_types TEXT[] NOT NULL DEFAULT '{}',
    incident_types_other TEXT,
    platform TEXT NOT NULL,
    incident_date DATE,
    description TEXT NOT NULL,
    immediate_danger TEXT NOT NULL CHECK (immediate_danger IN ('yes', 'no', 'not_sure')),
    contact_requested BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'under_review', 'support_requested', 'referred', 'closed')),
    urgency TEXT NOT NULL DEFAULT 'low' CHECK (urgency IN ('high', 'medium', 'low')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexing for fast counselor searches
CREATE INDEX IF NOT EXISTS idx_reports_reference_code ON public.reports(reference_code);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_urgency ON public.reports(urgency);

-- 3. TABLE: report_contacts (Isolated and protected table for voluntary contact info)
CREATE TABLE IF NOT EXISTS public.report_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    consent_to_contact BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_report_contacts_report_id ON public.report_contacts(report_id);

-- 4. TABLE: counselor_profiles (Authorized peer counselors, supervisors, administrators)
CREATE TABLE IF NOT EXISTS public.counselor_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'peer_counselor' CHECK (role IN ('peer_counselor', 'supervising_counselor', 'administrator')),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_counselor_profiles_role ON public.counselor_profiles(role);

-- 5. TABLE: case_activity (Immutable Audit Trail)
CREATE TABLE IF NOT EXISTS public.case_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    actor_user_id UUID NOT NULL,
    actor_name TEXT NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('status_change', 'note_added', 'referral_made', 'contact_viewed', 'report_exported')),
    note TEXT,
    previous_status TEXT,
    new_status TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_case_activity_report_id ON public.case_activity(report_id);
CREATE INDEX IF NOT EXISTS idx_case_activity_created_at ON public.case_activity(created_at DESC);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_activity ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current auth user is an active counselor
CREATE OR REPLACE FUNCTION public.is_active_counselor()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.counselor_profiles
    WHERE id = auth.uid() AND active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --------------------------------------------------
-- RLS POLICIES FOR 'reports'
-- --------------------------------------------------
-- Deny public SELECT. Only authenticated active counselors can SELECT
CREATE POLICY "Active counselors can view reports"
ON public.reports
FOR SELECT
TO authenticated
USING (public.is_active_counselor());

-- Only active counselors can update report status
CREATE POLICY "Active counselors can update reports"
ON public.reports
FOR UPDATE
TO authenticated
USING (public.is_active_counselor())
WITH CHECK (public.is_active_counselor());

-- --------------------------------------------------
-- RLS POLICIES FOR 'report_contacts'
-- --------------------------------------------------
-- Strictly authorized counselors can SELECT contacts
CREATE POLICY "Active counselors can read contacts"
ON public.report_contacts
FOR SELECT
TO authenticated
USING (public.is_active_counselor());

-- --------------------------------------------------
-- RLS POLICIES FOR 'counselor_profiles'
-- --------------------------------------------------
CREATE POLICY "Counselors can view active profiles"
ON public.counselor_profiles
FOR SELECT
TO authenticated
USING (true);

-- --------------------------------------------------
-- RLS POLICIES FOR 'case_activity' (Audit Trail)
-- --------------------------------------------------
CREATE POLICY "Active counselors can view audit logs"
ON public.case_activity
FOR SELECT
TO authenticated
USING (public.is_active_counselor());

CREATE POLICY "Active counselors can append audit logs"
ON public.case_activity
FOR INSERT
TO authenticated
WITH CHECK (public.is_active_counselor());

-- ====================================================================
-- SERVER-SIDE SUBMISSION FUNCTION (SECURITY DEFINER RPC)
-- Validates input, generates unpredictable reference, and stores records safely
-- ====================================================================

CREATE OR REPLACE FUNCTION public.submit_student_report(
    p_reporting_for TEXT,
    p_incident_types TEXT[],
    p_incident_types_other TEXT,
    p_platform TEXT,
    p_incident_date DATE,
    p_description TEXT,
    p_immediate_danger TEXT,
    p_contact_requested BOOLEAN,
    p_phone_number TEXT,
    p_consent_to_contact BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    v_clean_desc TEXT;
    v_ref_code TEXT;
    v_report_id UUID;
    v_urgency TEXT;
    v_chars TEXT := '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
    v_p1 TEXT := '';
    v_p2 TEXT := '';
    v_i INT;
BEGIN
    -- 1. Validation & sanitization
    IF p_reporting_for NOT IN ('me', 'friend', 'not_sure') THEN
        RAISE EXCEPTION 'Invalid reporting_for value.';
    END IF;

    IF p_incident_types IS NULL OR array_length(p_incident_types, 1) = 0 THEN
        RAISE EXCEPTION 'At least one incident category is required.';
    END IF;

    IF p_platform IS NULL OR length(trim(p_platform)) = 0 THEN
        RAISE EXCEPTION 'Platform identifier is required.';
    END IF;

    v_clean_desc := trim(p_description);
    IF v_clean_desc IS NULL OR length(v_clean_desc) < 10 THEN
        RAISE EXCEPTION 'Description must be at least 10 characters.';
    END IF;

    IF length(v_clean_desc) > 3000 THEN
        RAISE EXCEPTION 'Description exceeds maximum allowed limit of 3000 characters.';
    END IF;

    IF p_immediate_danger NOT IN ('yes', 'no', 'not_sure') THEN
        RAISE EXCEPTION 'Invalid immediate_danger value.';
    END IF;

    -- 2. Calculate Urgency
    IF p_immediate_danger = 'yes' THEN
        v_urgency := 'high';
    ELSIF p_incident_types && ARRAY['Threats or intimidation', 'Sharing images or videos without permission', 'Sharing private information without permission'] THEN
        v_urgency := 'high';
    ELSIF array_length(p_incident_types, 1) > 2 OR p_immediate_danger = 'not_sure' THEN
        v_urgency := 'medium';
    ELSE
        v_urgency := 'low';
    END IF;

    -- 3. Generate Cryptographic Unpredictable Reference (SS-XXXX-XXXX)
    FOR v_i IN 1..4 LOOP
        v_p1 := v_p1 || substr(v_chars, (1 + (abs(get_byte(gen_random_bytes(1), 0)) % length(v_chars)))::int, 1);
        v_p2 := v_p2 || substr(v_chars, (1 + (abs(get_byte(gen_random_bytes(1), 0)) % length(v_chars)))::int, 1);
    END LOOP;
    v_ref_code := 'SS-' || v_p1 || '-' || v_p2;

    -- Ensure uniqueness collision check
    WHILE EXISTS (SELECT 1 FROM public.reports WHERE reference_code = v_ref_code) LOOP
        v_p1 := '';
        v_p2 := '';
        FOR v_i IN 1..4 LOOP
            v_p1 := v_p1 || substr(v_chars, (1 + (abs(get_byte(gen_random_bytes(1), 0)) % length(v_chars)))::int, 1);
            v_p2 := v_p2 || substr(v_chars, (1 + (abs(get_byte(gen_random_bytes(1), 0)) % length(v_chars)))::int, 1);
        END LOOP;
        v_ref_code := 'SS-' || v_p1 || '-' || v_p2;
    END LOOP;

    -- 4. Insert into reports table
    INSERT INTO public.reports (
        reference_code,
        reporting_for,
        incident_types,
        incident_types_other,
        platform,
        incident_date,
        description,
        immediate_danger,
        contact_requested,
        status,
        urgency
    ) VALUES (
        v_ref_code,
        p_reporting_for,
        p_incident_types,
        nullif(trim(p_incident_types_other), ''),
        trim(p_platform),
        p_incident_date,
        v_clean_desc,
        p_immediate_danger,
        coalesce(p_contact_requested, false),
        'new',
        v_urgency
    )
    RETURNING id INTO v_report_id;

    -- 5. Separate contact information storage with explicit consent validation
    IF p_contact_requested = TRUE AND p_phone_number IS NOT NULL AND length(trim(p_phone_number)) > 0 THEN
        IF p_consent_to_contact IS NOT TRUE THEN
            RAISE EXCEPTION 'Explicit consent is mandatory when submitting contact details.';
        END IF;

        INSERT INTO public.report_contacts (
            report_id,
            phone_number,
            consent_to_contact
        ) VALUES (
            v_report_id,
            trim(p_phone_number),
            true
        );
    END IF;

    -- 6. Return minimal confirmation receipt
    RETURN jsonb_build_object(
        'success', true,
        'reference_code', v_ref_code,
        'report_id', v_report_id,
        'message', 'Report received and securely recorded.'
    );
END;
$$;

-- Grant EXECUTE permission on public RPC function to anonymous visitors
GRANT EXECUTE ON FUNCTION public.submit_student_report TO anon, authenticated;
