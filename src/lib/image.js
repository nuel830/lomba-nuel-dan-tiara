// Validasi dan kompres foto di browser sebelum diunggah.
// Sinyal di sekitar Toba sering lemah, jadi foto dikecilkan dulu (maks. 1280 px, JPEG).

export const MAX_PHOTO_BYTES = 10 * 1024 * 1024 // 10 MB sebelum dikompres
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// Mengembalikan 'invalid' | 'toobig' | null (null = lolos)
export function validateImage(file) {
  if (!file || !ACCEPTED_TYPES.includes(file.type)) return 'invalid'
  if (file.size > MAX_PHOTO_BYTES) return 'toobig'
  return null
}

export async function compressImage(file, maxSide = 1280, quality = 0.8) {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff' // latar putih untuk PNG transparan
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close?.()

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Gagal mengompres foto'))),
      'image/jpeg',
      quality
    )
  })
}