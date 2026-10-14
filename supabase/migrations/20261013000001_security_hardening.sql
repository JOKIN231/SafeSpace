-- ====================================================================
-- AMEU SafeSpace: Migration 2 — Security Hardening & Role Enforcement
-- Version: 20261013000001_security_hardening.sql
-- ====================================================================

-- 1. SECURITY HELPER FUNCTIONS
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

-- 2. HARDENED ROW LEVEL SECURITY POLICIES

-- A. Counselor Profiles: Protect against unauthorized role self-assignment & discovery
DROP POLICY IF EXISTS "Counselors can view active profiles" ON public.counselor_profiles;
DROP POLICY IF EXISTS "Only admins can modify counselor profiles" ON public.counselor_profiles;

-- Active counselors can only view active colleagues; Administrators can view all
CREATE POLICY "Active counselors can view active profiles"
ON public.counselor_profiles
FOR SELECT
TO authenticated
USING (
  (active = TRUE AND public.is_active_counselor()) OR public.is_administrator()
);

-- Only verified administrators can insert or update counselor profiles
CREATE POLICY "Only admins can insert counselor profiles"
ON public.counselor_profiles
FOR INSERT
TO authenticated
WITH CHECK (public.is_administrator());

CREATE POLICY "Only admins can update counselor profiles"
ON public.counselor_profiles
FOR UPDATE
TO authenticated
USING (public.is_administrator())
WITH CHECK (public.is_administrator());

CREATE POLICY "Only admins can delete counselor profiles"
ON public.counselor_profiles
FOR DELETE
TO authenticated
USING (public.is_administrator());

-- B. Report Contacts: Restrict phone number access to supervisors and admins
DROP POLICY IF EXISTS "Active counselors can read contacts" ON public.report_contacts;

CREATE POLICY "Only supervisors and admins can read contact details"
ON public.report_contacts
FOR SELECT
TO authenticated
USING (public.is_supervisor_or_admin());

-- C. Case Activity: Tamper-proof audit logging (prevents actor ID spoofing)
DROP POLICY IF EXISTS "Active counselors can append audit logs" ON public.case_activity;

CREATE POLICY "Active counselors can append verified audit logs"
ON public.case_activity
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_active_counselor()
  AND actor_user_id = auth.uid()
);

-- Revoke mutation & deletion permissions on immutable audit log
REVOKE UPDATE, DELETE, TRUNCATE ON public.case_activity FROM authenticated, anon, public;

-- Revoke public table mutations
REVOKE UPDATE, DELETE, TRUNCATE ON public.reports FROM anon, public;
REVOKE ALL ON public.report_contacts FROM anon, public;
REVOKE ALL ON public.counselor_profiles FROM anon, public;

-- 3. HARDENED SUBMIT_STUDENT_REPORT FUNCTION
-- Fixes empty array cardinality bug, adds field length caps, and sanitizes input
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

    -- Fix: Use cardinality() which evaluates to 0 on empty array '{}', avoiding NULL evaluation
    IF p_incident_types IS NULL OR cardinality(p_incident_types) = 0 THEN
        RAISE EXCEPTION 'At least one incident category is required.';
    END IF;

    IF cardinality(p_incident_types) > 10 THEN
        RAISE EXCEPTION 'Exceeded maximum incident category count.';
    END IF;

    v_clean_platform := trim(p_platform);
    IF v_clean_platform IS NULL OR length(v_clean_platform) = 0 THEN
        RAISE EXCEPTION 'Platform identifier is required.';
    END IF;
    IF length(v_clean_platform) > 100 THEN
        RAISE EXCEPTION 'Platform identifier exceeds maximum allowed length.';
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

    IF p_contact_requested AND p_phone_number IS NOT NULL AND length(trim(p_phone_number)) > 0 THEN
        v_clean_phone := trim(p_phone_number);
        IF length(v_clean_phone) > 40 THEN
            RAISE EXCEPTION 'Phone number exceeds maximum allowed length.';
        END IF;
        IF NOT p_consent_to_contact THEN
            RAISE EXCEPTION 'Explicit consent is mandatory when providing contact information.';
        END IF;
    END IF;

    -- 2. Calculate Urgency
    IF p_immediate_danger = 'yes' THEN
        v_urgency := 'high';
    ELSIF p_incident_types && ARRAY['Threats or intimidation', 'Sharing images or videos without permission', 'Sharing private information without permission'] THEN
        v_urgency := 'high';
    ELSIF cardinality(p_incident_types) > 2 OR p_immediate_danger = 'not_sure' THEN
        v_urgency := 'medium';
    ELSE
        v_urgency := 'low';
    END IF;

    -- 3. Generate Cryptographic Unpredictable Reference (SS-XXXX-XXXX) with collision retry
    LOOP
        v_p1 := '';
        v_p2 := '';
        FOR v_i IN 1..4 LOOP
            v_p1 := v_p1 || substr(v_chars, (1 + (abs(get_byte(gen_random_bytes(1), 0)) % length(v_chars)))::int, 1);
            v_p2 := v_p2 || substr(v_chars, (1 + (abs(get_byte(gen_random_bytes(1), 0)) % length(v_chars)))::int, 1);
        END LOOP;
        v_ref_code := 'SS-' || v_p1 || '-' || v_p2;

        -- Ensure uniqueness
        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.reports WHERE reference_code = v_ref_code);
        v_attempts := v_attempts + 1;
        IF v_attempts > 10 THEN
            RAISE EXCEPTION 'Failed to generate unique report reference.';
        END IF;
    END LOOP;

    -- 4. Insert report
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
        CASE WHEN p_incident_types_other IS NOT NULL AND length(trim(p_incident_types_other)) > 0
             THEN substring(trim(p_incident_types_other), 1, 300)
             ELSE NULL END,
        v_clean_platform,
        p_incident_date,
        v_clean_desc,
        p_immediate_danger,
        p_contact_requested,
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

    -- 6. Return confirmation data
    RETURN jsonb_build_object(
        'success', TRUE,
        'reference_code', v_ref_code,
        'report_id', v_report_id,
        'urgency', v_urgency,
        'message', 'Your report has been received and securely registered.'
    );
END;
$$;
