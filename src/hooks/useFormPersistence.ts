import { useState, useEffect, useCallback } from 'react'

export type FormStatus = 'not_started' | 'in_progress' | 'complete'

interface UseFormPersistenceOptions<T> {
  storageKey: string
  defaultValues: T
  validationFn?: (values: T) => boolean
}

interface UseFormPersistenceReturn<T> {
  values: T
  setValues: React.Dispatch<React.SetStateAction<T>>
  status: FormStatus
  setStatus: React.Dispatch<React.SetStateAction<FormStatus>>
  savedAt: Date | null
  setSavedAt: React.Dispatch<React.SetStateAction<Date | null>>
  renderKey: number
  setRenderKey: React.Dispatch<React.SetStateAction<number>>
  saveForm: (values: T, status?: FormStatus) => void
  loadForm: () => void
}

export function useFormPersistence<T extends Record<string, any>>({
  storageKey,
  defaultValues,
  validationFn
}: UseFormPersistenceOptions<T>): UseFormPersistenceReturn<T> {
  const [values, setValues] = useState<T>(defaultValues)
  const [status, setStatus] = useState<FormStatus>('not_started')
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [renderKey, setRenderKey] = useState(0)

  const saveForm = useCallback((newValues: T, newStatus?: FormStatus) => {
    const finalStatus = newStatus || (validationFn ? (validationFn(newValues) ? 'in_progress' : 'not_started') : 'in_progress')
    const now = new Date()
    
    setValues(newValues)
    setStatus(finalStatus)
    setSavedAt(now)
    
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          values: newValues,
          status: finalStatus,
          savedAt: now.toISOString()
        })
      )
    } catch (error) {
      console.error('Failed to save form data:', error)
    }
    
    setRenderKey(k => k + 1)
  }, [storageKey, validationFn])

  const loadForm = useCallback(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw) as {
          values: T
          status?: string
          savedAt?: string
        }
        setValues({ ...defaultValues, ...parsed.values })
        setStatus((parsed.status as FormStatus) ?? 'in_progress')
        setSavedAt(parsed.savedAt ? new Date(parsed.savedAt) : null)
      }
    } catch (error) {
      console.error('Failed to load form data:', error)
    }
    setRenderKey(k => k + 1)
  }, [storageKey, defaultValues])

  useEffect(() => {
    loadForm()
  }, [loadForm])

  return {
    values,
    setValues,
    status,
    setStatus,
    savedAt,
    setSavedAt,
    renderKey,
    setRenderKey,
    saveForm,
    loadForm
  }
}
