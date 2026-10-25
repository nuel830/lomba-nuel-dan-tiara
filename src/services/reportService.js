// Semua komunikasi ke database untuk laporan ada di file ini.
import { supabase } from '../lib/supabaseClient.js'
import { calculatePriority } from '../lib/priority.js'

const PHOTO_BUCKET = 'report-photos'
// Tanpa huruf/angka yang mudah tertukar (0/O, 1/I)
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function randomString(length) {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')
}

// Kode laporan unik, mis. LG-7K2P9X
export const generateReportCode = () => 'LG-' + randomString(6)

export async function uploadReportPhoto(blob) {
  if (!supabase) return { url: null, error: new Error('NO_DB') }
  const path = `${new Date().toISOString().slice(0, 10)}/${randomString(12)}.jpg`
  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, blob, { contentType: 'image/jpeg', upsert: false })
  if (error) return { url: null, error }
  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}

// Membuat laporan baru. Foto bersifat opsional: bila unggah foto gagal,
// laporan tetap disimpan dan hasilnya menandai photoFailed = true.
export async function createReport({
  type, size, hasOdor, hasDeadFish, description, lat, lng, locationId, photoBlob,
}) {
  if (!supabase) return { data: null, error: new Error('NO_DB') }

  let photoUrl = null
  let photoFailed = false
  if (photoBlob) {
    const res = await uploadReportPhoto(photoBlob)
    photoUrl = res.url
    photoFailed = Boolean(res.error)
  }

  // Coba maksimal 3 kali bila kode kebetulan bentrok (kolom code bersifat unik)
  let lastError = null
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = generateReportCode()
    const { error } = await supabase.from('reports').insert({
      code,
      type,
      size,
      has_odor: hasOdor,
      has_dead_fish: hasDeadFish,
      description: description || null,
      lat,
      lng,
      photo_url: photoUrl,
      location_id: locationId || null,
      priority_score: calculatePriority({ type, size, createdAt: new Date().toISOString() }),
    })
    if (!error) return { data: { code, photoFailed }, error: null }
    lastError = error
    if (error.code !== '23505') break // bukan bentrok kode, berhenti mencoba
  }
  return { data: null, error: lastError }
}

export async function getReports() {
  if (!supabase) return { data: [], error: null }
  return supabase.from('reports').select('*').order('created_at', { ascending: false })
}

// Satu laporan lengkap beserta riwayat statusnya. data = null bila tidak ditemukan.
export async function getReportByCode(code) {
  if (!supabase) return { data: null, error: new Error('NO_DB') }
  return supabase
    .from('reports')
    .select('*, report_status_history(*)')
    .eq('code', code)
    .maybeSingle()
}

// Ringkasan beberapa laporan sekaligus (untuk daftar "Laporan Saya")
export async function getReportsByCodes(codes) {
  if (!supabase || codes.length === 0) return { data: [], error: null }
  return supabase
    .from('reports')
    .select('code, type, size, status, created_at')
    .in('code', codes)
    .order('created_at', { ascending: false })
}

export async function confirmReport(reportId) {
  // TODO: tombol "Saya juga melihat ini"
  return { data: null, error: new Error('confirmReport belum dibuat') }
}

export async function updateReportStatus(reportId, status) {
  // TODO: khusus admin
  return { data: null, error: new Error('updateReportStatus belum dibuat') }
}