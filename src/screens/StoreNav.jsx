import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from '../components/Icon'

// Maneuver glyph (clear turn icons like a real nav app)
function Maneuver({ dir, size = 28 }) {
  const c = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round',
  }
  if (dir === 'right') return <svg {...c}><path d="M8 21v-8a3 3 0 0 1 3-3h6" /><path d="M14 6l4 4-4 4" /></svg>
  if (dir === 'left') return <svg {...c}><path d="M16 21v-8a3 3 0 0 0-3-3H7" /><path d="M10 6l-4 4 4 4" /></svg>
  return <svg {...c}><path d="M12 21V5" /><path d="M6 11l6-6 6 6" /></svg>
}

const dist2 = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

export default function StoreNav({ product, onClose, onArrived }) {
  // Build a route through the store (SVG coords) with one turn at the aisle.
  const route = useMemo(() => {
    const entrance = { x: 65, y: 305 }
    const corner = { x: 65, y: product.y }
    const dest = { x: product.x, y: product.y }
    const pts = [entrance, corner, dest].filter((p, i, a) => i === 0 || dist2(p, a[i - 1]) > 1)
    const segs = []
    let total = 0
    for (let i = 1; i < pts.length; i++) {
      const len = dist2(pts[i - 1], pts[i])
      segs.push({ a: pts[i - 1], b: pts[i], len, start: total })
      total += len
    }
    return { pts, segs, total, dest }
  }, [product])

  const [traveled, setTraveled] = useState(0)
  const [arrived, setArrived] = useState(false)
  const raf = useRef()

  useEffect(() => {
    const duration = Math.min(13000, Math.max(8000, product.dist * 240))
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 1.4)
      setTraveled(route.total * eased)
      if (p < 1) raf.current = requestAnimationFrame(tick)
      else {
        setArrived(true)
        onArrived?.()
      }
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.total])

  // current position + heading along the route
  let segIdx = 0
  while (segIdx < route.segs.length - 1 && traveled > route.segs[segIdx].start + route.segs[segIdx].len) segIdx++
  const seg = route.segs[segIdx]
  const segT = seg.len ? Math.min(1, Math.max(0, (traveled - seg.start) / seg.len)) : 1
  const pos = { x: seg.a.x + (seg.b.x - seg.a.x) * segT, y: seg.a.y + (seg.b.y - seg.a.y) * segT }
  const heading = Math.atan2(seg.b.x - seg.a.x, -(seg.b.y - seg.a.y)) * (180 / Math.PI)

  // distance bookkeeping (convert SVG units -> meters via the product's distance)
  const remUnits = Math.max(0, route.total - traveled)
  const m = (u) => Math.round((u / route.total) * product.dist)
  const remM = m(remUnits)
  const eta = Math.max(1, Math.ceil(remM / 18))

  // upcoming maneuver
  const onFirstLeg = segIdx === 0 && route.segs.length > 1
  const turnDir = route.dest.x >= 65 ? 'right' : 'left'
  const toCornerM = onFirstLeg ? m(seg.start + seg.len - traveled) : 0

  let manDir, manMain, manSub, manDist
  if (arrived) {
    manDir = 'straight'; manMain = 'You have arrived'; manSub = `${product.name} · ${product.aisle}`; manDist = null
  } else if (onFirstLeg) {
    manDir = turnDir; manMain = `Turn ${turnDir}`; manSub = `into ${product.aisle} aisle`; manDist = toCornerM
  } else {
    manDir = 'straight'; manMain = remM > 4 ? 'Continue straight' : 'Arriving'; manSub = `${product.name} ahead`; manDist = remM
  }

  // follow-cam: keep the position centered, zoomed in
  const Z = 2.1
  const follow = `translate(180 180) scale(${Z}) translate(${-pos.x} ${-pos.y})`

  const routeD =
    'M' + route.pts.map((p) => `${p.x} ${p.y}`).join(' L ')
  // portion already walked (drawn in grey behind the live blue route)
  const aisleRects = [
    [40, 60, 90, 26], [40, 110, 90, 26], [150, 60, 70, 26], [240, 60, 90, 26],
    [240, 110, 90, 26], [40, 200, 70, 26], [40, 250, 70, 26], [150, 200, 60, 26],
    [150, 250, 60, 26], [250, 200, 80, 26], [250, 250, 80, 26],
  ]

  return (
    <div className="navmap">
      {/* ===== live map ===== */}
      <div className="navmap__canvas">
        <svg className="navmap__svg" viewBox="0 0 360 360" preserveAspectRatio="xMidYMid slice">
          <g className="navmap__follow" transform={follow}>
            {/* floor */}
            <rect x="-40" y="-40" width="440" height="440" fill="#eaf3fb" />
            <rect x="14" y="14" width="332" height="332" rx="18" fill="#f8fbff" stroke="#e2eaf3" strokeWidth="2" />
            {aisleRects.map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} rx="6" fill="#dde7f3" />
            ))}

            {/* entrance + checkout */}
            <rect x="26" y="310" width="78" height="26" rx="8" fill="#d1fae5" />
            <text x="65" y="327" textAnchor="middle" fontSize="11" fontWeight="700" fill="#047857">Entrance</text>

            {/* route casing + line (Google-style) */}
            <path d={routeD} fill="none" stroke="#fff" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
            <path d={routeD} fill="none" stroke="#3b82f6" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />

            {/* destination marker */}
            <g transform={`translate(${route.dest.x} ${route.dest.y})`}>
              <circle r="16" fill="#fff" stroke="#ef4444" strokeWidth="3" />
              <text y="5.5" textAnchor="middle" fontSize="16">{product.emoji}</text>
              <path d="M0 16 L-6 26 L6 26 Z" fill="#ef4444" />
            </g>
          </g>

          {/* position marker — fixed at screen center, rotates to heading */}
          <g transform="translate(180 180)">
            <circle r="34" fill="#3b82f6" opacity="0.16">
              <animate attributeName="r" values="26;38;26" dur="2.2s" repeatCount="indefinite" />
            </circle>
            {!arrived && (
              <g transform={`rotate(${heading})`}>
                <path d="M0 -30 L15 6 L0 -2 L-15 6 Z" fill="#3b82f6" opacity="0.55" />
              </g>
            )}
            <circle r="12" fill="#3b82f6" stroke="#fff" strokeWidth="4" />
          </g>
        </svg>
      </div>

      {/* ===== maneuver banner ===== */}
      <div className={`navmap__banner ${arrived ? 'is-arrived' : ''}`}>
        <span className="navmap__man">
          {arrived ? <Icon name="check" size={28} strokeWidth={2.6} /> : <Maneuver dir={manDir} size={30} />}
        </span>
        <div style={{ flex: 1 }}>
          {manDist != null && <div className="navmap__man-dist">{manDist} m</div>}
          <div className="navmap__man-main">{manMain}</div>
          <div className="navmap__man-sub">{manSub}</div>
        </div>
      </div>

      <button className="navmap__close" onClick={onClose} aria-label="Exit navigation">
        <Icon name="chevronLeft" size={20} strokeWidth={2.6} />
      </button>
      {!arrived && (
        <div className="navmap__compass">
          <span className="navmap__compass-dot" /> LIVE
        </div>
      )}

      {/* ===== bottom trip card ===== */}
      <div className="navmap__card">
        <div className="navmap__trip">
          <div>
            <div className="navmap__eta">{arrived ? 'Arrived' : `${eta} min`}</div>
            <div className="navmap__eta-sub">
              {arrived ? `on your ${product.side}, in ${product.aisle}` : `${remM} m remaining`}
            </div>
          </div>
          <div className="navmap__trip-prod">
            <span className="navmap__trip-emoji">{product.emoji}</span>
            <span className="navmap__trip-name">{product.name}</span>
          </div>
        </div>
        {arrived ? (
          <button className="navmap__exit navmap__exit--end" onClick={onClose}>
            <Icon name="check" size={18} strokeWidth={2.6} /> Mark as collected
          </button>
        ) : (
          <button className="navmap__exit navmap__exit--quit" onClick={onClose}>
            Exit navigation
          </button>
        )}
      </div>
    </div>
  )
}
