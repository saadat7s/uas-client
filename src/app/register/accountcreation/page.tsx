'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import logo from '@/public/Logo.png'
import Footer from '@/components/Footer'

// Keep types close to usage for clarity
interface FormData {
  email: string
  password: string
  fullName: string
  dob: string
  phone: string
  address: string
}

export default function AccountCreationPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [data, setData] = useState<FormData>({
    email: '',
    password: '',
    fullName: '',
    dob: '',
    phone: '',
    address: '',
  })

  const pw = data.password
  const rules = useMemo(
    () => ({
      len: pw.length >= 10 && pw.length <= 32,
      upper: /[A-Z]/.test(pw),
      lower: /[a-z]/.test(pw),
      num: /[0-9]/.test(pw),
      special: /[^A-Za-z0-9]/.test(pw),
      nospace: !/\s/.test(pw),
    }),
    [pw]
  )
  const pwOk = Object.values(rules).every(Boolean)

  const onChange = (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setData((d) => ({ ...d, [k]: e.target.value }))

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!pwOk) return
    // TODO: replace with a Server Action or API call
    console.log('payload:', data)
    alert('Submitted (check console) ✅')
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {/* CONTENT */}
      <main className="flex-1 center-wrap with-mandala">
        <div className="center-content relative z-[1] w-full max-w-[720px]">
          {/* Header/logo */}
          <div className="logo-slot-floating mb-6 flex justify-center">
            <Image src={logo} alt="PCAS logo" width={200} height={200} priority />
          </div>

          {/* Card */}
          <section className="main-card p-6 sm:p-8 shadow-xl/10">
            <header>
              <h1 className="title-primary">Create your account</h1>
              <p className="title-secondary">It only takes a minute</p>
            </header>

            <form onSubmit={onSubmit} className="mt-6 grid gap-6">
              {/* Account information */}
              <fieldset className="grid gap-4">
                <legend className="text-sm font-semibold text-[var(--pakistan-green-600)] mb-1">
                  Account information
                </legend>

                <Field
                  label="Email Address"
                  required
                  type="email"
                  placeholder="you@example.com"
                  value={data.email}
                  onChange={onChange('email')}
                  autoComplete="email"
                  inputMode="email"
                />

                <div>
                  <label className="mb-1 block text-sm font-semibold text-[var(--pakistan-green-600)]">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      required
                      value={data.password}
                      onChange={onChange('password')}
                      autoComplete="new-password"
                      placeholder="Create a strong password"
                      className="w-full h-11 rounded-xl border border-emerald-200/70 px-3 pr-24 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200/40"
                      aria-describedby="pw-rules"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      className="absolute right-1.5 top-1.5 h-8 rounded-lg border border-emerald-200/70 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-emerald-50"
                      aria-pressed={showPw}
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                    >
                      {showPw ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {/* password rules */}
                  <ul id="pw-rules" className="mt-2 grid gap-1.5 text-xs text-slate-600">
                    <Rule ok={rules.len} text="10–32 characters" />
                    <Rule ok={rules.upper} text="At least one upper case" />
                    <Rule ok={rules.lower} text="At least one lower case" />
                    <Rule ok={rules.num} text="At least one number" />
                    <Rule ok={rules.special} text="At least one special character" />
                    <Rule ok={rules.nospace} text="No spaces" />
                  </ul>
                </div>
              </fieldset>

              {/* Personal information */}
              <fieldset className="grid gap-4">
                <legend className="text-sm font-semibold text-[var(--pakistan-green-600)] mb-1">
                  Personal information
                </legend>

                <Field
                  label="Legal full name"
                  required
                  type="text"
                  placeholder="First Middle Last"
                  value={data.fullName}
                  onChange={onChange('fullName')}
                  autoComplete="name"
                />

                <Field
                  label="Date of birth"
                  required
                  type="date"
                  value={data.dob}
                  onChange={onChange('dob')}
                  max={new Date().toISOString().slice(0, 10)}
                />
              </fieldset>

              {/* Contact details */}
              <fieldset className="grid gap-4">
                <legend className="text-sm font-semibold text-[var(--pakistan-green-600)] mb-1">
                  Contact details
                </legend>

                <Field
                  label="Phone number"
                  required
                  type="tel"
                  placeholder="+92 300 1234567"
                  value={data.phone}
                  onChange={onChange('phone')}
                  autoComplete="tel"
                  pattern="^[+()\- 0-9]{7,}$"
                  inputMode="tel"
                />

                <Field
                  label="Permanent home address"
                  required
                  type="text"
                  placeholder="Street, City, Province, Postal code, Country"
                  value={data.address}
                  onChange={onChange('address')}
                  autoComplete="street-address"
                />
              </fieldset>

              {/* Actions */}
              <div className="mt-2 flex flex-col sm:flex-row sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="outline-button"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!pwOk}
                  className="normal-button"
                >
                  Create account
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?
              <a href="/Login" className="link-primary ml-1">
                Go to the login page
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* FOOTER (sticks to bottom when content is short) */}
      <Footer />
    </div>
  )
}

function Field(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }
) {
  const { label, required, ...rest } = props
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-[var(--pakistan-green-600)]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...rest}
        required={required}
        className="w-full h-11 rounded-xl border border-emerald-200/70 px-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200/40"
      />
    </div>
  )
}

function Rule({ ok, text }: { ok: boolean; text: string }) {
  return (
    <li className="flex items-center gap-2" role="status" aria-live="polite">
      <span
        className={`h-2.5 w-2.5 rounded-full ${ok ? 'bg-green-600' : 'bg-red-500'}`}
        aria-hidden
      />
      <span>{text}</span>
    </li>
  )
}
