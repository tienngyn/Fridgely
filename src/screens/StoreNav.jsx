import { useEffect, useRef, useState } from 'react'
import Icon from '../components/Icon'

// Maneuver glyph (clear turn icons like a real nav app)
function Maneuver({ dir, size = 28 }) {
  const common = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round',
  }
  if (dir === 'right')
    return (
      <svg {...common}><path d="M8 21v-8a3 3 0 0 1 3-3h6" /><path d="M14 6l4 4-4 4" /></svg>
    )
  if (dir === 'left')
    return (
      <svg {...common}><path d="M16 21v-8a3 3 0 0 0-3-3H7" /><path d="M10 6l-4 4 4 4" /></svg>
    )
  return <svg {...common}><path d="M12 21V5" /><path d="M6 11l6-6 6 6" /></svg>
}

// Big arrow painted on the floor; bends toward the turn direction.
function FloorArrow({ dir }) {
  const paths = {
    straight: { d: 'M50 196 L50 34', head: '46,40 50,22 54,40' },
    right: { d: 'M50 196 L50 96 Q50 52 90 52', head: '84,46 98,52 84,58' },
    left: { d: 'M50 196 L50 96 Q50 52 10 52', head: '16,46 2,52 16,58' },
  }
  const p = paths[dir] || paths.straight
  return (
    <svg className="nav3d__arrow" viewBox="0 0 100 200" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="floorArrow" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#34d399" stopOpacity="0.25" />
          <stop offset="0.5" stopColor="#34d399" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      {/* soft base */}
      <path className="nav3d__arrow-base" d={p.d} />
      {/* bright moving dashes */}
      <path className="nav3d__arrow-flow" d={p.d} stroke="url(#floorArrow)" />
      <polygon className="nav3d__arrow-head" points={p.head} fill="url(#floorArrow)" />
    </svg>
  )
}

// Top-down mini-map with an L-route and a live position dot.
function MiniMap({ side, covered, d1, total }) {
  const endX = side === 'right' ? 86 : 14
  const route = `M50 86 L50 46 L${endX} 46`
  let x = 50, y = 86
  if (covered < d1) {
    y = 86 - 40 * (covered / d1)
  } else {
    y = 46
    const f = Math.min(1, (covered - d1) / (total - d1))
    x = 50 + (endX - 50) * f
  }
  return (
    <div className="nav3d__mini">
      <svg viewBox="0 0 100 100">
        <path d={route} fill="none" stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d={route} fill="none" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 6" />
        <circle cx={50} cy={86} r="5" fill="#3b82f6" />
        <circle cx={endX} cy={46} r="6" fill="#fff" stroke="#ef4444" strokeWidth="3" />
        <circle cx={x} cy={y} r="6.5" fill="#34d399" stroke="#fff" strokeWidth="2.5" />
      </svg>
      <span className="nav3d__mini-lbl">You</span>
    </div>
  )
}

