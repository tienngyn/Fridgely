import { useEffect, useRef, useState } from 'react'
import Icon from '../components/Icon'

// Simulated live 3D in-store navigation. No real positioning — the distance
// counts down over time to mimic walking toward the product.
export default function StoreNav({ product, onClose, onArrived }) {
  const start = product.dist
  const [dist, setDist] = useState(start)
  const [arrived, setArrived] = useState(false)
  const raf = useRef()

  useEffect(() => {
    const duration = Math.min(11000, Math.max(7000, start * 200))
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 1.5)
      setDist(Math.max(0, Math.round(start * (1 - eased))))
      if (p < 1) {
        raf.current = requestAnimationFrame(tick)
      } else {
        setArrived(true)
        onArrived?.()
      }
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start])

  const progress = start ? 1 - dist / start : 1 // 0 → 1
  const eta = Math.max(1, Math.ceil(dist / 18)) // rough minutes

  // turn-by-turn instruction depends on how far along we are
  const turn = arrived
    ? `Arrived — on your ${product.side}`
    : progress < 0.5
      ? 'Head straight ahead'
      : progress < 0.82
        ? `Turn ${product.side} at ${product.aisle}`
        : `${product.aisle} aisle — almost there`
  const turning = !arrived && progress >= 0.5 && progress < 0.82
  const arrowRot = turning ? (product.side === 'left' ? -52 : 52) : 0

  // destination marker grows as we approach
  const destScale = 0.45 + progress * 1.7

  return (
    <div className="nav3d">
      {/* ===== 3D scene ===== */}
      <div className="nav3d__scene">
        <div className="nav3d__sky">
          <div className="nav3d__sky-glow" />
        </div>

        {/* side shelves */}
        <div className="nav3d__wall nav3d__wall--l" />
        <div className="nav3d__wall nav3d__wall--r" />

        {/* floor with route */}
        <div className="nav3d__floor">
          <div className="nav3d__floorgrid" />
          <div className="nav3d__route">
            <div className="nav3d__routedash" />
          </div>
        </div>

        {/* destination marker near the horizon */}
        <div
          className={`nav3d__dest ${arrived ? 'is-arrived' : ''}`}
          style={{ transform: `translate(-50%, -50%) scale(${destScale})` }}
        >
          <span className="nav3d__dest-ring" />
          <span className="nav3d__dest-bubble">{product.emoji}</span>
          <span className="nav3d__dest-reticle" />
        </div>
      </div>

      {/* ===== HUD overlay ===== */}
      <div className="nav3d__hud">
        <div className="nav3d__hud-top">
          <button className="nav3d__close" onClick={onClose} aria-label="Close navigation">
            <Icon name="chevronLeft" size={20} strokeWidth={2.6} />
          </button>
          <div className="nav3d__live">
            <span className="nav3d__live-dot" /> LIVE · 3D
          </div>
        </div>

        {/* turn-by-turn banner */}
        <div className={`nav3d__turn ${arrived ? 'is-arrived' : ''}`}>
          <span className="nav3d__turn-arrow" style={{ transform: `rotate(${arrowRot}deg)` }}>
            <Icon name={arrived ? 'check' : 'nav'} size={26} strokeWidth={2.4} />
          </span>
          <div>
            <div className="nav3d__turn-main">{turn}</div>
            <div className="nav3d__turn-sub">{product.aisle} · Section {product.order}</div>
          </div>
        </div>

        <div className="nav3d__spacer" />

        {/* big distance read-out */}
        {!arrived && (
          <div className="nav3d__dist">
            <span className="nav3d__dist-num">{dist}</span>
            <span className="nav3d__dist-unit">m</span>
            <span className="nav3d__dist-to">to {product.name}</span>
          </div>
        )}

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
                  <div className="nav3d__card-title">{product.name}</div>
                  <div className="nav3d__card-sub">{product.aisle} aisle · shelf height: eye level</div>
                </div>
                <div className="nav3d__eta">
                  <div className="nav3d__eta-num">{eta}</div>
                  <div className="nav3d__eta-lbl">min</div>
                </div>
              </div>
              <div className="nav3d__progress">
                <div className="nav3d__progress-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
