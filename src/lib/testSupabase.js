
import { supabase } from './supabase'

export async function testSupabase() {
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
