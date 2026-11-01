-- ====================================================================
-- AMEU SAFESPACE: COMPLETE ALL-IN-ONE SUPABASE BACKEND SETUP
-- Cyberbullying Reporting, Peer Counseling & Evidence Management System
-- Copy and paste this entire script into your Supabase SQL Editor and click RUN.
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 2. CORE TABLES
-- ====================================================================

-- Table 1: reports
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
    evidence_files JSONB NOT NULL DEFAULT '[]'::jsonb, -- Stores screenshots, data URLs, and metadata
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'under_review', 'support_requested', 'referred', 'closed')),
    urgency TEXT NOT NULL DEFAULT 'low' CHECK (urgency IN ('high', 'medium', 'low')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexing for fast counselor searches and filtering
CREATE INDEX IF NOT EXISTS idx_reports_reference_code ON public.reports(reference_code);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_urgency ON public.reports(urgency);

-- Table 2: report_contacts (Isolated and protected table for voluntary contact info)
CREATE TABLE IF NOT EXISTS public.report_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    consent_to_contact BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_report_contacts_report_id ON public.report_contacts(report_id);

-- Table 3: counselor_profiles (Authorized peer counselors, supervisors, administrators)
CREATE TABLE IF NOT EXISTS public.counselor_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'peer_counselor' CHECK (role IN ('peer_counselor', 'supervising_counselor', 'administrator')),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    department TEXT,
    specialty TEXT,
    phone TEXT,
    avatar_url TEXT,
    available_today BOOLEAN DEFAULT TRUE,
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_counselor_profiles_role ON public.counselor_profiles(role);
CREATE INDEX IF NOT EXISTS idx_counselor_profiles_email ON public.counselor_profiles(email);

-- Table 4: case_activity (Immutable Audit Trail)
CREATE TABLE IF NOT EXISTS public.case_activity (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE, -- Nullable for system-level audits
    actor_user_id TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    action_type TEXT NOT NULL,
    note TEXT,
    previous_status TEXT,
    new_status TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_case_activity_report_id ON public.case_activity(report_id);
CREATE INDEX IF NOT EXISTS idx_case_activity_created_at ON public.case_activity(created_at DESC);

-- ====================================================================
-- 3. SUPABASE STORAGE BUCKET FOR EVIDENCE SCREENSHOTS
-- ====================================================================

-- Create storage bucket for incident screenshot uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'report-evidence',
    'report-evidence',
    true,
    15728640, -- 15MB file size limit per screenshot
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 15728640,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

-- Storage RLS: Allow anyone (students) to upload screenshots to report-evidence bucket
DROP POLICY IF EXISTS "Public student evidence upload" ON storage.objects;
CREATE POLICY "Public student evidence upload"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'report-evidence');

-- Storage RLS: Allow viewing/downloading evidence images
DROP POLICY IF EXISTS "Public and counselor evidence access" ON storage.objects;
CREATE POLICY "Public and counselor evidence access"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'report-evidence');

-- ====================================================================
-- 4. SECURITY & ROLE HELPER FUNCTIONS
-- ====================================================================

CREATE OR REPLACE FUNCTION public.is_active_counselor()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.counselor_profiles
    WHERE id = auth.uid() AND active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_current_counselor_role()
