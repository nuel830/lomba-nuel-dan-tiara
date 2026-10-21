import { supabase } from '../lib/supabaseClient.js'

export async function getMissions() {
  if (!supabase) return { data: [], error: null }
  return supabase.from('missions').select('*').order('event_date', { ascending: true })
}

export async function createMission(payload) {
  // TODO: khusus admin
  return { data: null, error: new Error('createMission belum dibuat') }
}

export async function joinMission(missionId, volunteer) {
  // TODO: daftar relawan
  return { data: null, error: new Error('joinMission belum dibuat') }
}