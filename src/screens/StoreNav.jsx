import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from '../components/Icon'

const ENTRANCE = { x: 65, y: 305 }
const Z = 2.15 // follow-cam zoom

// aisle labels shown on the live map
const AISLES = [
  { name: 'PRODUCE', x: 185, y: 100 },
  { name: 'SNACKS', x: 285, y: 78 },
  { name: 'PANTRY', x: 290, y: 150 },
  { name: 'DRINKS', x: 290, y: 188 },
  { name: 'DAIRY', x: 75, y: 188 },
  { name: 'MEAT', x: 150, y: 285 },
  { name: 'BAKERY', x: 285, y: 285 },
]

function Maneuver({ dir, size = 30 }) {
  const c = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round',
  }
  if (dir === 'right') return <svg {...c}><path d="M8 21v-8a3 3 0 0 1 3-3h6" /><path d="M14 6l4 4-4 4" /></svg>
  if (dir === 'left') return <svg {...c}><path d="M16 21v-8a3 3 0 0 0-3-3H7" /><path d="M10 6l-4 4 4 4" /></svg>
  return <svg {...c}><path d="M12 21V5" /><path d="M6 11l6-6 6 6" /></svg>
}

const dist2 = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const segHeading = (s) => Math.atan2(s.b.x - s.a.x, -(s.b.y - s.a.y)) * (180 / Math.PI)
const shortAngle = (a, b) => (((b - a + 540) % 360) - 180)

function buildRoute(start, dest) {
  const corner = { x: start.x, y: dest.y }
  const raw = [start, corner, { x: dest.x, y: dest.y }]
  const pts = raw.filter((p, i, a) => i === 0 || dist2(p, a[i - 1]) > 0.5)
  const segs = []
  let total = 0
  for (let i = 1; i < pts.length; i++) {
    const len = dist2(pts[i - 1], pts[i])
    segs.push({ a: pts[i - 1], b: pts[i], len, start: total })
    total += len
  }
  let turnDir = 'straight'
  if (segs.length > 1) turnDir = shortAngle(segHeading(segs[0]), segHeading(segs[1])) > 0 ? 'right' : 'left'
  return { pts, segs, total: total || 1, dest, turnDir }
}

