'use client'

interface LoadingSpinnerProps {
  message?: string
  className?: string
}

export default function LoadingSpinner({ 
  message = "Loading...", 
  className = "center-wrap with-mandala with-minar" 
}: LoadingSpinnerProps) {
  return (
    <div className={className}>
      <div className="main-card p-8 text-center">
        <div className="text-lg">{message}</div>
      </div>
    </div>
  )
}
