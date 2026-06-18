// Lightweight inline SVG icon set. Stroke-based, inherits currentColor.
const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const paths = {
  home: <path d="M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />,
  list: (
    <>
      <path d="M8 6h12M8 12h12M8 18h12" />
      <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
    </>
  ),
  map: (
    <>
      <path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  fridge: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="2.4" />
      <path d="M6 10h12M9.4 6v1.5M9.4 13v2" />
    </>
  ),
  recipes: (
    <>
      <path d="M5 3v8M5 11a2.5 2.5 0 0 0 2.5-2.5V3M7.5 3v8M7.5 11V21M16.5 3c-1.8 0-3 2-3 5s1.2 4 3 4v9" />
    </>
  ),
  cart: (
    <>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3h2l2.2 12.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
    </>
  ),
  chef: (
    <>
      <path d="M7 14.5a4 4 0 1 1 1.2-7.8 3.5 3.5 0 0 1 7.6 0A4 4 0 1 1 17 14.5" />
      <path d="M7 14.5h10V19a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-4.5Z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.4 2.4M15.3 15.3l2.4 2.4M17.7 6.3l-2.4 2.4M8.7 15.3l-2.4 2.4" />,
  bell: (
    <>
      <path d="M18 8a6 6 0 1 0-12 0c0 6-2 7-2 7h16s-2-1-2-7Z" />
      <path d="M10.5 20a1.8 1.8 0 0 0 3 0" />
    </>
  ),
  chevron: <path d="m9 5 7 7-7 7" />,
  chevronLeft: <path d="m15 5-7 7 7 7" />,
  check: <path d="m5 12 4.5 4.5L19 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  leaf: (
    <>
      <path d="M5 18C5 9 12 4 20 4c0 8-5 15-14 15a6 6 0 0 1-1-.05Z" />
      <path d="M5 18C7 14 11 11 16 9" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  nav: <path d="M3 11 21 3l-8 18-2-7-8-3Z" />,
  route: (
    <>
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="5" r="2" />
      <path d="M8 19h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12.5V5a2 2 0 0 1 2-2h7.5L21 11.5a2 2 0 0 1 0 2.8l-6.7 6.7a2 2 0 0 1-2.8 0L3 12.5Z" />
      <circle cx="7.5" cy="7.5" r="1.2" />
    </>
  ),
  card: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 9.5h19" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 6M21 20a6 6 0 0 0-4-5.6" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L16.2 2h-4l-.4 2.7a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2l.4 2.7h4l.4-2.7a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5A7 7 0 0 0 19 12Z" />
    </>
  ),
  wifi: <path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0M12 19h.01" />,
  flame: (
    <path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-1.5.7-2.8 1.5-3.5C8.5 10 9 11 9 11s.5-3 3-8Z" />
  ),
}

export default function Icon({ name, size = 24, strokeWidth, className, style }) {
  const p = paths[name]
  if (!p) return null
  return (
    <svg
      {...base}
      width={size}
      height={size}
      strokeWidth={strokeWidth || base.strokeWidth}
      className={className}
      style={style}
      aria-hidden="true"
    >
      {p}
    </svg>
  )
}
