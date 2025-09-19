'use client'

interface SectionAnchorProps {
  id: string
  title: string
  className?: string
}

export default function SectionAnchor({ id, title, className = "" }: SectionAnchorProps) {
  return (
    <section id={id} className={`anchor-target ${className}`}>
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
    </section>
  )
}
