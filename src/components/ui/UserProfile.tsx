'use client'

import { useAuth } from '@/app/redux/hooks'

interface UserProfileProps {
  showEmail?: boolean
  className?: string
}

export default function UserProfile({ showEmail = true, className = "" }: UserProfileProps) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return null
  }

  const deriveInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/)
    const first = parts[0]?.[0] || ""
    const last = parts.length > 1 ? parts[parts.length - 1][0] : ""
    return (first + last).toUpperCase() || "U"
  }

  return (
    <div className={`flex items-center gap-3 rounded-xl p-3 text-sm main-card ${className}`}>
      <div className="grid h-9 w-9 place-items-center rounded-full" style={{ background: "var(--emerald)", color: "white" }}>
        {deriveInitials(user.fullName)}
      </div>
      <div>
        <div className="font-medium leading-tight">{user.fullName}</div>
        {showEmail && (
          <div className="text-xs text-gray-500">{user.email}</div>
        )}
      </div>
    </div>
  )
}
