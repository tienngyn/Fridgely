import { useMemo, useState } from 'react'
import Card from '../components/Card'
import PrimaryButton from '../components/PrimaryButton'
import StatusChip from '../components/StatusChip'
import Icon from '../components/Icon'

// Items currently on the shopping list — always pinned, form the optimized route.
const LIST_ITEMS = [
  { id: 'milk', x: 60, y: 250, emoji: '🥛', name: 'Milk', aisle: 'Dairy', dist: 42, side: 'left', order: 1, onList: true },
  { id: 'tomatoes', x: 150, y: 150, emoji: '🍅', name: 'Tomatoes', aisle: 'Produce', dist: 26, side: 'right', order: 2, onList: true },
  { id: 'bread', x: 250, y: 235, emoji: '🍞', name: 'Bread', aisle: 'Bakery', dist: 33, side: 'left', order: 3, onList: true },
  { id: 'pasta', x: 300, y: 130, emoji: '🍝', name: 'Pasta', aisle: 'Pantry', dist: 48, side: 'right', order: 4, onList: true },
]

// The wider store catalog you can search through.
const CATALOG = [
  ...LIST_ITEMS,
  { id: 'apples', x: 155, y: 110, emoji: '🍎', name: 'Apples', aisle: 'Produce', dist: 24, side: 'left' },
  { id: 'bananas', x: 180, y: 150, emoji: '🍌', name: 'Bananas', aisle: 'Produce', dist: 28, side: 'right' },
  { id: 'cheese', x: 60, y: 210, emoji: '🧀', name: 'Cheese', aisle: 'Dairy', dist: 40, side: 'right' },
  { id: 'yogurt', x: 95, y: 250, emoji: '🥣', name: 'Yogurt', aisle: 'Dairy', dist: 38, side: 'left' },
  { id: 'eggs', x: 95, y: 210, emoji: '🥚', name: 'Eggs', aisle: 'Dairy', dist: 36, side: 'right' },
  { id: 'butter', x: 60, y: 160, emoji: '🧈', name: 'Butter', aisle: 'Dairy', dist: 44, side: 'left' },
  { id: 'rice', x: 300, y: 90, emoji: '🍚', name: 'Rice', aisle: 'Pantry', dist: 52, side: 'right' },
  { id: 'coffee', x: 280, y: 130, emoji: '☕', name: 'Coffee', aisle: 'Pantry', dist: 50, side: 'left' },
  { id: 'chocolate', x: 250, y: 90, emoji: '🍫', name: 'Chocolate', aisle: 'Snacks', dist: 55, side: 'left' },
  { id: 'water', x: 250, y: 170, emoji: '💧', name: 'Water', aisle: 'Drinks', dist: 34, side: 'right' },
  { id: 'chicken', x: 130, y: 250, emoji: '🍗', name: 'Chicken', aisle: 'Meat', dist: 30, side: 'left' },
  { id: 'fish', x: 165, y: 250, emoji: '🐟', name: 'Fish', aisle: 'Meat', dist: 32, side: 'right' },
]

