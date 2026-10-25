import { useCallback, useEffect, useState } from 'react'
import { getReports } from '../services/reportService.js'

export function useReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await getReports()
    setReports(data ?? [])
    setError(error)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { reports, loading, error, reload: load }
}