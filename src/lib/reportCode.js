export function normalizeCode(raw = '') {
  const s = raw.toUpperCase().replace(/[^A-Z0-9]/g, '')
  if (!s) return ''
  let body = s
  if (s.length !== 6 && s.startsWith('LG')) body = s.slice(2)
  return body ? `LG-${body}` : ''
}

export const isValidCode = (code) => /^LG-[A-Z0-9]{4,12}$/.test(code)