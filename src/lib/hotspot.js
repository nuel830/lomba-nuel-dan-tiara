import { CLUSTER_RADIUS_METERS } from './constants.js'
import { calculatePriority } from './priority.js'

// Jarak dua titik di bumi (meter), rumus haversine
export function distanceMeters(a, b) {
  const R = 6371000
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// Skor prioritas "hidup": ikut naik seiring lama laporan menunggu
export const liveScore = (r) =>
  calculatePriority({
    type: r.type,
    size: r.size,
    confirmations: r.confirmations ?? 0,
    createdAt: r.created_at,
  })

// Tingkat titik rawan dari total skor
export function hotspotLevel(score) {
  if (score >= 15) return 'high'
  if (score >= 8) return 'medium'
  return 'low'
}

// Mengelompokkan laporan yang saling berdekatan (<= radius meter, rantai antar-laporan
// dihitung satu kelompok). Kelompok berisi 2 laporan atau lebih = titik rawan.
// Diurutkan dari skor tertinggi.
export function buildHotspots(reports, radius = CLUSTER_RADIUS_METERS) {
  const n = reports.length
  const parent = Array.from({ length: n }, (_, i) => i)
  const find = (i) => {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]]
      i = parent[i]
    }
    return i
  }
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (distanceMeters(reports[i], reports[j]) <= radius) parent[find(i)] = find(j)
    }
  }

  const groups = new Map()
  reports.forEach((r, i) => {
    const root = find(i)
    if (!groups.has(root)) groups.set(root, [])
    groups.get(root).push(r)
  })

  return [...groups.values()]
    .filter((g) => g.length >= 2)
    .map((members) => {
      const lat = members.reduce((s, r) => s + r.lat, 0) / members.length
      const lng = members.reduce((s, r) => s + r.lng, 0) / members.length
      const center = { lat, lng }
      const maxDist = Math.max(...members.map((r) => distanceMeters(center, r)))
      const score = members.reduce((s, r) => s + liveScore(r), 0)

      const typeCount = {}
      members.forEach((r) => { typeCount[r.type] = (typeCount[r.type] ?? 0) + 1 })
      const topType = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0][0]

      return {
        id: members.map((r) => r.code).sort().join('|'),
        lat,
        lng,
        count: members.length,
        score,
        level: hotspotLevel(score),
        topType,
        radius: Math.max(150, Math.round(maxDist + 80)),
        reports: members,
      }
    })
    .sort((a, b) => b.score - a.score)
}