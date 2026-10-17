import type { ReactNode } from 'react'

type IconName =
  | 'book'
  | 'chart'
  | 'check'
  | 'chevron'
  | 'clock'
  | 'flame'
  | 'grid'
  | 'home'
  | 'layers'
  | 'message'
  | 'menu'
  | 'play'
  | 'sparkles'
  | 'stethoscope'
  | 'target'
  | 'users'
  | 'x'

const PATHS: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10M9 20v-6h6v6" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </>
  ),
  stethoscope: (
    <>
      <path d="M6 3v5a4 4 0 0 0 8 0V3M4 3h4M12 3h4" />
      <path d="M10 12v2a5 5 0 0 0 10 0v-1" />
      <circle cx="20" cy="11" r="2" />
    </>
  ),
  flame: (
    <path d="M12 22c4.4 0 7-3 7-7.2 0-3.5-2-6.5-5.5-9.5.2 3-1.2 4.2-2.4 3.4C10 8 10 5.8 10.5 2 6 5.2 5 9.3 5 13.5 5 18.2 7.8 22 12 22Z" />
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  play: <path d="m8 5 11 7-11 7Z" />,
  layers: (
    <>
      <path d="m12 2 9 5-9 5-9-5Z" />
      <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  sparkles: (
    <>
      <path d="m12 3-1.2 3.2L8 7.5l2.8 1.3L12 12l1.2-3.2L16 7.5l-2.8-1.3Z" />
      <path d="m19 14-.8 2.2-2.2.8 2.2.8L19 20l.8-2.2L22 17l-2.2-.8Z" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
    </>
  ),
  message: (
    <>
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
      <path d="M8 9h8M8 13h5" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  x: (
    <>
      <path d="M6 6l12 12M18 6 6 18" />
    </>
  ),
}

export function MedIcon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {PATHS[name]}
    </svg>
  )
}
