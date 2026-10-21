import { supabase } from '../lib/supabaseClient.js'

// Kode laporan unik, mis. LG-7K2P9
export const generateReportCode = () =>
  'LG-' + Math.random().toString(36).slice(2, 7).toUpperCase()

export async function createReport(payload) {
  // TODO: upload foto ke Storage, lalu insert ke tabel reports
  return { data: null, error: new Error('createReport belum dibuat') }
}

export async function getReports() {
  if (!supabase) return { data: [], error: null }
  return supabase.from('reports').select('*').order('created_at', { ascending: false })
}

export async function getReportByCode(code) {
  if (!supabase) return { data: null, error: null }
  return supabase.from('reports').select('*, report_status_history(*)').eq('code', code).single()
}

export async function confirmReport(reportId) {
  // TODO: tombol "Saya juga melihat ini"
  return { data: null, error: new Error('confirmReport belum dibuat') }
}

export async function updateReportStatus(reportId, status) {
  // TODO: khusus admin
  return { data: null, error: new Error('updateReportStatus belum dibuat') }
}