import { useMemo, useState } from 'react'
import Card from '../components/Card'
import PrimaryButton from '../components/PrimaryButton'
import StatusChip from '../components/StatusChip'
import Icon from '../components/Icon'

// ---- store geometry (SVG units) ----
export const AISLE_Y = 300 // horizontal main walkway
export const ENTRANCE = { x: 58, y: 322 }
export const CHECKOUT = { x: 322, y: 322 }
// shelf bars (gray); products live in the lanes BETWEEN them so routes never cross a shelf
const BARS = [40, 104, 168, 232, 296] // left x of each 44-wide bar
const ROWS_Y = [96, 146, 196, 246] // row centers

// products positioned in lanes (x = walkway between shelves)
const LIST_ITEMS = [
  { id: 'milk', x: 88, y: 96, emoji: '🥛', name: 'Milk', aisle: 'Aisle 1', row: 1, dist: 42, side: 'left', order: 1, onList: true, price: 1.29 },
  { id: 'tomatoes', x: 152, y: 146, emoji: '🍅', name: 'Tomatoes', aisle: 'Aisle 2', row: 2, dist: 26, side: 'right', order: 2, onList: true, price: 2.49 },
  { id: 'bread', x: 216, y: 196, emoji: '🍞', name: 'Bread', aisle: 'Aisle 3', row: 3, dist: 33, side: 'left', order: 3, onList: true, price: 2.19 },
  { id: 'pasta', x: 280, y: 96, emoji: '🍝', name: 'Pasta', aisle: 'Aisle 4', row: 1, dist: 48, side: 'right', order: 4, onList: true, price: 1.79 },
]
const CATALOG = [
  ...LIST_ITEMS,
  { id: 'apples', x: 152, y: 96, emoji: '🍎', name: 'Apples', aisle: 'Aisle 2', row: 1, dist: 24, side: 'left' },
  { id: 'bananas', x: 152, y: 246, emoji: '🍌', name: 'Bananas', aisle: 'Aisle 2', row: 4, dist: 28, side: 'right' },
  { id: 'cheese', x: 88, y: 146, emoji: '🧀', name: 'Cheese', aisle: 'Aisle 1', row: 2, dist: 40, side: 'right' },
  { id: 'yogurt', x: 88, y: 196, emoji: '🥣', name: 'Yogurt', aisle: 'Aisle 1', row: 3, dist: 38, side: 'left' },
  { id: 'eggs', x: 88, y: 246, emoji: '🥚', name: 'Eggs', aisle: 'Aisle 1', row: 4, dist: 36, side: 'right' },
  { id: 'rice', x: 280, y: 146, emoji: '🍚', name: 'Rice', aisle: 'Aisle 4', row: 2, dist: 52, side: 'right' },
  { id: 'coffee', x: 280, y: 196, emoji: '☕', name: 'Coffee', aisle: 'Aisle 4', row: 3, dist: 50, side: 'left' },
  { id: 'water', x: 216, y: 96, emoji: '💧', name: 'Water', aisle: 'Aisle 3', row: 1, dist: 34, side: 'right' },
  { id: 'chicken', x: 216, y: 246, emoji: '🍗', name: 'Chicken', aisle: 'Aisle 3', row: 4, dist: 30, side: 'left' },
]

const OFFERS = [
  { emoji: '🍅', name: 'Tomatoes', category: 'Fruit', note: '−20% today', price: '€1,99', old: '€2,49', aisle: 'Aisle 2 · Row 2' },
  { emoji: '🍝', name: 'Pasta', category: 'Pantry', note: 'Buy 2, pay 1', price: '€1,79', old: '€3,58', aisle: 'Aisle 4 · Row 1' },
  { emoji: '☕', name: 'Coffee', category: 'Pantry', note: '−15% member deal', price: '€4,24', old: '€4,99', aisle: 'Aisle 4 · Row 3' },
]

const AISLE_NAMES = ['Dairy', 'Produce', 'Bakery', 'Pantry', 'Drinks']

// nearby stores that are "compatible with Fridgely"
const STORES = [
  { id: 'center', name: 'Fridgely Market', area: 'Center', distance: '0.4 km', open: '22:00', min: 18 },
  { id: 'green', name: 'GreenMart', area: 'Northside', distance: '1.2 km', open: '20:00', min: 22 },
  { id: 'fresh', name: 'FreshBox', area: 'Central Station', distance: '2.1 km', open: '24 h', min: 26 },
]

