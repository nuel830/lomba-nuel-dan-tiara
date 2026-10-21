import { supabase } from '../lib/supabaseClient.js'

export async function getZones() {
  if (!supabase) return { data: [], error: null }
  return supabase.from('zones').select('*').order('name')
}

// TODO: hitung Indeks Kesehatan Zona (0-100) dari laporan aktif dan yang selesai
export function calculateZoneIndex(reports) {
  return 100
}