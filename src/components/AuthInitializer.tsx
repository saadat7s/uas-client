'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/app/redux/hooks'
import { getCurrentUser, initializeAuth } from '@/app/redux/features/auth'

export default function AuthInitializer() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initializeAuth())
    
    // If token exists, fetch current user data
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(getCurrentUser())
    }
  }, [dispatch])

  return null
}
