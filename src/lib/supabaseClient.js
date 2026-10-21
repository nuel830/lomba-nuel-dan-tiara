import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && key)

if (!isSupabaseConfigured) {
  console.warn('[LakeGuard] .env belum diisi. Salin .env.example menjadi .env')
}

export const supabase = isSupabaseConfigured ? createClient(url, key) : null