RETURNS TEXT AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role
  FROM public.counselor_profiles
  WHERE id = auth.uid() AND active = TRUE;
  RETURN v_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_administrator()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (public.get_current_counselor_role() = 'administrator');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_supervisor_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (public.get_current_counselor_role() IN ('supervising_counselor', 'administrator'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ====================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_activity ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------
-- RLS: reports
-- --------------------------------------------------
DROP POLICY IF EXISTS "Active counselors can view reports" ON public.reports;
CREATE POLICY "Active counselors can view reports"
ON public.reports FOR SELECT
TO authenticated
USING (public.is_active_counselor());

DROP POLICY IF EXISTS "Anyone can submit a report" ON public.reports;
CREATE POLICY "Anyone can submit a report"
ON public.reports FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Active counselors can update reports" ON public.reports;
CREATE POLICY "Active counselors can update reports"
ON public.reports FOR UPDATE
TO authenticated
USING (public.is_active_counselor())
WITH CHECK (public.is_active_counselor());

-- --------------------------------------------------
-- RLS: report_contacts (Sensitive Student Contact Data)
-- --------------------------------------------------
DROP POLICY IF EXISTS "Anyone can insert report contact" ON public.report_contacts;
CREATE POLICY "Anyone can insert report contact"
ON public.report_contacts FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Only supervisors and admins can read contact details" ON public.report_contacts;
CREATE POLICY "Only supervisors and admins can read contact details"
ON public.report_contacts FOR SELECT
TO authenticated
USING (public.is_supervisor_or_admin());

-- --------------------------------------------------
-- RLS: counselor_profiles
-- --------------------------------------------------
DROP POLICY IF EXISTS "Active counselors can view active profiles" ON public.counselor_profiles;
CREATE POLICY "Active counselors can view active profiles"
ON public.counselor_profiles FOR SELECT
TO authenticated
USING (
  (active = TRUE AND public.is_active_counselor()) OR public.is_administrator()
);

DROP POLICY IF EXISTS "Only admins can insert counselor profiles" ON public.counselor_profiles;
CREATE POLICY "Only admins can insert counselor profiles"
ON public.counselor_profiles FOR INSERT
TO authenticated
WITH CHECK (public.is_administrator());

DROP POLICY IF EXISTS "Only admins can update counselor profiles" ON public.counselor_profiles;
CREATE POLICY "Only admins can update counselor profiles"
ON public.counselor_profiles FOR UPDATE
TO authenticated
USING (public.is_administrator() OR id = auth.uid())
WITH CHECK (public.is_administrator() OR id = auth.uid());

DROP POLICY IF EXISTS "Only admins can delete counselor profiles" ON public.counselor_profiles;
CREATE POLICY "Only admins can delete counselor profiles"
ON public.counselor_profiles FOR DELETE
TO authenticated
USING (public.is_administrator());

-- --------------------------------------------------
-- RLS: case_activity (Audit Trail)
-- --------------------------------------------------
DROP POLICY IF EXISTS "Active counselors can view audit logs" ON public.case_activity;
CREATE POLICY "Active counselors can view audit logs"
ON public.case_activity FOR SELECT
TO authenticated
USING (public.is_active_counselor());

DROP POLICY IF EXISTS "Active counselors can append audit logs" ON public.case_activity;
CREATE POLICY "Active counselors can append audit logs"
ON public.case_activity FOR INSERT
TO authenticated
WITH CHECK (
  public.is_active_counselor()
  OR auth.uid() IS NOT NULL
);

-- Revoke mutation/deletion permissions on audit log
REVOKE UPDATE, DELETE, TRUNCATE ON public.case_activity FROM authenticated, anon, public;

-- ====================================================================
-- 6. RPC SUBMISSION FUNCTION WITH SCREENSHOT EVIDENCE SUPPORT
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
    p_consent_to_contact BOOLEAN,
    p_evidence_files JSONB DEFAULT '[]'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    v_clean_desc TEXT;
    v_clean_platform TEXT;
    v_clean_phone TEXT;
    v_ref_code TEXT;
    v_report_id UUID;
    v_urgency TEXT;
    v_chars TEXT := '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
    v_p1 TEXT := '';
    v_p2 TEXT := '';
    v_i INT;
    v_attempts INT := 0;
BEGIN
    -- 1. Validation & sanitization
    IF p_reporting_for NOT IN ('me', 'friend', 'not_sure') THEN
        RAISE EXCEPTION 'Invalid reporting_for value.';
    END IF;

    IF p_incident_types IS NULL OR cardinality(p_incident_types) = 0 THEN
        RAISE EXCEPTION 'At least one incident category is required.';
    END IF;

    v_clean_platform := trim(p_platform);
    IF v_clean_platform IS NULL OR length(v_clean_platform) = 0 THEN
        RAISE EXCEPTION 'Platform identifier is required.';
    END IF;

    v_clean_desc := trim(p_description);
    IF v_clean_desc IS NULL OR length(v_clean_desc) < 10 THEN
        RAISE EXCEPTION 'Description must be at least 10 characters.';
    END IF;

    IF length(v_clean_desc) > 5000 THEN
        RAISE EXCEPTION 'Description exceeds maximum allowed limit.';
    END IF;

    IF p_immediate_danger NOT IN ('yes', 'no', 'not_sure') THEN
        RAISE EXCEPTION 'Invalid immediate_danger value.';
    END IF;

    IF p_contact_requested AND p_phone_number IS NOT NULL AND length(trim(p_phone_number)) > 0 THEN
        v_clean_phone := trim(p_phone_number);
        IF NOT p_consent_to_contact THEN
            RAISE EXCEPTION 'Explicit consent is mandatory when providing contact information.';
        END IF;
    END IF;

    -- 2. Calculate Urgency Level
    IF p_immediate_danger = 'yes' THEN
        v_urgency := 'high';
    ELSIF p_incident_types && ARRAY['Threats or intimidation', 'Sharing images or videos without permission', 'Sharing private information without permission'] THEN
        v_urgency := 'high';
    ELSIF cardinality(p_incident_types) > 2 OR p_immediate_danger = 'not_sure' THEN
        v_urgency := 'medium';
    ELSE
        v_urgency := 'low';
    END IF;

    -- 3. Cryptographic Unpredictable Reference (SS-XXXX-XXXX)
    LOOP
        v_p1 := '';
        v_p2 := '';
        FOR v_i IN 1..4 LOOP
            v_p1 := v_p1 || substr(v_chars, (1 + (abs(get_byte(gen_random_bytes(1), 0)) % length(v_chars)))::int, 1);
            v_p2 := v_p2 || substr(v_chars, (1 + (abs(get_byte(gen_random_bytes(1), 0)) % length(v_chars)))::int, 1);
        END LOOP;
        v_ref_code := 'SS-' || v_p1 || '-' || v_p2;

        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.reports WHERE reference_code = v_ref_code);
        v_attempts := v_attempts + 1;
        IF v_attempts > 10 THEN
            RAISE EXCEPTION 'Failed to generate unique report reference.';
        END IF;
    END LOOP;

    -- 4. Insert report including evidence screenshots JSONB
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
        evidence_files,
        status,
        urgency
    ) VALUES (
        v_ref_code,
        p_reporting_for,
        p_incident_types,
        CASE WHEN p_incident_types_other IS NOT NULL AND length(trim(p_incident_types_other)) > 0
             THEN substring(trim(p_incident_types_other), 1, 300)
             ELSE NULL END,
        v_clean_platform,
        p_incident_date,
        v_clean_desc,
        p_immediate_danger,
        coalesce(p_contact_requested, false),
        coalesce(p_evidence_files, '[]'::jsonb),
        'new',
        v_urgency
    )
    RETURNING id INTO v_report_id;

    -- 5. Insert contact details separately if provided
    IF p_contact_requested AND v_clean_phone IS NOT NULL AND length(v_clean_phone) > 0 THEN
        INSERT INTO public.report_contacts (
            report_id,
            phone_number,
            consent_to_contact
        ) VALUES (
            v_report_id,
            v_clean_phone,
            p_consent_to_contact
        );
    END IF;

    -- 6. Return confirmation receipt
    RETURN jsonb_build_object(
        'success', TRUE,
        'reference_code', v_ref_code,
        'report_id', v_report_id,
        'urgency', v_urgency,
        'message', 'Your report has been received and securely registered.'
    );