function locate(route, t) {
  let i = 0
  while (i < route.segs.length - 1 && t > route.segs[i].start + route.segs[i].len) i++
  const s = route.segs[i]
  const k = s.len ? Math.min(1, Math.max(0, (t - s.start) / s.len)) : 1
  return {
    pos: { x: s.a.x + (s.b.x - s.a.x) * k, y: s.a.y + (s.b.y - s.a.y) * k },
    heading: segHeading(s),
    segIdx: i,
    seg: s,
  }
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

    const duration = Math.min(13000, Math.max(7000, product.dist * 230))
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 1.4)
      const tv = route.total * eased
      setTraveled(tv)
      const tgt = locate(route, tv).heading
      headRef.current += shortAngle(headRef.current, tgt) * 0.18
      setHeadingDeg(headRef.current)
      if (p < 1) raf.current = requestAnimationFrame(tick)
      else {
        setArrived(true)
        toast?.(`Arrived at ${product.name}`)
      }
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [index]) // eslint-disable-line react-hooks/exhaustive-deps

  const loc = locate(route, traveled)
  const pos = loc.pos
  const remUnits = Math.max(0, route.total - traveled)
  const m = (u) => Math.round((u / route.total) * product.dist)
  const remM = m(remUnits)
  const eta = Math.max(1, Math.ceil(remM / 18))

  const onFirstLeg = loc.segIdx === 0 && route.segs.length > 1
  const toCornerM = onFirstLeg ? m(route.segs[0].start + route.segs[0].len - traveled) : 0

  let manDir, manMain, manSub, manDist
  if (arrived) {
    manDir = 'straight'; manMain = 'You have arrived'; manSub = `${product.name} · ${product.aisle}`; manDist = null
  } else if (onFirstLeg) {
    manDir = route.turnDir; manMain = `Turn ${route.turnDir}`; manSub = `into ${product.aisle} aisle`; manDist = toCornerM
  } else {
    manDir = 'straight'; manMain = remM > 4 ? 'Continue straight' : 'Arriving'; manSub = `${product.name} ahead`; manDist = remM
  }

  const hasNext = index < stops.length - 1
  const follow = `translate(180 180) scale(${Z}) rotate(${-headingDeg}) translate(${-pos.x} ${-pos.y})`
  const routeD = 'M' + route.pts.map((p) => `${p.x} ${p.y}`).join(' L ')
  // keep map text upright while the map rotates
  const upright = (x, y) => `rotate(${headingDeg} ${x} ${y})`

  const aisleRects = [
    [40, 60, 90, 26], [40, 110, 90, 26], [150, 60, 70, 26], [240, 60, 90, 26],
    [240, 110, 90, 26], [40, 200, 70, 26], [40, 250, 70, 26], [150, 200, 60, 26],
    [150, 250, 60, 26], [250, 200, 80, 26], [250, 250, 80, 26],
  ]

  return (
    <div className="navmap">
      {/* ===== live, heading-up map ===== */}
      <div className="navmap__canvas">
        <svg className="navmap__svg" viewBox="0 0 360 360" preserveAspectRatio="xMidYMid slice">
          <g transform={follow}>
            <rect x="-200" y="-200" width="760" height="760" fill="#eaf3fb" />
            <rect x="14" y="14" width="332" height="332" rx="18" fill="#f8fbff" stroke="#e2eaf3" strokeWidth="2" />
            {aisleRects.map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} rx="6" fill="#dde7f3" />
            ))}

            {/* aisle labels (kept upright) */}
            {AISLES.map((a) => (
              <text key={a.name} x={a.x} y={a.y} transform={upright(a.x, a.y)}
                textAnchor="middle" fontSize="8.5" fontWeight="800" letterSpacing="0.6" fill="#9aa8bd">
                {a.name}
              </text>
            ))}

            <rect x="26" y="310" width="78" height="26" rx="8" fill="#d1fae5" />
            <text x="65" y="327" transform={upright(65, 322)} textAnchor="middle" fontSize="11" fontWeight="700" fill="#047857">Entrance</text>

            {/* route */}
            <path d={routeD} fill="none" stroke="#fff" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
            <path d={routeD} fill="none" stroke="#3b82f6" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />

            {/* upcoming stops on the tour */}
            {isTour && stops.map((s, i) =>
              i > index ? (
                <g key={s.id} transform={`translate(${s.x} ${s.y})`}>
                  <circle r="9" fill="#fff" stroke="#94a3b8" strokeWidth="2.5" />
                  <text y="3.5" transform={upright(0, 0)} textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="800">{i + 1}</text>
                </g>
              ) : null
            )}

            {/* destination marker */}
            <g transform={`translate(${route.dest.x} ${route.dest.y})`}>
              <circle r="16" fill="#fff" stroke="#ef4444" strokeWidth="3" />
              <text y="5.5" transform={upright(0, 0)} textAnchor="middle" fontSize="16">{product.emoji}</text>
              <path d="M0 16 L-6 26 L6 26 Z" fill="#ef4444" transform={upright(0, 21)} />
            </g>
          </g>

          {/* position marker — fixed center, points up (map rotates instead) */}
          <g transform="translate(180 180)">
            <circle r="34" fill="#3b82f6" opacity="0.16">
              <animate attributeName="r" values="26;38;26" dur="2.2s" repeatCount="indefinite" />
            </circle>
            {!arrived && <path d="M0 -30 L15 6 L0 -2 L-15 6 Z" fill="#3b82f6" opacity="0.55" />}
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
      <div className="navmap__compass">
        {isTour ? (
          <>Stop {index + 1}/{stops.length}</>
        ) : (
          <><span className="navmap__compass-dot" /> LIVE</>
        )}
      </div>

      {/* ===== bottom trip card ===== */}
      <div className="navmap__card">
        <div className="navmap__trip">
          <div>
            <div className="navmap__eta">{arrived ? 'Arrived' : `${eta} min`}</div>
            <div className="navmap__eta-sub">
              {arrived ? `on your ${product.side}, in ${product.aisle}` : `${remM} m · ${product.aisle} aisle`}
            </div>
          </div>
          <div className="navmap__trip-prod">
            <span className="navmap__trip-emoji">{product.emoji}</span>
            <span className="navmap__trip-name">{product.name}</span>
          </div>
        </div>

        {/* tour progress dots */}
        {isTour && (
          <div className="navmap__stops">
            {stops.map((s, i) => (
              <span
                key={s.id}
                className={`navmap__stop ${i < index || (i === index && arrived) ? 'is-done' : ''} ${i === index ? 'is-current' : ''}`}
                title={s.name}
              >
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
            <button
              className="navmap__exit navmap__exit--end"
              onClick={() => (isTour ? onFinish?.(stops) : onClose())}
            >
              <Icon name="check" size={18} strokeWidth={2.6} /> {isTour ? 'Finish & checkout' : 'Mark as collected'}
            </button>
          )
        ) : (
          <button className="navmap__exit navmap__exit--quit" onClick={onClose}>
            Exit navigation
          </button>
        )}
      </div>
    </div>
  )
}
