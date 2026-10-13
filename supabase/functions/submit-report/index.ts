// Supabase Edge Function: submit-report
// Serves as server-side validation and submission handler for AMEU SafeSpace
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateUnpredictableRef(): string {
  const chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  let p1 = '';
  let p2 = '';
  for (let i = 0; i < 4; i++) p1 += chars[array[i] % chars.length];
  for (let i = 4; i < 8; i++) p2 += chars[array[i] % chars.length];
  return `SS-${p1}-${p2}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const {
      reporting_for,
      incident_types,
      incident_types_other,
      platform,
      incident_date,
      description,
      immediate_danger,
      contact_requested,
      phone_number,
      consent_to_contact,
    } = body;

    // Strict validation
    if (!description || description.trim().length < 10 || description.length > 3000) {
      return new Response(JSON.stringify({ error: 'Description must be between 10 and 3,000 characters.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const reference_code = generateUnpredictableRef();
    const urgency = immediate_danger === 'yes' ? 'high' : 'medium';

    // 1. Insert report
    const { data: report, error: repErr } = await supabase
      .from('reports')
      .insert({
        reference_code,
        reporting_for,
        incident_types,
        incident_types_other: incident_types_other || null,
        platform,
        incident_date: incident_date || null,
        description,
        immediate_danger,
        contact_requested: Boolean(contact_requested),
        status: 'new',
        urgency,
      })
      .select('id, reference_code')
      .single();

    if (repErr) throw repErr;

    // 2. Insert isolated contact if requested
    if (contact_requested && phone_number && consent_to_contact) {
      const { error: conErr } = await supabase.from('report_contacts').insert({
        report_id: report.id,
        phone_number,
        consent_to_contact: true,
      });
      if (conErr) console.error('Contact insert error:', conErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        reference_code: report.reference_code,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
