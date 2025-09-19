'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import logo from '@/public/Logo.png'
import Footer from '@/components/Footer'
import { useAuth } from '@/app/redux/hooks'
import { loginUser, clearError } from '@/app/redux/features/auth'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoading, error, isAuthenticated, dispatch } = useAuth()
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Check for registration success message
  useEffect(() => {
    const message = searchParams.get('message')
    if (message === 'registration-success') {
      setShowSuccessMessage(true)
      // Clear the URL parameter
      const newUrl = window.location.pathname
      window.history.replaceState(null, '', newUrl)
      
      // Hide success message after 10 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 10000)
    }
  }, [searchParams])
  
  // Form validation
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const canSubmit = isValidEmail && password.length > 0 && !isLoading

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/Dashboard')
    }
  }, [isAuthenticated, router])

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return

    // Clear any previous errors
    dispatch(clearError())

    try {
      const result = await dispatch(loginUser({ email, password }))
      
      if (loginUser.fulfilled.match(result)) {
        // Login successful, redirect to dashboard
        router.push('/Dashboard')
      }
    } catch (error) {
      // Error is handled by Redux, just prevent form submission
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <main className="flex-1 center-wrap with-mandala with-minar" role="main">
        <div className="center-content relative z-[1] w-full max-w-[560px]">
          {/* Logo */}
          <div className="logo-slot-floating mb-6 flex justify-center">
            <Image src={logo} alt="PCAS logo" width={200} height={200} priority />
          </div>

          {/* Card */}
          <section className="main-card p-6 sm:p-8">
            <h1 className="title-primary">Welcome back</h1>
            <p className="title-secondary">Sign in to continue</p>

            <form onSubmit={onSubmit} className="mt-6 grid gap-5">
              {/* Success message */}
              {showSuccessMessage && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 relative">
                  <div className="text-sm text-green-700 font-medium pr-8">
                    ✅ Account created successfully! Please log in to continue.
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSuccessMessage(false)}
                    className="absolute top-2 right-2 text-green-600 hover:text-green-800 p-1"
                    aria-label="Close message"
                  >
                    ✕
                  </button>
                </div>
              )}
              
              {/* Error display */}
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                  <div className="text-sm text-red-700 font-medium">
                    {error}
                  </div>
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-semibold text-[var(--pakistan-green-600)]">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  className={`w-full h-11 rounded-xl border px-3 outline-none transition focus:ring-4 ${
                    email && !isValidEmail 
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-200/40' 
                      : 'border-emerald-200/70 focus:border-emerald-400 focus:ring-emerald-200/40'
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {email && !isValidEmail && (
                  <p className="mt-1 text-xs text-red-600">Please enter a valid email address</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-[var(--pakistan-green-600)]">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Your password"
                    className="w-full h-11 rounded-xl border border-emerald-200/70 px-3 pr-24 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200/40"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-1.5 top-1.5 h-8 px-3 text-xs font-semibold text-slate-700 bg-white border border-emerald-200/70 rounded-lg hover:bg-emerald-50"
                    aria-pressed={showPw}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2 select-none">
                    <input 
                      type="checkbox" 
                      className="accent-[var(--pakistan-green-600)]"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                  </label>
                  <button type="button" className="link-primary">Forgot password?</button>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-2 grid grid-cols-1 sm:flex sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/register/accountcreation')}
                  className="outline-button"
                  disabled={isLoading}
                >
                  Create an account
                </button>
                <button type="submit" className="normal-button" disabled={!canSubmit}>
                  {isLoading ? 'Signing in…' : 'Sign in'}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              By continuing you agree to our <a className="link-primary" href="#">Terms</a> and
              <span> </span>
              <a className="link-primary" href="#">Privacy Policy</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer/>
    </div>
  )
}
