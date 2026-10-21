
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import './ReportForm.css'

const issueOptions = [
  { value: 'sampah', label: 'Sampah', icon: '🗑️' },
  { value: 'pencemaran', label: 'Pencemaran Air', icon: '💧' },
  { value: 'ikan_mati', label: 'Ikan Mati', icon: '🐟' },
  { value: 'bau', label: 'Bau Tidak Biasa', icon: '〰️' },
  { value: 'lainnya', label: 'Lainnya', icon: '🌿' },
]

const areaOptions = [
  { value: 'kecil', label: 'Kecil', color: 'green' },
  { value: 'sedang', label: 'Sedang', color: 'blue' },
  { value: 'besar', label: 'Besar', color: 'purple' },
]

export default function ReportForm() {
  const [issueType, setIssueType] = useState('')
  const [areaSize, setAreaSize] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  function getLocation() {
    setMessage('')

    if (!navigator.geolocation) {
      setMessage('Browser tidak mendukung fitur GPS.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        })
        setMessage('Lokasi berhasil didapatkan.')
        setSuccess(true)
      },
      () => {
        setMessage('Lokasi gagal diambil. Izinkan akses lokasi di browser.')
        setSuccess(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setSuccess(false)

    if (!issueType || !areaSize) {
      setMessage('Pilih jenis masalah dan luas area terlebih dahulu.')
      return
    }

    setLoading(true)

    const reportCode = `LG-${Date.now().toString(36).toUpperCase()}`

    try {
      const { error } = await supabase.from('reports').insert({
        report_code: reportCode,
        issue_type: issueType,
        area_size: areaSize,
        description: description.trim() || null,
        latitude: location?.latitude ?? null,
        longitude: location?.longitude ?? null,
      })

      if (error) throw error

      setMessage(`Laporan berhasil dikirim! Kode laporan: ${reportCode}`)
      setSuccess(true)
      setIssueType('')
      setAreaSize('')
      setDescription('')
      setLocation(null)
    } catch (error) {
      console.error('Gagal menyimpan laporan:', error)
      setMessage(`Laporan gagal disimpan: ${error.message}`)
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="lg-report-form" onSubmit={handleSubmit}>
      <div className="lg-form-heading">
        <div className="lg-heading-icon">📋</div>
        <div>
          <h2>Formulir Laporan</h2>
          <p>Isi informasi berikut dengan lengkap dan akurat.</p>
        </div>
      </div>

      <div className="lg-form-section">
        <div className="lg-section-title">
          <span className="lg-step">1</span>
          <div>
            <h3>Jenis Masalah</h3>
            <p>Pilih masalah yang kamu temukan di sekitar danau.</p>
          </div>
        </div>

        <div className="lg-issue-grid">
          {issueOptions.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`lg-choice-card ${
                issueType === item.value ? 'selected' : ''
              }`}
              onClick={() => setIssueType(item.value)}
              aria-pressed={issueType === item.value}
            >
              <span className="lg-choice-icon">{item.icon}</span>
              <span>{item.label}</span>
              {issueType === item.value && (
                <span className="lg-selected-mark">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="lg-form-section">
        <div className="lg-section-title">
          <span className="lg-step">2</span>
          <div>
            <h3>Luas Area Terdampak</h3>
            <p>Perkirakan luas area yang terdampak.</p>
          </div>
        </div>

        <div className="lg-area-grid">
          {areaOptions.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`lg-area-card ${item.color} ${
                areaSize === item.value ? 'selected' : ''
              }`}
              onClick={() => setAreaSize(item.value)}
              aria-pressed={areaSize === item.value}
            >
              <span className="lg-area-dot" />
              <span>{item.label}</span>
              {areaSize === item.value && (
                <span className="lg-selected-mark">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="lg-form-section">
        <div className="lg-section-title">
          <span className="lg-step">3</span>
          <div>
            <h3>Deskripsi Laporan</h3>
            <p>Ceritakan kondisi yang kamu lihat.</p>
          </div>
        </div>

        <textarea
          className="lg-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Contoh: Sampah plastik terlihat menumpuk di tepi danau..."
          rows={5}
          maxLength={500}
        />
        <div className="lg-character-count">{description.length}/500</div>
      </div>

      <div className="lg-form-section">
        <div className="lg-section-title">
          <span className="lg-step">4</span>
          <div>
            <h3>Lokasi GPS</h3>
            <p>Tambahkan lokasi agar masalah mudah ditemukan.</p>
          </div>
        </div>

        <div className="lg-location-panel">
          <div className="lg-location-symbol">📍</div>
          <div className="lg-location-info">
            <strong>{location ? 'Lokasi terdeteksi' : 'Lokasi belum ditambahkan'}</strong>
            <p>
              {location
                ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
                : 'Tekan tombol untuk mengambil lokasi kamu.'}
            </p>
          </div>
          <span className="lg-location-status">
            {location ? '✓' : '○'}
          </span>
        </div>

        <button
          type="button"
          className="lg-gps-button"
          onClick={getLocation}
        >
          <span>◎</span> Ambil Lokasi Sekarang
        </button>
      </div>

      {message && (
        <div
          className={`lg-form-message ${success ? 'success' : 'error'}`}
          role="status"
        >
          {message}
        </div>
      )}

      <button
        className="lg-submit-button"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Mengirim laporan...' : '➤  Kirim Laporan'}
      </button>

      <p className="lg-privacy-note">
        🌱 Terima kasih sudah ikut menjaga kebersihan danau kita.
      </p>
    </form>
  )
}
