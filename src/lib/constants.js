// Pusat konstanta. Ubah di sini, seluruh web ikut berubah.

// Titik tengah peta (kira-kira Danau Toba). Sesuaikan nanti.
export const MAP_CENTER = [2.65, 98.85]
export const MAP_ZOOM = 10

export const REPORT_TYPES = [
  { value: 'plastic', icon: '🧴', weight: 3 },
  { value: 'effluent', icon: '🏭', weight: 5 },
  { value: 'hyacinth', icon: '🌿', weight: 2 },
  { value: 'turbid', icon: '💧', weight: 3 },
  { value: 'other', icon: '❓', weight: 1 },
]

export const AREA_SIZES = [
  { value: 'small', weight: 1 },
  { value: 'medium', weight: 2 },
  { value: 'large', weight: 3 },
]

// Siklus status laporan (urutan penting)
export const REPORT_STATUSES = ['reported', 'verified', 'scheduled', 'cleaned']

export const CLUSTER_RADIUS_METERS = 200