export default function StoreNav({ product, onClose, onArrived }) {
  // itinerary: walk d1 to the turn, turn toward product.side, walk d2 to shelf
  const d1 = Math.round(product.dist * 0.6)
  const total = product.dist
  const d2 = total - d1

  const [covered, setCovered] = useState(0)
  const [arrived, setArrived] = useState(false)
  const raf = useRef()

  useEffect(() => {
    const duration = Math.min(12000, Math.max(8000, total * 230))
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 1.5)
      setCovered(total * eased)
      if (p < 1) raf.current = requestAnimationFrame(tick)
      else {
        setArrived(true)
        onArrived?.()
      }
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total])

  const remaining = Math.max(0, Math.round(total - covered))
  const beforeTurn = covered < d1
  const toTurn = Math.max(0, Math.round(d1 - covered))

  // current maneuver
  let dir, main, sub
  if (arrived) {
    dir = product.side
    main = 'You have arrived'
    sub = `${product.name} is on your ${product.side}`
  } else if (beforeTurn) {
    dir = product.side
    main = `Turn ${product.side}`
    sub = `in ${toTurn} m · into ${product.aisle}`
  } else {
    dir = 'straight'
    main = remaining > 4 ? 'Continue straight' : 'Almost there'
    sub = `${product.name} on your ${product.side}`
  }

  // floor arrow direction (preview the bend while approaching the turn)
  const arrowDir = arrived ? 'straight' : beforeTurn ? product.side : 'straight'
  const eta = Math.max(1, Math.ceil(remaining / 18))

  return (
    <div className="nav3d">
      {/* ===== 3D scene ===== */}
      <div className={`nav3d__scene ${!beforeTurn && !arrived ? 'is-turned' : ''}`}>
        <div className="nav3d__sky">
          <div className="nav3d__sky-glow" />
        </div>

        <div className="nav3d__wall nav3d__wall--l" />
        <div className="nav3d__wall nav3d__wall--r" />

        <div className="nav3d__floor">
          <div className="nav3d__floorgrid" />
          <FloorArrow dir={arrowDir} />
        </div>

        {/* destination appears once it's ahead of you (after the turn) */}
        {!beforeTurn && (
          <div className={`nav3d__dest ${arrived ? 'is-arrived' : ''}`}>
            <span className="nav3d__dest-ring" />
            <span className="nav3d__dest-bubble">{product.emoji}</span>
            <span className="nav3d__dest-reticle" />
          </div>
        )}
      </div>

      {/* ===== HUD ===== */}
      <div className="nav3d__hud">
        <div className="nav3d__hud-top">
          <button className="nav3d__close" onClick={onClose} aria-label="Close navigation">
            <Icon name="chevronLeft" size={20} strokeWidth={2.6} />
          </button>
          <div className="nav3d__live">
            <span className="nav3d__live-dot" /> LIVE · 3D
          </div>
        </div>

        {/* maneuver banner */}
        <div className={`nav3d__turn ${arrived ? 'is-arrived' : ''}`}>
          <span className="nav3d__turn-arrow">
            {arrived ? <Icon name="check" size={28} strokeWidth={2.6} /> : <Maneuver dir={dir} size={30} />}
          </span>
          <div style={{ flex: 1 }}>
            <div className="nav3d__turn-main">{main}</div>
            <div className="nav3d__turn-sub">{sub}</div>
          </div>
          {!arrived && (
            <div className="nav3d__turn-dist">
              <span>{beforeTurn ? toTurn : remaining}</span>m
            </div>
          )}
        </div>

        {!arrived && <MiniMap side={product.side} covered={covered} d1={d1} total={total} />}

        <div className="nav3d__spacer" />

        {/* bottom card */}
        <div className="nav3d__card">
          {arrived ? (
            <>
              <div className="nav3d__card-row">
                <span className="nav3d__card-emoji is-ok">🎉</span>
                <div style={{ flex: 1 }}>
                  <div className="nav3d__card-title">You've arrived!</div>
                  <div className="nav3d__card-sub">
                    {product.name} is on your {product.side}, in {product.aisle}.
                  </div>
                </div>
              </div>
              <button className="nav3d__btn" onClick={onClose}>
                <Icon name="check" size={18} strokeWidth={2.6} /> Mark as collected
              </button>
            </>
          ) : (
            <>
              <div className="nav3d__card-row">
                <span className="nav3d__card-emoji">{product.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div className="nav3d__card-title">{remaining} m to {product.name}</div>
                  <div className="nav3d__card-sub">{product.aisle} aisle · shelf at eye level</div>
                </div>
                <div className="nav3d__eta">
                  <div className="nav3d__eta-num">{eta}</div>
                  <div className="nav3d__eta-lbl">min</div>
                </div>
              </div>
              <div className="nav3d__progress">
                <div
                  className="nav3d__progress-fill"
                  style={{ width: `${Math.round((covered / total) * 100)}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
