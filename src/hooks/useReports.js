import { useEffect, useState } from 'react'
import { getReports } from '../services/reportService.js'

export function useReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getReports().then(({ data, error }) => {
      setReports(data ?? [])
      setError(error)
      setLoading(false)
    })
  }, [])

  return { reports, loading, error }
}