export default function StoreMap({ go, toast, openNav }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [focused, setFocused] = useState(false)

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return CATALOG.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 6)
  }, [query])

  const pick = (p) => {
    setSelected(p)
    setQuery(p.name)
    setFocused(false)
  }
  const reset = () => {
    setSelected(null)
    setQuery('')
  }

  const showResults = focused && query.trim() && !selected
  // pins drawn on the map: list items, plus the selected product if it's an extra
  const pins = selected && !selected.onList ? [...LIST_ITEMS, selected] : LIST_ITEMS

  // L-shaped route from the entrance to the selected product
  const selRoute = selected ? `M65 305 L65 ${selected.y} L${selected.x} ${selected.y}` : null

  return (
    <div className="rise">
      <div className="screen-head">
        <button className="screen-head__back" onClick={() => go('list')}>
          <Icon name="chevronLeft" size={20} strokeWidth={2.4} />
        </button>
        <div>
          <h1 className="screen-title">Store Route</h1>
          <div className="screen-sub">Fridgely Market · Center</div>
        </div>
      </div>

      {/* ===== product search ===== */}
      <div className="search">
        <div className="search__box">
          <Icon name="list" size={18} className="muted" />
          <input
            className="search__input"
            placeholder="Search a product…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelected(null)
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
          />
          {query && (
            <button className="search__clear" onClick={reset} aria-label="Clear search">
              <Icon name="plus" size={18} style={{ transform: 'rotate(45deg)' }} />
            </button>
          )}
        </div>

        {showResults && (
          <div className="search__results">
            {matches.length === 0 ? (
              <div className="search__empty">No product found for “{query}”.</div>
            ) : (
              matches.map((p) => (
                <div
                  key={p.id}
                  className="search__result"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(p)}
                >
                  <span className="search__result-emoji">{p.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div className="search__result-name">{p.name}</div>
                    <div className="search__result-aisle">{p.aisle} aisle · {p.dist} m away</div>
                  </div>
                  {p.onList ? (
                    <StatusChip status="info" dot={false}>On list</StatusChip>
                  ) : (
                    <Icon name="chevron" size={16} className="muted" />
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {!selected && (
        <div className="map-hint">
          <Icon name="pin" size={15} /> Search or tap a product to see its route
        </div>
      )}

      <div className="map-wrap" style={{ marginTop: 10 }}>
        <svg className="map-svg" viewBox="0 0 360 360" role="img" aria-label="Store map">
          <defs>
            <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#34d399" />
              <stop offset="1" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="360" height="360" fill="#eef4fb" />
          <rect x="14" y="14" width="332" height="332" rx="18" fill="#f8fbff" stroke="#dbe6f3" strokeWidth="2" />

          {[
            [40, 60, 90, 26], [40, 110, 90, 26], [150, 60, 70, 26],
            [240, 60, 90, 26], [240, 110, 90, 26], [40, 200, 70, 26],
            [40, 250, 70, 26], [150, 200, 60, 26], [150, 250, 60, 26],
            [250, 200, 80, 26], [250, 250, 80, 26],
          ].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="6" fill="#dce7f4" />
          ))}

          {/* aisle labels */}
          {[
            ['PRODUCE', 185, 100], ['SNACKS', 285, 78], ['PANTRY', 290, 150],
            ['DRINKS', 290, 188], ['DAIRY', 75, 188], ['MEAT', 150, 285], ['BAKERY', 285, 285],
          ].map(([name, x, y]) => (
            <text key={name} x={x} y={y} textAnchor="middle" fontSize="8.5" fontWeight="800"
              letterSpacing="0.6" fill="#9aa8bd">{name}</text>
          ))}

          <rect x="26" y="310" width="78" height="26" rx="8" fill="#d1fae5" />
          <text x="65" y="327" textAnchor="middle" fontSize="12" fontWeight="700" fill="#047857">Entrance</text>
          <rect x="256" y="310" width="78" height="26" rx="8" fill="#dbeafe" />
          <text x="295" y="327" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8">Checkout</text>

          {/* route: single product route when selected, otherwise the optimized list route */}
          {selected ? (
            <path
              d={selRoute} fill="none" stroke="url(#routeGrad)" strokeWidth="5"
              strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10 9"
            >
              <animate attributeName="stroke-dashoffset" from="190" to="0" dur="2.4s" repeatCount="indefinite" />
            </path>
          ) : (
            <path
              d="M65 305 L60 250 L150 150 L250 235 L300 130 L295 305"
              fill="none" stroke="url(#routeGrad)" strokeWidth="5"
              strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10 9"
            >
              <animate attributeName="stroke-dashoffset" from="190" to="0" dur="2.4s" repeatCount="indefinite" />
            </path>
          )}

          {pins.map((p) => {
            const isSel = selected && p.id === selected.id
            const dim = selected && !isSel
            return (
              <g
                key={p.id}
                className={`map-pin ${isSel ? 'is-selected' : ''} ${dim ? 'is-dim' : ''}`}
                onClick={() => openNav({ stops: [p] })}
                style={{ cursor: 'pointer' }}
              >
                <circle cx={p.x} cy={p.y} r="19" fill={isSel ? '#3b82f6' : '#34d399'} opacity="0.18">
                  <animate attributeName="r" values="17;23;17" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx={p.x} cy={p.y} r={isSel ? 17 : 15} fill="#fff" stroke={isSel ? '#3b82f6' : '#34d399'} strokeWidth={isSel ? 3 : 2.5} />
                <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="15">{p.emoji}</text>
                <g transform={`translate(${p.x}, ${p.y - 25})`}>
                  <rect x="-24" y="-11" width="48" height="18" rx="9" fill={isSel ? '#3b82f6' : '#1f2937'} />
                  <text x="0" y="2" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">{p.name}</text>
                </g>
              </g>
            )
          })}

          <circle cx="65" cy="305" r="7" fill="#34d399" stroke="#fff" strokeWidth="2.5" />
          {!selected && <circle cx="295" cy="305" r="7" fill="#3b82f6" stroke="#fff" strokeWidth="2.5" />}
        </svg>
      </div>

      {/* ===== selected product → route summary + start nav ===== */}
      {selected ? (
        <Card style={{ marginTop: 16 }}>
          <div className="route-stat-card">
            <span className="found-emoji">{selected.emoji}</span>
            <div className="route-stat" style={{ flex: 1 }}>
              <div className="route-stat__big">{selected.name}</div>
              <div className="route-stat__lbl">{selected.aisle} aisle · {selected.dist} m · ≈ {Math.max(1, Math.ceil(selected.dist / 18))} min</div>
            </div>
            <button className="found-clear" onClick={reset} aria-label="Clear">
              <Icon name="plus" size={16} style={{ transform: 'rotate(45deg)' }} />
            </button>
          </div>
          <div style={{ marginTop: 14 }}>
            <PrimaryButton icon="nav" onClick={() => openNav({ stops: [selected] })}>
              Start Navigation
            </PrimaryButton>
          </div>
        </Card>
      ) : (
        <>
          <div className="map-legend">
            <div className="map-legend__item">
              <span className="legend-swatch" style={{ background: '#dce7f4' }} /> Aisles
            </div>
            <div className="map-legend__item">
              <span className="legend-swatch" style={{ background: '#fff', border: '2px solid #34d399' }} /> Your items
            </div>
            <div className="map-legend__item">
              <span className="legend-line" /> Optimized route
            </div>
          </div>

          <Card style={{ marginTop: 18 }}>
            <div className="route-stat-card">
              <div className="route-stat">
                <div className="route-stat__big">18 min</div>
                <div className="route-stat__lbl">Fastest route</div>
              </div>
              <div className="route-stat__div" />
              <div className="route-stat">
                <div className="route-stat__big">3 offers</div>
                <div className="route-stat__lbl">Nearby on your route</div>
              </div>
              <StatusChip status="info" dot={false}>
                <Icon name="tag" size={13} /> Save €4.20
              </StatusChip>
            </div>
          </Card>

          <div style={{ marginTop: 16 }}>
            <PrimaryButton icon="route" onClick={() => openNav({ stops: LIST_ITEMS })}>
              Start Tour · {LIST_ITEMS.length} stops
            </PrimaryButton>
          </div>
        </>
      )}
    </div>
  )
}
