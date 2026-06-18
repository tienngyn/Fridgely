// Fridgely app icon — a friendly fridge mark with a leaf, on a gradient squircle.
export default function Logo({ size = 96, radius }) {
  const r = radius ?? size * 0.27
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: r,
        background: 'linear-gradient(140deg, #34d399 0%, #3b82f6 100%)',
        boxShadow: '0 18px 38px rgba(52, 211, 153, 0.45), inset 0 2px 4px rgba(255,255,255,0.4)',
        display: 'grid',
        placeItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          left: '-20%',
          width: '90%',
          height: '90%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.45), transparent 70%)',
        }}
      />
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 48 48" fill="none">
        <rect x="13" y="6" width="22" height="36" rx="6" fill="#fff" />
        <rect x="13" y="22" width="22" height="1.8" fill="#cbd5e1" />
        <rect x="17.5" y="13" width="2.6" height="6" rx="1.3" fill="#34d399" />
        <rect x="17.5" y="27" width="2.6" height="8" rx="1.3" fill="#3b82f6" />
        <path d="M30 9c3.4.4 5.6 3 5.4 6.5C32 16 29.6 13.6 30 9Z" fill="#34d399" />
      </svg>
    </div>
  )
}
