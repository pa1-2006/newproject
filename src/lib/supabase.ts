import { createClient } from '@supabase/supabase-js';
import { Appointment } from '../types';

export const SUPABASE_PROJECT_ID = 'xogpmksbixplkmnsteds';
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_QjZpjMTZCUvg6vvLh3ix5w_95YKnmIG';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
  },
});

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Saves a new soil testing appointment to Supabase table 'appointments'.
 */
export async function saveAppointmentToSupabase(appointment: Appointment) {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase credentials not configured' };
  }

  // Format payload for database table
  const payload = {
    id: appointment.id,
    farmer_id: appointment.farmerId,
    farmer_name: appointment.farmerName,
    farmer_phone: appointment.farmerPhone,
    farm_id: appointment.farmId,
    farm_name: appointment.farmName,
    acreage: appointment.acreage,
    center_id: appointment.centerId,
    center_name: appointment.centerName,
    appointment_date: appointment.appointmentDate,
    time_slot: appointment.timeSlot,
    sample_count: appointment.sampleCount,
    current_crop: appointment.currentCrop,
    intended_crop: appointment.intendedCrop,
    sampling_depth_notes: appointment.samplingDepthNotes,
    status: appointment.status,
    sample_barcodes: appointment.sampleBarcodes,
    instructions_acknowledged: appointment.instructionsAcknowledged,
    created_at: appointment.createdAt,
    updated_at: appointment.updatedAt,
  };

  try {
    const { data, error } = await supabase
      .from('appointments')
      .upsert(payload, { onConflict: 'id' })
      .select();

    if (error) {
      console.warn('Supabase upsert note:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Supabase save error:', err);
    return { success: false, error: err?.message || 'Unknown network error' };
  }
}

/**
 * Fetches appointments from Supabase table 'appointments'.
 */
export async function fetchAppointmentsFromSupabase(): Promise<Appointment[] | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch note:', error.message);
      return null;
    }

    if (!data) return null;

    // Map database snake_case columns back to frontend Appointment model
    return data.map((row: any) => ({
      id: row.id,
      farmerId: row.farmer_id || row.farmerId,
      farmerName: row.farmer_name || row.farmerName,
      farmerPhone: row.farmer_phone || row.farmerPhone,
      farmId: row.farm_id || row.farmId,
      farmName: row.farm_name || row.farmName,
      acreage: Number(row.acreage) || 1.0,
      centerId: row.center_id || row.centerId,
      centerName: row.center_name || row.centerName,
      appointmentDate: row.appointment_date || row.appointmentDate,
      timeSlot: row.time_slot || row.timeSlot,
      sampleCount: Number(row.sample_count || row.sampleCount) || 1,
      currentCrop: row.current_crop || row.currentCrop || 'Sugarcane',
      intendedCrop: row.intended_crop || row.intendedCrop || 'Paddy',
      samplingDepthNotes: row.sampling_depth_notes || row.samplingDepthNotes || '',
      status: row.status || 'Confirmed',
      sampleBarcodes: Array.isArray(row.sample_barcodes) ? row.sample_barcodes : (row.sampleBarcodes || []),
      instructionsAcknowledged: Boolean(row.instructions_acknowledged ?? row.instructionsAcknowledged ?? true),
      createdAt: row.created_at || row.createdAt || new Date().toISOString(),
      updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
      reportId: row.report_id || row.reportId,
    }));
  } catch (err) {
    console.error('Failed to query Supabase appointments:', err);
    return null;
  }
}

/**
 * Update an appointment status in Supabase.
 */
export async function updateSupabaseAppointmentStatus(id: string, status: string) {
  if (!isSupabaseConfigured) return { success: false };

  try {
    const { error } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.warn('Supabase status update note:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Helper SQL definition string that user can run in Supabase SQL editor if needed.
 */
export const SUPABASE_SCHEMA_SQL = `-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/xogpmksbixplkmnsteds/sql):

CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  farmer_id TEXT,
  farmer_name TEXT,
  farmer_phone TEXT,
  farm_id TEXT,
  farm_name TEXT,
  acreage NUMERIC,
  center_id TEXT,
  center_name TEXT,
  appointment_date DATE,
  time_slot TEXT,
  sample_count INTEGER,
  current_crop TEXT,
  intended_crop TEXT,
  sampling_depth_notes TEXT,
  status TEXT DEFAULT 'Confirmed',
  sample_barcodes TEXT[],
  instructions_acknowledged BOOLEAN DEFAULT true,
  report_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) and allow public insert & select
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" 
ON public.appointments FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert and update" 
ON public.appointments FOR ALL 
USING (true)
WITH CHECK (true);
`;
