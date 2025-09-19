// LocalStorage utility functions

export function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function setStored<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeStored(key: string): boolean {
  try {
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export function clearStored(): boolean {
  try {
    localStorage.clear()
    return true
  } catch {
    return false
  }
}

// Form-specific storage helpers
export const FORM_STORAGE_KEYS = {
  PROFILE: 'pcas:application:profile',
  FAMILY: 'pcas:application:family',
  EDUCATION: 'pcas:application:education',
  EXTRACURRICULAR: 'pcas:application:extracurricular',
} as const

export function getFormData<T>(key: string, defaultValues: T): { values: T; status?: string; savedAt?: string } {
  return getStored(key, { values: defaultValues })
}

export function saveFormData<T>(key: string, values: T, status: string, savedAt: Date): boolean {
  return setStored(key, { values, status, savedAt: savedAt.toISOString() })
}
