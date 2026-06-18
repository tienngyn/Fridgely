import Card from '../components/Card'
import PrimaryButton from '../components/PrimaryButton'
import StatusChip from '../components/StatusChip'
import Icon from '../components/Icon'

// Each pin has an exact position on the map grid plus navigation metadata.
// order = sequence along the optimized route; dist/aisle drive the 3D nav.
const PINS = [
  { id: 'milk', x: 60, y: 250, emoji: '🥛', name: 'Milk', aisle: 'Dairy', dist: 42, side: 'left', order: 1 },
  { id: 'tomatoes', x: 150, y: 150, emoji: '🍅', name: 'Tomatoes', aisle: 'Produce', dist: 26, side: 'right', order: 2 },
  { id: 'bread', x: 250, y: 235, emoji: '🍞', name: 'Bread', aisle: 'Bakery', dist: 33, side: 'left', order: 3 },
  { id: 'pasta', x: 300, y: 130, emoji: '🍝', name: 'Pasta', aisle: 'Pantry', dist: 48, side: 'right', order: 4 },
]

export default function StoreMap({ go, toast, openNav }) {
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

      <div className="map-hint">
        <Icon name="pin" size={15} /> Tap a product to start live 3D navigation
      </div>

      <div className="map-wrap" style={{ marginTop: 10 }}>
        <svg className="map-svg" viewBox="0 0 360 360" role="img" aria-label="Store map">
          <defs>
            <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#34d399" />
              <stop offset="1" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* floor */}
          <rect x="0" y="0" width="360" height="360" fill="#eef4fb" />
          <rect x="14" y="14" width="332" height="332" rx="18" fill="#f8fbff" stroke="#dbe6f3" strokeWidth="2" />

          {/* aisles / shelves */}
          {[
            [40, 60, 90, 26], [40, 110, 90, 26], [150, 60, 70, 26],
            [240, 60, 90, 26], [240, 110, 90, 26], [40, 200, 70, 26],
            [40, 250, 70, 26], [150, 200, 60, 26], [150, 250, 60, 26],
            [250, 200, 80, 26], [250, 250, 80, 26],
          ].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="6" fill="#dce7f4" />
          ))}

          {/* entrance & checkout */}
          <rect x="26" y="310" width="78" height="26" rx="8" fill="#d1fae5" />
          <text x="65" y="327" textAnchor="middle" fontSize="12" fontWeight="700" fill="#047857">Entrance</text>
          <rect x="256" y="310" width="78" height="26" rx="8" fill="#dbeafe" />
          <text x="295" y="327" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8">Checkout</text>

          {/* optimized route */}
          <path
            d="M65 305 L60 250 L150 150 L250 235 L300 130 L295 305"
            fill="none" stroke="url(#routeGrad)" strokeWidth="5"
            strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10 9"
          >
            <animate attributeName="stroke-dashoffset" from="190" to="0" dur="2.4s" repeatCount="indefinite" />
          </path>

          {/* tappable product pins at their exact positions */}
          {PINS.map((p) => (
            <g key={p.id} className="map-pin" onClick={() => openNav(p)} style={{ cursor: 'pointer' }}>
              <circle cx={p.x} cy={p.y} r="19" fill="#34d399" opacity="0.18">
                <animate attributeName="r" values="17;22;17" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx={p.x} cy={p.y} r="15" fill="#fff" stroke="#34d399" strokeWidth="2.5" />
              <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="15">{p.emoji}</text>
              <g transform={`translate(${p.x}, ${p.y - 25})`}>
                <rect x="-22" y="-11" width="44" height="18" rx="9" fill="#1f2937" />
                <text x="0" y="2" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">{p.name}</text>
              </g>
            </g>
          ))}

          {/* start / end dots */}
          <circle cx="65" cy="305" r="7" fill="#34d399" stroke="#fff" strokeWidth="2.5" />
          <circle cx="295" cy="305" r="7" fill="#3b82f6" stroke="#fff" strokeWidth="2.5" />
        </svg>
      </div>

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
        <PrimaryButton icon="nav" onClick={() => openNav(PINS[0])}>
          Start Navigation
        </PrimaryButton>
      </div>
    </div>
  )
}