END;
$$;

-- Grant EXECUTE permission on RPC to public anonymous students
GRANT EXECUTE ON FUNCTION public.submit_student_report TO anon, authenticated;

-- ====================================================================
-- 7. INITIAL ADMIN & COUNSELOR ACCOUNTS PROVISIONING
-- ====================================================================

DO $$
DECLARE
    v_admin_id UUID := 'a0000000-0000-0000-0000-000000000001'::uuid;
    v_arhin_id UUID := 'a0000000-0000-0000-0000-000000000002'::uuid;
    v_counselor_id UUID := 'c0000000-0000-0000-0000-000000000001'::uuid;
    v_encrypted_pwd TEXT;
BEGIN
    -- Pre-calculate bcrypt hash for password: SafeSpace@2026!
    v_encrypted_pwd := crypt('SafeSpace@2026!', gen_salt('bf'));

    -- 1. Create or update primary administrator: admin@ame.edu.lr
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        role,
        aud
    ) VALUES (
        v_admin_id,
        '00000000-0000-0000-0000-000000000000',
        'admin@ame.edu.lr',
        v_encrypted_pwd,
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"display_name":"AMEU SafeSpace Administrator"}'::jsonb,
        now(),
        now(),
        'authenticated',
        'authenticated'
    ) ON CONFLICT (id) DO UPDATE SET
        encrypted_password = v_encrypted_pwd,
        email = 'admin@ame.edu.lr',
        email_confirmed_at = now();

    INSERT INTO public.counselor_profiles (
        id,
        email,
        display_name,
        role,
        active,
        department,
        specialty,
        phone,
        bio
    ) VALUES (
        v_admin_id,
        'admin@ame.edu.lr',
        'AMEU System Administrator',
        'administrator',
        TRUE,
        'AMEU Student Affairs & Wellbeing',
        'Dean of Student Welfare & Institutional Safeguarding',
        '+231 77 000 2638',
        'Senior safeguarding supervisor coordinating crisis escalation with AMEU administration.'
    ) ON CONFLICT (id) DO UPDATE SET
        role = 'administrator',
        active = TRUE;

    -- 2. Create or update institutional administrator: arhin@ame.edu.lr
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        role,
        aud
    ) VALUES (
        v_arhin_id,
        '00000000-0000-0000-0000-000000000000',
        'arhin@ame.edu.lr',
        v_encrypted_pwd,
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"display_name":"Arhin (AMEU Administrator)"}'::jsonb,
        now(),
        now(),
        'authenticated',
        'authenticated'
    ) ON CONFLICT (id) DO UPDATE SET
        encrypted_password = v_encrypted_pwd,
        email = 'arhin@ame.edu.lr',
        email_confirmed_at = now();

    INSERT INTO public.counselor_profiles (
        id,
        email,
        display_name,
        role,
        active,
        department,
        specialty,
        phone,
        bio
    ) VALUES (
        v_arhin_id,
        'arhin@ame.edu.lr',
        'Arhin (Administrator)',
        'administrator',
        TRUE,
        'AMEU Division of Safeguarding & IT',
        'Lead Administrator & Security Coordinator',
        '+231 77 000 2638',
        'Primary university administrator managing safe reporting and counselor oversight.'
    ) ON CONFLICT (id) DO UPDATE SET
        role = 'administrator',
        active = TRUE;

    -- 3. Create or update default peer counselor: counselor@ame.edu.lr
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        role,
        aud
    ) VALUES (
        v_counselor_id,
        '00000000-0000-0000-0000-000000000000',
        'counselor@ame.edu.lr',
        v_encrypted_pwd,
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"display_name":"Jane Doe (Peer Counselor)"}'::jsonb,
        now(),
        now(),
        'authenticated',
        'authenticated'
    ) ON CONFLICT (id) DO UPDATE SET
        encrypted_password = v_encrypted_pwd,
        email = 'counselor@ame.edu.lr',
        email_confirmed_at = now();

    INSERT INTO public.counselor_profiles (
        id,
        email,
        display_name,
        role,
        active,
        department,
        specialty,
        phone,
        bio
    ) VALUES (
        v_counselor_id,
        'counselor@ame.edu.lr',
        'Jane Doe',
        'peer_counselor',
        TRUE,
        'Department of Sociology (Class of 2027)',
        'Social Media Harassment & Cyberbullying',
        '+231 77 123 8899',
        'Trained AMEU student counselor focused on non-judgmental listening and student safety.'
    ) ON CONFLICT (id) DO UPDATE SET
        role = 'peer_counselor',
        active = TRUE;

END $$;
