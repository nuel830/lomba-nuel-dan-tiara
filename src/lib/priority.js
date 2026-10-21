import { REPORT_TYPES, AREA_SIZES } from './constants.js'

// skor = bobot jenis x bobot luas + jumlah konfirmasi + lama menunggu (hari)
export function calculatePriority({ type, size, confirmations = 0, createdAt }) {
  const typeWeight = REPORT_TYPES.find((t) => t.value === type)?.weight ?? 1
  const sizeWeight = AREA_SIZES.find((s) => s.value === size)?.weight ?? 1
  const days = createdAt
    ? Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000)
    : 0
  return typeWeight * sizeWeight + confirmations + days
}