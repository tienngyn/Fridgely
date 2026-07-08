import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from '../components/Icon'
import { AISLE_Y, ENTRANCE } from './StoreMap'

const Z = 1.7 // follow-cam zoom (a touch more overview)
const BARS = [40, 104, 168, 232, 296]
const ROWS_Y = [96, 146, 196, 246]
const AISLE_NAMES = ['Dairy', 'Produce', 'Bakery', 'Pantry', 'Drinks']

function Maneuver({ dir, size = 30 }) {
  const c = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (dir === 'right') return <svg {...c}><path d="M8 21v-8a3 3 0 0 1 3-3h6" /><path d="M14 6l4 4-4 4" /></svg>
  if (dir === 'left') return <svg {...c}><path d="M16 21v-8a3 3 0 0 0-3-3H7" /><path d="M10 6l-4 4 4 4" /></svg>
  return <svg {...c}><path d="M12 21V5" /><path d="M6 11l6-6 6 6" /></svg>
}

const dist2 = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const segHeading = (s) => Math.atan2(s.b.x - s.a.x, -(s.b.y - s.a.y)) * (180 / Math.PI)
const shortAngle = (a, b) => (((b - a + 540) % 360) - 180)

function buildRoute(start, dest) {
  const raw = [start, { x: start.x, y: AISLE_Y }, { x: dest.x, y: AISLE_Y }, { x: dest.x, y: dest.y }]
  const pts = raw.filter((p, i, a) => i === 0 || dist2(p, a[i - 1]) > 0.5)
  const segs = []
  let total = 0
  for (let i = 1; i < pts.length; i++) {
    const len = dist2(pts[i - 1], pts[i])
    segs.push({ a: pts[i - 1], b: pts[i], len, start: total })
    total += len
  }
  return { pts, segs, total: total || 1, dest }
}
// turn direction at the vertex ending segment i
function turnAt(route, i) {
  if (i >= route.segs.length - 1) return 'straight'
  const d = shortAngle(segHeading(route.segs[i]), segHeading(route.segs[i + 1]))
  if (Math.abs(d) < 12) return 'straight'
  return d > 0 ? 'right' : 'left'
}
function locate(route, t) {
  let i = 0
  while (i < route.segs.length - 1 && t > route.segs[i].start + route.segs[i].len) i++
  const s = route.segs[i]
  const k = s.len ? Math.min(1, Math.max(0, (t - s.start) / s.len)) : 1
  return { pos: { x: s.a.x + (s.b.x - s.a.x) * k, y: s.a.y + (s.b.y - s.a.y) * k }, heading: segHeading(s), segIdx: i, seg: s }
}

