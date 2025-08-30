'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import logo from '@/public/Logo.png'
import Footer from '@/components/Footer'

export default function LoginPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const canSubmit = email.trim().length > 3 && password.length > 0 && !loading

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return

    setLoading(true)

    /* ======================================================
       🔌 BACKEND INTEGRATION (commented placeholders)
       ------------------------------------------------------
       Choose one of the two patterns below and delete the other
       once your backend engineer provides endpoints.

       Pattern A) Call a REST endpoint
       ------------------------------------------------------
       try {
         const res = await fetch('/api/auth/login', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ email, password }),
           // credentials: 'include' // if backend sets HTTP-only cookies
         })
         if (!res.ok) throw new Error('Invalid credentials')

         // Example response expectations:
         // { user: {...}, accessToken: '...', refreshToken: '...' }
         // const data = await res.json()
         // TODO: store tokens in memory or rely on httpOnly cookies

         // On success, route to dashboard/home
         // router.replace('/dashboard')
       } catch (err) {
         // TODO: surface error toast/UI state
         console.error(err)
       } finally {
         setLoading(false)
       }

       Pattern B) Server Action (Node runtime)
       ------------------------------------------------------
       // 'use server' action example living in the same route folder:
       // export async function loginAction(formData: FormData) { ... }
       // await loginAction(new FormData(e.currentTarget))
       // router.replace('/dashboard')
       ====================================================== */

    // Temporary UX while backend is not wired
    setTimeout(() => {
      setLoading(false)
      alert('Login submitted (mock) — check console ✅')
      console.log('payload:', { email, password: '[redacted] ' })
    }, 400)
  }

  return (
    <>
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
              <div>
                <label className="mb-1 block text-sm font-semibold text-[var(--pakistan-green-600)]">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  className="w-full h-11 rounded-xl border border-emerald-200/70 px-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200/40"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
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
                    <input type="checkbox" className="accent-[var(--pakistan-green-600)]" />
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
                >
                  Create an account
                </button>
                <button type="submit" className="normal-button" disabled={!canSubmit}>
                  {loading ? 'Signing in…' : 'Sign in'}
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
      </>
  )
}
