// Fridgely app icon — a location pin holding a shopping cart (store) and a
// fridge, on a green→blue gradient squircle. Matches public/icon.svg.
export default function Logo({ size = 96, radius }) {
  const r = radius ?? size * 0.23
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: r,
        overflow: 'hidden',
        boxShadow: '0 18px 38px rgba(52, 211, 153, 0.4)',
      }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" aria-label="Fridgely">
        <defs>
          <linearGradient id="logoBg" gradientUnits="userSpaceOnUse" x1="20" y1="0" x2="80" y2="100">
            <stop offset="0" stopColor="#5ec47f" />
            <stop offset="0.5" stopColor="#3fb6a0" />
            <stop offset="1" stopColor="#2f8fe6" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="100" height="100" rx="24" fill="url(#logoBg)" />

        <path
          d="M50 12 C33 12 20 25 20 41 C20 60 41 70 50 87 C59 70 80 60 80 41 C80 25 67 12 50 12 Z"
          fill="none" stroke="#fff" strokeWidth="6.4" strokeLinejoin="round"
        />

        <g transform="translate(22.5 31) scale(1.28)" fill="none" stroke="#fff"
           strokeWidth="3.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 1h3.2l2.4 12.2a1.7 1.7 0 0 0 1.7 1.4h8.6a1.7 1.7 0 0 0 1.7-1.4L20.4 5H5.2" />
          <path d="M8 9h9.5M8.7 12h8.2" />
          <circle cx="8.4" cy="19.4" r="1.5" fill="#fff" stroke="none" />
          <circle cx="16.8" cy="19.4" r="1.5" fill="#fff" stroke="none" />
        </g>

        <g>
          <rect x="55" y="34" width="14.5" height="31" rx="3.4" fill="#fff" />
          <rect x="55" y="47" width="14.5" height="1.8" fill="url(#logoBg)" />
          <rect x="58" y="38" width="2" height="6" rx="1" fill="url(#logoBg)" />
          <rect x="58" y="51.5" width="2" height="8" rx="1" fill="url(#logoBg)" />
        </g>
      </svg>
    </div>
  )
}
