import { supabase } from './supabaseClient.js'

export async function testSupabase() {
  if (!supabase) {
    console.warn('Supabase belum dikonfigurasi. Cek file .env')
    return
  }

  const { data, error } = await supabase
    .from('reports')
    .select('id')
    .limit(1)

  if (error) {
    console.error('Koneksi Supabase gagal:', error.message)
    return
  }

  console.log('Supabase berhasil terhubung!', data)
}