export default function StoreNav({ stops, onClose, onFinish, toast }) {
  const isTour = stops.length > 1
  const [index, setIndex] = useState(0)
  const product = stops[index]
  const start = index === 0 ? ENTRANCE : { x: stops[index - 1].x, y: stops[index - 1].y }
  const route = useMemo(() => buildRoute(start, product), [index]) // eslint-disable-line react-hooks/exhaustive-deps

  const [traveled, setTraveled] = useState(0)
  const [arrived, setArrived] = useState(false)
  const [headingDeg, setHeadingDeg] = useState(0)
  const headRef = useRef(0)
  const raf = useRef()

  useEffect(() => {
    setTraveled(0)
    setArrived(false)
    const init = locate(route, 0).heading
    headRef.current = init
    setHeadingDeg(init)
    const duration = Math.min(13000, Math.max(7500, product.dist * 230))
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 1.4)
      const tv = route.total * eased
      setTraveled(tv)
      headRef.current += shortAngle(headRef.current, locate(route, tv).heading) * 0.18
      setHeadingDeg(headRef.current)
      if (p < 1) raf.current = requestAnimationFrame(tick)
      else { setArrived(true); toast?.(`Arrived at ${product.name}`) }
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [index]) // eslint-disable-line react-hooks/exhaustive-deps

  const loc = locate(route, traveled)
  const pos = loc.pos
  const m = (u) => Math.round((u / route.total) * product.dist)
  const remM = Math.max(0, m(route.total - traveled))
  const eta = Math.max(1, Math.ceil(remM / 18))
  const lastSeg = loc.segIdx === route.segs.length - 1

  let manDir, manMain, manSub, manDist
  const where = `${product.aisle} · Row ${product.row}`
  if (arrived) {
    manDir = 'straight'; manMain = 'You have arrived'; manSub = where; manDist = null
  } else if (!lastSeg) {
    const dir = turnAt(route, loc.segIdx)
    manDir = dir
    manMain = dir === 'straight' ? 'Continue straight' : `Turn ${dir}`
    manSub = `to ${product.name} · ${where}`
    manDist = m(loc.seg.start + loc.seg.len - traveled)
  } else {
    manDir = 'straight'; manMain = remM > 4 ? 'Continue straight' : 'Arriving'; manSub = where; manDist = remM
  }

  const hasNext = index < stops.length - 1
  // "I found it" → skip the live walk and move on
  const found = () => {
    if (hasNext) setIndex(index + 1)
    else if (isTour) onFinish?.(stops)
    else onClose()
  }
  const follow = `translate(180 180) scale(${Z}) rotate(${-headingDeg}) translate(${-pos.x} ${-pos.y})`
  const routeD = 'M' + route.pts.map((p) => `${p.x} ${p.y}`).join(' L ')
  const upright = (x, y) => `rotate(${headingDeg} ${x} ${y})`

  return (
    <div className="navmap">
      <div className="navmap__canvas">
        <svg className="navmap__svg" viewBox="0 0 360 360" preserveAspectRatio="xMidYMid slice">
          <g transform={follow}>
            <rect x="-200" y="-200" width="760" height="760" fill="#eaf3fb" />
            <rect x="14" y="14" width="332" height="332" rx="18" fill="#f8fbff" stroke="#e2eaf3" strokeWidth="2" />

            {/* shelves + aisle labels */}
            {BARS.map((bx, bi) => (
              <g key={bi}>
                <rect x={bx} y="56" width="44" height="210" rx="7" fill="#dde7f3" />
                {ROWS_Y.map((ry, ri) => (
                  <line key={ri} x1={bx + 4} y1={ry + 25} x2={bx + 40} y2={ry + 25} stroke="#cbd9e8" strokeWidth="1.4" />
                ))}
                <text x={bx + 22} y="50" transform={upright(bx + 22, 47)} textAnchor="middle" fontSize="9" fontWeight="800" fill="#9aa8bd">{AISLE_NAMES[bi]}</text>
              </g>
            ))}

            <rect x="22" y="316" width="74" height="26" rx="8" fill="#d1fae5" />
            <text x="59" y="333" transform={upright(59, 329)} textAnchor="middle" fontSize="11" fontWeight="700" fill="#047857">Entrance</text>

            {/* upcoming stops */}
            {isTour && stops.map((s, i) => i > index ? (
              <g key={s.id} transform={`translate(${s.x} ${s.y})`}>
                <circle r="9" fill="#fff" stroke="#94a3b8" strokeWidth="2.5" />
                <text y="3.5" transform={upright(0, 0)} textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="800">{i + 1}</text>
              </g>
            ) : null)}

            {/* route */}
            <path d={routeD} fill="none" stroke="#fff" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
            <path d={routeD} fill="none" stroke="#3b82f6" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />

            {/* destination */}
            <g transform={`translate(${route.dest.x} ${route.dest.y})`}>
              <circle r="15" fill="#fff" stroke="#ef4444" strokeWidth="3" />
              <text y="5" transform={upright(0, 0)} textAnchor="middle" fontSize="15">{product.emoji}</text>
              <path d="M0 15 L-5 24 L5 24 Z" fill="#ef4444" transform={upright(0, 20)} />
            </g>
          </g>

          {/* position marker (centered, points up) */}
          <g transform="translate(180 180)">
            <circle r="34" fill="#3b82f6" opacity="0.16"><animate attributeName="r" values="26;38;26" dur="2.2s" repeatCount="indefinite" /></circle>
            {!arrived && <path d="M0 -30 L15 6 L0 -2 L-15 6 Z" fill="#3b82f6" opacity="0.55" />}
            <circle r="12" fill="#3b82f6" stroke="#fff" strokeWidth="4" />
          </g>
        </svg>
      </div>

      {/* maneuver banner */}
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
      <div className="navmap__compass">
        {isTour ? <>Stop {index + 1}/{stops.length}</> : <><span className="navmap__compass-dot" /> LIVE</>}
      </div>

      {/* bottom trip card */}
      <div className="navmap__card">
        <div className="navmap__trip">
          <div>
            <div className="navmap__eta">{arrived ? 'Arrived' : `${eta} min`}</div>
            <div className="navmap__eta-sub">{arrived ? where : `${remM} m · ${where}`}</div>
          </div>
          <div className="navmap__trip-prod">
            <span className="navmap__trip-emoji">{product.emoji}</span>
            <span className="navmap__trip-name">{product.name}</span>
          </div>
        </div>

        {isTour && (
          <div className="navmap__stops">
            {stops.map((s, i) => (
              <span key={s.id} className={`navmap__stop ${i < index || (i === index && arrived) ? 'is-done' : ''} ${i === index ? 'is-current' : ''}`}>
                {i < index || (i === index && arrived) ? <Icon name="check" size={11} strokeWidth={3} /> : i + 1}
              </span>
            ))}
          </div>
        )}

        {arrived ? (
          hasNext ? (
            <button className="navmap__exit navmap__exit--end" onClick={() => setIndex(index + 1)}>
              <Icon name="check" size={18} strokeWidth={2.6} /> Collected · Next: {stops[index + 1].name}
              <Icon name="chevron" size={18} strokeWidth={2.6} />
            </button>
          ) : (
            <button className="navmap__exit navmap__exit--end" onClick={() => (isTour ? onFinish?.(stops) : onClose())}>
              <Icon name="check" size={18} strokeWidth={2.6} /> {isTour ? 'Finish & checkout' : 'Mark as collected'}
            </button>
          )
        ) : (
          <>
            <button className="navmap__exit navmap__exit--end" onClick={found}>
              <Icon name="check" size={18} strokeWidth={2.6} /> I found it{hasNext ? ` · Next: ${stops[index + 1].name}` : ''}
            </button>
            <button className="navmap__exit navmap__exit--slim" onClick={onClose}>Exit navigation</button>
          </>
        )}
      </div>
    </div>
  )
}
