import L from 'leaflet'
import { REPORT_TYPES } from '../../lib/constants.js'

const cache = new Map()

// Penanda berbentuk tetesan: warna sesuai jenis, memudar bila sudah dibersihkan.
export function pinIcon(type, status) {
  const key = `${type}-${status}`
  if (!cache.has(key)) {
    const emoji = REPORT_TYPES.find((x) => x.value === type)?.icon ?? '❓'
    cache.set(
      key,
      L.divIcon({
        className: 'lg-pin-wrap',
        html: `<div class="lg-pin ${type} ${status}"><span>${emoji}</span></div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -32],
      })
    )
  }
  return cache.get(key)
}