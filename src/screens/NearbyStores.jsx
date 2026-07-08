import Icon from '../components/Icon'

const YOU = { x: 182, y: 196 }
const STORES = [
  { id: 'center', name: 'Fridgely Market', area: 'Center', dist: '0.4 km', open: '22:00', offers: 3, x: 150, y: 150, main: true },
  { id: 'green', name: 'GreenMart', area: 'Northside', dist: '1.2 km', open: '20:00', offers: 2, x: 258, y: 92 },
  { id: 'fresh', name: 'FreshBox', area: 'Central Station', dist: '2.1 km', open: '24 h', offers: 5, x: 92, y: 254 },
  { id: 'bio', name: 'BioHof', area: 'Westend', dist: '2.8 km', open: '19:00', offers: 1, x: 286, y: 262 },
]

// abstract city blocks
const BLOCKS = [
  [40, 40, 70, 60], [130, 34, 80, 46], [230, 44, 90, 54],
  [40, 130, 60, 70], [250, 120, 70, 60],
  [40, 240, 70, 70], [140, 250, 70, 60], [250, 300, 80, 40],
]

export default function NearbyStores({ onClose, toast }) {
  return (
    <div className="nearby">
      <div className="nearby__map">
        <svg viewBox="0 0 360 380" preserveAspectRatio="xMidYMid slice" className="nearby__svg">
          <rect x="-40" y="-40" width="440" height="460" fill="#e9f1f8" />

          {/* park + water for flavour */}
          <rect x="120" y="110" width="90" height="80" rx="14" fill="#d6f0dc" />
          <rect x="-20" y="330" width="120" height="90" rx="16" fill="#cfe6fb" />

          {/* city blocks */}
          {BLOCKS.map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="10" fill="#f4f8fc" stroke="#dde7f1" strokeWidth="1.5" />
          ))}

          {/* roads */}
          <g stroke="#ffffff" strokeWidth="12" strokeLinecap="round">
            <line x1="0" y1="112" x2="360" y2="112" />
            <line x1="0" y1="220" x2="360" y2="220" />
            <line x1="120" y1="0" x2="120" y2="380" />
            <line x1="228" y1="0" x2="228" y2="380" />
          </g>
          <g stroke="#e5eef6" strokeWidth="12" strokeLinecap="round" strokeDasharray="1 22">
            <line x1="0" y1="112" x2="360" y2="112" />
            <line x1="0" y1="220" x2="360" y2="220" />
            <line x1="120" y1="0" x2="120" y2="380" />
            <line x1="228" y1="0" x2="228" y2="380" />
          </g>

          {/* store pins */}
          {STORES.map((s) => (
            <g key={s.id} transform={`translate(${s.x} ${s.y})`}>
              <ellipse cx="0" cy="30" rx="12" ry="4" fill="rgba(15,40,80,0.12)" />
              <path d="M0 30 C-13 12 -16 4 -16 -3 A16 16 0 1 1 16 -3 C16 4 13 12 0 30Z"
                fill={s.main ? '#3b82f6' : '#34d399'} stroke="#fff" strokeWidth="2.5" />
              <g transform="translate(-8 -11)" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0.5 0.5h2l1.6 8.2a1 1 0 0 0 1 .8h5.5a1 1 0 0 0 1-.8L13.5 3H3.5" />
              </g>
            </g>
          ))}

          {/* you-are-here */}
          <g transform={`translate(${YOU.x} ${YOU.y})`}>
            <circle r="26" fill="#3b82f6" opacity="0.14">
              <animate attributeName="r" values="18;30;18" dur="2.6s" repeatCount="indefinite" />
            </circle>
            <circle r="9" fill="#3b82f6" stroke="#fff" strokeWidth="3.5" />
          </g>
        </svg>

        <button className="nearby__close" onClick={onClose} aria-label="Close">
          <Icon name="chevronLeft" size={20} strokeWidth={2.6} />
        </button>
        <div className="nearby__pill"><span className="nearby__pill-dot" /> {STORES.length} stores nearby</div>
      </div>

      {/* store list */}
      <div className="nearby__sheet">
        <div className="nearby__title">Stores with Fridgely near you</div>
        <div className="nearby__sub">Tap a store to make it your active market</div>
        <div className="nearby__list">
          {STORES.map((s) => (
            <button key={s.id} className="nearby__store" onClick={() => { toast?.(`${s.name} set as your store`); onClose() }}>
              <span className={`nearby__store-icn ${s.main ? 'is-main' : ''}`}><Icon name="pin" size={20} /></span>
              <div className="nearby__store-body">
                <div className="nearby__store-name">
                  {s.name}
                  {s.main && <span className="nearby__tag">Current</span>}
                </div>
                <div className="nearby__store-meta">{s.area} · {s.dist} · open until {s.open}</div>
              </div>
              <div className="nearby__store-offers">
                <span className="nearby__offers-num">{s.offers}</span>
                <span className="nearby__offers-lbl">offers</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