// route that stays in the walkways: drop to the main aisle, slide across, go up the lane
const routeTo = (p) => `M ${ENTRANCE.x} ${ENTRANCE.y} L ${ENTRANCE.x} ${AISLE_Y} L ${p.x} ${AISLE_Y} L ${p.x} ${p.y}`

// map a catalog product by name so list items get a shelf position
const POS = Object.fromEntries(CATALOG.map((c) => [c.name.toLowerCase(), c]))

export default function StoreMap({ go, toast, openNav, list }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [focused, setFocused] = useState(false)
  const [offersOpen, setOffersOpen] = useState(false)
  const [storeId, setStoreId] = useState('center')
  const [storeOpen, setStoreOpen] = useState(false)
  const store = STORES.find((s) => s.id === storeId)

  const { items, activeListId, listDay, week, lists, addItems } = list
  const activeList = lists.find((l) => l.id === activeListId)
  const [addedOffers, setAddedOffers] = useState(new Set())

  const addOffer = (o) => {
    addItems(activeListId, listDay, [{ name: o.name, emoji: o.emoji, category: o.category }])
    setAddedOffers((prev) => new Set(prev).add(o.name))
    toast(`${o.name} added to ${week[listDay].short}`)
  }

  // products still to buy on the active list for the selected day, matched to shelves
  const routeItems = useMemo(() => {
    const dayItems = items.filter((it) => it.listId === activeListId && it.day === listDay && !it.done)
    const seen = new Set()
    const matched = []
    for (const it of dayItems) {
      const pos = POS[it.name.toLowerCase()]
      if (pos && !seen.has(pos.id)) { seen.add(pos.id); matched.push(pos) }
    }
    matched.sort((a, b) => a.x - b.x || a.y - b.y)
    return matched.map((p, i) => ({ ...p, order: i + 1 }))
  }, [items, activeListId, listDay])

  const onListNames = useMemo(() => new Set(routeItems.map((r) => r.name)), [routeItems])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return CATALOG.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 6)
  }, [query])

  const pick = (p) => { setSelected(p); setQuery(p.name); setFocused(false) }
  const reset = () => { setSelected(null); setQuery('') }

  const showResults = focused && query.trim() && !selected
  const inRoute = selected && routeItems.some((r) => r.id === selected.id)
  const pins = selected && !inRoute ? [...routeItems, selected] : routeItems

  // optimized comb route through the day's list items
  const overview = useMemo(() => {
    let d = `M ${ENTRANCE.x} ${ENTRANCE.y} L ${ENTRANCE.x} ${AISLE_Y}`
    for (const it of routeItems) d += ` L ${it.x} ${AISLE_Y} L ${it.x} ${it.y} L ${it.x} ${AISLE_Y}`
    d += ` L ${CHECKOUT.x} ${AISLE_Y} L ${CHECKOUT.x} ${CHECKOUT.y}`
    return d
  }, [routeItems])

  return (
    <div className="rise">
      <div className="screen-head">
        <button className="screen-head__back" onClick={() => go('list')}>
          <Icon name="chevronLeft" size={20} strokeWidth={2.4} />
        </button>
        <div>
          <h1 className="screen-title">Store Route</h1>
          <div className="screen-sub">{activeList?.name} · {week[listDay].full}</div>
        </div>
      </div>

      {/* current store + switcher */}
      <button className="store-bar" onClick={() => setStoreOpen(true)}>
        <span className="store-bar__icn"><Icon name="pin" size={20} /></span>
        <div className="store-bar__body">
          <div className="store-bar__name">{store.name} · {store.area}</div>
          <div className="store-bar__meta">{store.distance} away · open until {store.open}</div>
        </div>
        <span className="store-bar__change">Change <Icon name="chevron" size={14} strokeWidth={2.6} /></span>
      </button>

      {/* product search */}
      <div className="search">
        <div className="search__box">
          <Icon name="list" size={18} className="muted" />
          <input
            className="search__input"
            placeholder="Search a product…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(null) }}
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
                <div key={p.id} className="search__result" onMouseDown={(e) => e.preventDefault()} onClick={() => pick(p)}>
                  <span className="search__result-emoji">{p.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div className="search__result-name">{p.name}</div>
                    <div className="search__result-aisle">{p.aisle} · Row {p.row} · {p.dist} m</div>
                  </div>
                  {onListNames.has(p.name) ? <StatusChip status="info" dot={false}>On list</StatusChip> : <Icon name="chevron" size={16} className="muted" />}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {!selected && (
        <div className="map-hint"><Icon name="pin" size={15} /> Search or tap a product to see its exact shelf</div>
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

          {/* shelf bars with rows */}
          {BARS.map((bx, bi) => (
            <g key={bi}>
              <rect x={bx} y="56" width="44" height="210" rx="7" fill="#dce7f4" />
              {ROWS_Y.map((ry, ri) => (
                <line key={ri} x1={bx + 4} y1={ry + 25} x2={bx + 40} y2={ry + 25} stroke="#c5d4e6" strokeWidth="1.4" />
              ))}
              <text x={bx + 22} y="50" textAnchor="middle" fontSize="8.5" fontWeight="800" letterSpacing="0.4" fill="#9aa8bd">
                {AISLE_NAMES[bi]}
              </text>
            </g>
          ))}

          {/* entrance + checkout */}
          <rect x="22" y="316" width="74" height="26" rx="8" fill="#d1fae5" />
          <text x="59" y="333" textAnchor="middle" fontSize="11" fontWeight="700" fill="#047857">Entrance</text>
          <rect x="264" y="316" width="74" height="26" rx="8" fill="#dbeafe" />
          <text x="301" y="333" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1d4ed8">Checkout</text>

          {/* route */}
          <path
            d={selected ? routeTo(selected) : overview}
            fill="none" stroke="url(#routeGrad)" strokeWidth="5"
            strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10 9"
          >
            <animate attributeName="stroke-dashoffset" from="190" to="0" dur="30s" repeatCount="indefinite" />
          </path>

          {/* pins */}
          {pins.map((p) => {
            const isSel = selected && p.id === selected.id
            const dim = selected && !isSel
            return (
              <g key={p.id} className={`map-pin ${isSel ? 'is-selected' : ''} ${dim ? 'is-dim' : ''}`}
                 onClick={() => openNav({ stops: [p] })} style={{ cursor: 'pointer' }}>
                <circle cx={p.x} cy={p.y} r="17" fill={isSel ? '#3b82f6' : '#34d399'} opacity="0.16">
                  <animate attributeName="r" values="15;20;15" dur="3.4s" repeatCount="indefinite" />
                </circle>
                <circle cx={p.x} cy={p.y} r={isSel ? 15 : 13} fill="#fff" stroke={isSel ? '#3b82f6' : '#34d399'} strokeWidth={isSel ? 3 : 2.4} />
                <text x={p.x} y={p.y + 4.5} textAnchor="middle" fontSize="13">{p.emoji}</text>
                <g transform={`translate(${p.x}, ${p.y - 23})`}>
                  <rect x="-26" y="-10" width="52" height="17" rx="8.5" fill={isSel ? '#3b82f6' : '#1f2937'} />
                  <text x="0" y="2" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#fff">{p.name}</text>
                </g>
              </g>
            )
          })}

          <circle cx={ENTRANCE.x} cy={AISLE_Y} r="6" fill="#34d399" stroke="#fff" strokeWidth="2.5" />
          {!selected && <circle cx={CHECKOUT.x} cy={AISLE_Y} r="6" fill="#3b82f6" stroke="#fff" strokeWidth="2.5" />}
        </svg>
      </div>

      {selected ? (
        <Card style={{ marginTop: 16 }}>
          <div className="route-stat-card">
            <span className="found-emoji">{selected.emoji}</span>
            <div className="route-stat" style={{ flex: 1 }}>
              <div className="route-stat__big">{selected.name}</div>
              <div className="route-stat__lbl">📍 {selected.aisle} · Row {selected.row} · {selected.dist} m away</div>
            </div>
            <button className="found-clear" onClick={reset} aria-label="Clear">
              <Icon name="plus" size={16} style={{ transform: 'rotate(45deg)' }} />
            </button>
          </div>
          <div style={{ marginTop: 14 }}>
            <PrimaryButton icon="nav" onClick={() => openNav({ stops: [selected] })}>Start Navigation</PrimaryButton>
          </div>
        </Card>
      ) : (
        <>
          <div className="map-legend">
            <div className="map-legend__item"><span className="legend-swatch" style={{ background: '#dce7f4' }} /> Shelves</div>
            <div className="map-legend__item"><span className="legend-swatch" style={{ background: '#fff', border: '2px solid #34d399' }} /> Your items</div>
            <div className="map-legend__item"><span className="legend-line" /> Walkway route</div>
          </div>

          <Card style={{ marginTop: 18 }}>
            <div className="route-stat-card">
              <div className="route-stat">
                <div className="route-stat__big">{store.min} min</div>
                <div className="route-stat__lbl">Fastest route</div>
              </div>
              <div className="route-stat__div" />
              <button className="route-stat route-stat--tap" onClick={() => setOffersOpen(true)}>
                <div className="route-stat__big">3 offers <Icon name="chevron" size={15} /></div>
                <div className="route-stat__lbl">Tap to see deals</div>
              </button>
              <StatusChip status="info" dot={false}><Icon name="tag" size={13} /> Save €4.20</StatusChip>
            </div>
          </Card>

          <div style={{ marginTop: 16 }}>
            {routeItems.length > 0 ? (
              <PrimaryButton icon="route" onClick={() => openNav({ stops: routeItems })}>
                Start Tour · {routeItems.length} stops
              </PrimaryButton>
            ) : (
              <PrimaryButton variant="ghost" icon="list" onClick={() => go('list')}>
                Plan {week[listDay].short}'s list first
              </PrimaryButton>
            )}
          </div>
        </>
      )}

      {/* store picker sheet */}
      {storeOpen && (
        <div className="sheet" onClick={() => setStoreOpen(false)}>
          <div className="sheet__panel" onClick={(e) => e.stopPropagation()}>
            <div className="sheet__grip" />
            <div className="sheet__head">
              <span className="ai-card__icn" style={{ background: 'var(--grad-brand)' }}><Icon name="pin" size={20} /></span>
              <div>
                <div className="sheet__title">Stores near you</div>
                <div className="sheet__sub">Supermarkets compatible with Fridgely</div>
              </div>
            </div>
            <div className="sheet__list">
              {STORES.map((s) => (
                <button
                  key={s.id}
                  className={`store-opt ${s.id === storeId ? 'is-active' : ''}`}
                  onClick={() => { setStoreId(s.id); setStoreOpen(false); toast(`Switched to ${s.name}`) }}
                >
                  <span className="store-opt__icn"><Icon name="pin" size={19} /></span>
                  <div className="product__body">
                    <div className="product__name">{s.name}</div>
                    <div className="product__meta">{s.area} · {s.distance} · open until {s.open}</div>
                  </div>
                  {s.id === storeId
                    ? <span className="store-opt__check"><Icon name="check" size={16} strokeWidth={3} /></span>
                    : <StatusChip status="fresh" dot={false}>Compatible</StatusChip>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* offers sheet */}
      {offersOpen && (
        <div className="sheet" onClick={() => setOffersOpen(false)}>
          <div className="sheet__panel" onClick={(e) => e.stopPropagation()}>
            <div className="sheet__grip" />
            <div className="sheet__head">
              <span className="ai-card__icn" style={{ background: 'var(--grad-blue)' }}><Icon name="tag" size={20} /></span>
              <div>
                <div className="sheet__title">3 offers on your route</div>
                <div className="sheet__sub">Deals near the products you're passing today</div>
              </div>
            </div>
            <div className="sheet__list">
              {OFFERS.map((o) => {
                const added = addedOffers.has(o.name)
                return (
                  <div className="offer" key={o.name}>
                    <span className="product__emoji">{o.emoji}</span>
                    <div className="product__body">
                      <div className="product__name">{o.name}</div>
                      <div className="product__meta">📍 {o.aisle}</div>
                    </div>
                    <div className="offer__price">
                      <StatusChip status="expire" dot={false}>{o.note}</StatusChip>
                      <div className="offer__amounts"><span className="offer__new">{o.price}</span> <span className="offer__old">{o.old}</span></div>
                    </div>
                    <button
                      className={`offer__add ${added ? 'is-added' : ''}`}
                      onClick={() => !added && addOffer(o)}
                      aria-label={added ? `${o.name} added` : `Add ${o.name} to list`}
                    >
                      <Icon name={added ? 'check' : 'plus'} size={17} strokeWidth={2.6} />
                    </button>
                  </div>
                )
              })}
            </div>
            <PrimaryButton icon="route" onClick={() => { setOffersOpen(false); routeItems.length ? openNav({ stops: routeItems }) : go('list') }} style={{ marginTop: 16 }}>
              Start Tour
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  )
}
