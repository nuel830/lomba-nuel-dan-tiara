import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { REPORT_TYPES, AREA_SIZES } from '../../lib/constants.js'
import { validateImage, compressImage } from '../../lib/image.js'
import { createReport } from '../../services/reportService.js'
import LocationPicker from '../map/LocationPicker.jsx'
import ReportSuccess from './ReportSuccess.jsx'
import './ReportForm.css'
import './ReportFormExtra.css'

const SIZE_COLORS = { small: 'green', medium: 'blue', large: 'purple' }
const MY_REPORTS_KEY = 'lg_my_reports'

function rememberCode(code) {
  try {
    const list = JSON.parse(localStorage.getItem(MY_REPORTS_KEY) || '[]')
    localStorage.setItem(MY_REPORTS_KEY, JSON.stringify([code, ...list].slice(0, 50)))
  } catch {
    // localStorage bisa diblokir; tidak masalah
  }
}

export default function ReportForm({ locationId }) {
  const { t } = useLanguage()
  const formRef = useRef(null)
  const fileInputRef = useRef(null)

  const [type, setType] = useState('')
  const [size, setSize] = useState('')
  const [hasOdor, setHasOdor] = useState(false)
  const [hasDeadFish, setHasDeadFish] = useState(false)
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState(null) // { blob, previewUrl, sizeKB }
  const [position, setPosition] = useState(null) // { lat, lng, accuracy, fly }
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsMessage, setGpsMessage] = useState('')
  const [photoError, setPhotoError] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [result, setResult] = useState(null)

  // Bersihkan URL pratinjau foto saat diganti atau form ditutup
  useEffect(() => () => photo && URL.revokeObjectURL(photo.previewUrl), [photo])

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0]
    event.target.value = '' // agar file yang sama bisa dipilih ulang
    if (!file) return
    setPhotoError('')

    const problem = validateImage(file)
    if (problem) {
      setPhotoError(t(problem === 'toobig' ? 'form.photo.toobig' : 'form.photo.invalid'))
      return
    }
    try {
      const blob = await compressImage(file)
      setPhoto({ blob, previewUrl: URL.createObjectURL(blob), sizeKB: Math.round(blob.size / 1024) })
    } catch {
      setPhotoError(t('form.photo.failed'))
    }
  }

  function getLocation() {
    setGpsMessage('')
    if (!navigator.geolocation) {
      setGpsMessage(t('form.gps.unsupported'))
      return
    }
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({ lat: coords.latitude, lng: coords.longitude, accuracy: coords.accuracy, fly: true })
        setErrors((e) => ({ ...e, location: undefined }))
        setGpsMessage('')
        setGpsLoading(false)
      },
      (err) => {
        const key = err.code === 1 ? 'denied' : err.code === 3 ? 'timeout' : 'unavailable'
        setGpsMessage(t(`form.gps.${key}`))
        setGpsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  }

  function pickPosition(p) {
    setPosition(p)
    setGpsMessage('')
    setErrors((e) => ({ ...e, location: undefined }))
  }

  function validate() {
    const next = {}
    if (!type) next.type = t('form.err.type')
    if (!size) next.size = t('form.err.size')
    if (!position) next.location = t('form.err.location')
    return next
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting) return
    setSubmitError('')

    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) {
      // Gulir ke pesan kesalahan pertama
      requestAnimationFrame(() =>
        formRef.current?.querySelector('.lg-field-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      )
      return
    }

    setSubmitting(true)
    const { data, error } = await createReport({
      type,
      size,
      hasOdor,
      hasDeadFish,
      description: description.trim(),
      lat: position.lat,
      lng: position.lng,
      locationId,
      photoBlob: photo?.blob ?? null,
    })
    setSubmitting(false)

    if (error) {
      console.error('Gagal menyimpan laporan:', error)
      if (error.message === 'NO_DB') setSubmitError(t('form.err.nodb'))
      else if (/failed to fetch|network/i.test(error.message)) setSubmitError(t('form.err.network'))
      else setSubmitError(t('form.err.generic') + error.message)
      return
    }

    rememberCode(data.code)
    setResult(data)
  }

  function resetForm() {
    setType(''); setSize(''); setHasOdor(false); setHasDeadFish(false)
    setDescription(''); setPhoto(null); setPosition(null)
    setErrors({}); setSubmitError(''); setGpsMessage(''); setPhotoError('')
    setResult(null)
  }

  if (result) {
    return <ReportSuccess code={result.code} photoFailed={result.photoFailed} onNew={resetForm} />
  }

  return (
    <form className="lg-report-form" onSubmit={handleSubmit} ref={formRef} noValidate>
      <div className="lg-form-heading">
        <div className="lg-heading-icon">📋</div>
        <div>
          <h2>{t('form.title')}</h2>
          <p>{t('form.subtitle')}</p>
          {locationId && <span className="lg-qr-badge">{t('form.qr.from')}: {locationId}</span>}
        </div>
      </div>

      {/* 1. Jenis masalah */}
      <div className="lg-form-section">
        <div className="lg-section-title">
          <span className="lg-step">1</span>
          <div>
            <h3>{t('form.step1.title')}</h3>
            <p>{t('form.step1.desc')}</p>
          </div>
        </div>
        <div className="lg-issue-grid">
          {REPORT_TYPES.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`lg-choice-card ${type === item.value ? 'selected' : ''}`}
              onClick={() => { setType(item.value); setErrors((e) => ({ ...e, type: undefined })) }}
              aria-pressed={type === item.value}
            >
              <span className="lg-choice-icon">{item.icon}</span>
              <span>{t(`type.${item.value}`)}</span>
              {type === item.value && <span className="lg-selected-mark">✓</span>}
            </button>
          ))}
        </div>
        {errors.type && <p className="lg-field-error">{errors.type}</p>}
      </div>

      {/* 2. Luas area */}
      <div className="lg-form-section">
        <div className="lg-section-title">
          <span className="lg-step">2</span>
          <div>
            <h3>{t('form.step2.title')}</h3>
            <p>{t('form.step2.desc')}</p>
          </div>
        </div>
        <div className="lg-area-grid">
          {AREA_SIZES.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`lg-area-card ${SIZE_COLORS[item.value]} ${size === item.value ? 'selected' : ''}`}
              onClick={() => { setSize(item.value); setErrors((e) => ({ ...e, size: undefined })) }}
              aria-pressed={size === item.value}
            >
              <span className="lg-area-dot" />
              <span>{t(`size.${item.value}`)}</span>
              <small className="lg-area-hint">{t(`size.${item.value}.hint`)}</small>
              {size === item.value && <span className="lg-selected-mark">✓</span>}
            </button>
          ))}
        </div>
        {errors.size && <p className="lg-field-error">{errors.size}</p>}
      </div>

      {/* 3. Kondisi tambahan */}
      <div className="lg-form-section">
        <div className="lg-section-title">
          <span className="lg-step">3</span>
          <div>
            <h3>{t('form.step3.title')}</h3>
            <p>{t('form.step3.desc')}</p>
          </div>
        </div>
        <div className="lg-checks">
          <label className={`lg-check ${hasOdor ? 'on' : ''}`}>
            <input type="checkbox" checked={hasOdor} onChange={(e) => setHasOdor(e.target.checked)} />
            <span>〰️ {t('form.odor')}</span>
          </label>
          <label className={`lg-check ${hasDeadFish ? 'on' : ''}`}>
            <input type="checkbox" checked={hasDeadFish} onChange={(e) => setHasDeadFish(e.target.checked)} />
            <span>🐟 {t('form.deadFish')}</span>
          </label>
        </div>
      </div>

      {/* 4. Foto */}
      <div className="lg-form-section">
        <div className="lg-section-title">
          <span className="lg-step">4</span>
          <div>
            <h3>{t('form.step4.title')}</h3>
            <p>{t('form.step4.desc')}</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          onChange={handlePhotoChange}
          hidden
          data-testid="photo-input"
        />
        {photo ? (
          <div className="lg-photo-preview">
            <img src={photo.previewUrl} alt="" />
            <div className="lg-photo-actions">
              <span className="lg-hint">{photo.sizeKB} KB</span>
              <button type="button" className="lg-btn-secondary" onClick={() => fileInputRef.current?.click()}>
                {t('form.photo.change')}
              </button>
              <button type="button" className="lg-btn-secondary danger" onClick={() => setPhoto(null)}>
                {t('form.photo.remove')}
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="lg-photo-drop" onClick={() => fileInputRef.current?.click()}>
            <span className="lg-photo-icon">📷</span>
            <span>{t('form.photo.choose')}</span>
          </button>
        )}
        {photoError && <p className="lg-field-error">{photoError}</p>}
      </div>

      {/* 5. Lokasi */}
      <div className="lg-form-section">
        <div className="lg-section-title">
          <span className="lg-step">5</span>
          <div>
            <h3>{t('form.step5.title')}</h3>
            <p>{t('form.step5.desc')}</p>
          </div>
        </div>

        <button type="button" className="lg-gps-button" onClick={getLocation} disabled={gpsLoading}>
          <span>◎</span> {gpsLoading ? t('form.gps.loading') : t('form.gps.button')}
        </button>
        {gpsMessage && <p className="lg-field-error">{gpsMessage}</p>}

        <div className="lg-map-wrap">
          <LocationPicker position={position} onPick={pickPosition} />
        </div>

        <div className="lg-location-panel">
          <div className="lg-location-symbol">📍</div>
          <div className="lg-location-info">
            <strong>{position ? t('form.loc.set') : t('form.loc.none')}</strong>
            <p data-testid="coords">
              {position
                ? `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}` +
                  (position.accuracy ? ` · ${t('form.loc.accuracy')} ${Math.round(position.accuracy)} m` : '')
                : t('form.loc.hint')}
            </p>
          </div>
          <span className="lg-location-status">{position ? '✓' : '○'}</span>
        </div>
        {errors.location && <p className="lg-field-error">{errors.location}</p>}
      </div>

      {/* 6. Deskripsi */}
      <div className="lg-form-section">
        <div className="lg-section-title">
          <span className="lg-step">6</span>
          <div>
            <h3>{t('form.step6.title')}</h3>
            <p>{t('form.step6.desc')}</p>
          </div>
        </div>
        <textarea
          className="lg-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('form.desc.placeholder')}
          rows={4}
          maxLength={500}
        />
        <div className="lg-character-count">{description.length}/500</div>
      </div>

      {submitError && (
        <div className="lg-form-message error" role="alert">{submitError}</div>
      )}

      <button className="lg-submit-button" type="submit" disabled={submitting}>
        {submitting ? t('form.submitting') : `➤  ${t('form.submit')}`}
      </button>

      <p className="lg-privacy-note">🌱 {t('form.thanks')}</p>
    </form>
  )
}