import { useMemo, useState } from 'react'
import Card from '../components/Card'
import PrimaryButton from '../components/PrimaryButton'
import StatusChip from '../components/StatusChip'
import Icon from '../components/Icon'

// compartments / "Fächer"
const COMPARTMENTS = [
  { id: 'fridge', name: 'Fridge', emoji: '🧊' },
  { id: 'freezer', name: 'Freezer', emoji: '❄️' },
  { id: 'pantry', name: 'Pantry', emoji: '🥫' },
]

const DICT = {
  milk: ['🥛', 'Dairy'], yogurt: ['🥣', 'Dairy'], cheese: ['🧀', 'Dairy'], butter: ['🧈', 'Dairy'], eggs: ['🥚', 'Dairy'], cream: ['🥛', 'Dairy'],
  apple: ['🍎', 'Fruit'], banana: ['🍌', 'Fruit'], tomato: ['🍅', 'Fruit'], tomatoes: ['🍅', 'Fruit'], lemon: ['🍋', 'Fruit'], carrots: ['🥕', 'Fruit'], peas: ['🫛', 'Fruit'],
  bread: ['🍞', 'Bakery'], pizza: ['🍕', 'Pantry'], pasta: ['🍝', 'Pantry'], rice: ['🍚', 'Pantry'],
  chicken: ['🍗', 'Meat'], fish: ['🐟', 'Meat'], beef: ['🥩', 'Meat'],
}
const guess = (name) => DICT[name.trim().toLowerCase()] || ['🥡', 'Other']

let uid = 100
const INITIAL = [
  { id: 1, name: 'Milk', emoji: '🥛', compartment: 'fridge', days: 2, low: false },
  { id: 2, name: 'Eggs', emoji: '🥚', compartment: 'fridge', days: 6, low: false },
  { id: 3, name: 'Tomatoes', emoji: '🍅', compartment: 'fridge', days: 1, low: false },
  { id: 4, name: 'Yogurt', emoji: '🥣', compartment: 'fridge', days: 4, low: true },
  { id: 5, name: 'Cheese', emoji: '🧀', compartment: 'fridge', days: 9, low: false },
  { id: 6, name: 'Peas', emoji: '🫛', compartment: 'freezer', days: 90, low: false },
  { id: 7, name: 'Pizza', emoji: '🍕', compartment: 'freezer', days: 60, low: false },
  { id: 8, name: 'Pasta', emoji: '🍝', compartment: 'pantry', days: 300, low: false },
  { id: 9, name: 'Rice', emoji: '🍚', compartment: 'pantry', days: 250, low: true },
]

const statusOf = (it) => (it.days <= 2 ? 'expire' : it.low ? 'low' : 'fresh')
const chipOf = (it) => (it.days <= 2 ? 'Expires soon' : it.low ? 'Running low' : 'Fresh')
const metaOf = (it) => {
  if (it.days <= 0) return 'Expired'
  if (it.days === 1) return '1 day left'
  if (it.days <= 14) return `${it.days} days left`
  if (it.days < 60) return `${Math.round(it.days / 7)} weeks left`
  return `${Math.round(it.days / 30)} months left`
}

const PRESETS = [1, 3, 5, 7, 14, 30]
const blank = { name: '', compartment: 'fridge', days: 5, low: false }

export default function Fridge({ go, toast, list }) {
  const { week, todayIndex, activeListId, addItems, setListDay } = list
  const [items, setItems] = useState(INITIAL)
  const [filter, setFilter] = useState('all')

  const [editor, setEditor] = useState(null) // { id?, ...fields }
  const [genOpen, setGenOpen] = useState(false)

  const attention = items.filter((it) => statusOf(it) !== 'fresh').length
  const shown = filter === 'all' ? items : items.filter((it) => it.compartment === filter)

  const openAdd = () => setEditor({ ...blank })
  const openEdit = (it) => setEditor({ ...it })
  const save = () => {
    const name = editor.name.trim()
    if (!name) return
    const [emoji] = guess(name)
    if (editor.id) {
      setItems((p) => p.map((it) => (it.id === editor.id ? { ...editor, name, emoji: it.emoji || emoji } : it)))
      toast('Item updated')
    } else {
      setItems((p) => [...p, { ...editor, id: ++uid, name, emoji }])
      toast(`${name} added to ${COMPARTMENTS.find((c) => c.id === editor.compartment).name}`)
    }
    setEditor(null)
  }
  const remove = () => {
    setItems((p) => p.filter((it) => it.id !== editor.id))
    setEditor(null)
    toast('Item removed')
  }

  // smart generate from what's low/expiring
  const suggestions = useMemo(() => items.filter((it) => statusOf(it) !== 'fresh'), [items])
  const [picked, setPicked] = useState(null)
  const [genDay, setGenDay] = useState(todayIndex)
  const openGen = () => { setPicked(new Set(suggestions.map((s) => s.id))); setGenDay(todayIndex); setGenOpen(true) }
  const confirmGen = () => {
    const chosen = suggestions.filter((s) => picked.has(s.id)).map((s) => ({ name: s.name, emoji: s.emoji, category: guess(s.name)[1] }))
    if (chosen.length) addItems(activeListId, genDay, chosen)
    setListDay(genDay)
    setGenOpen(false)
    toast(`${chosen.length} items added to ${week[genDay].short}`)
    go('list')
  }

  const Grid = ({ list: arr }) => (
    <div className="fridge-grid">
      {arr.map((it) => (
        <button className="fridge-card" key={it.id} onClick={() => openEdit(it)}>
          <div className="fridge-card__top">
            <div className="fridge-card__emoji">{it.emoji}</div>
            <StatusChip status={statusOf(it)} dot={false}>{chipOf(it)}</StatusChip>
          </div>
          <div className="fridge-card__name">{it.name}</div>
          <div className="fridge-card__meta">{metaOf(it)}</div>
        </button>
      ))}
    </div>
  )

  return (
    <div className="rise">
      <div className="screen-head" style={{ justifyContent: 'space-between' }}>
        <div>
          <h1 className="screen-title">My Fridge</h1>
          <div className="screen-sub">{items.length} items · {attention} need attention</div>
        </div>
        <button className="head-add" onClick={openAdd} aria-label="Add item">
          <Icon name="plus" size={22} strokeWidth={2.5} />
        </button>
      </div>

      <Card className="ai-card" style={{ marginTop: 18, padding: 16 }}>
        <span className="ai-card__icn"><Icon name="spark" size={20} strokeWidth={2.2} /></span>
        <div>
          <div className="ai-card__tag">AI Suggestion</div>
          <div className="ai-card__text">Use tomatoes today to avoid waste. They pair perfectly with your pasta. 🍝</div>
        </div>
      </Card>

      {/* compartment filter */}
      <div className="list-tabs">
        <button className={`list-tab ${filter === 'all' ? 'is-active' : ''}`} onClick={() => setFilter('all')}>All</button>
        {COMPARTMENTS.map((c) => (
          <button key={c.id} className={`list-tab ${filter === c.id ? 'is-active' : ''}`} onClick={() => setFilter(c.id)}>
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      {filter === 'all' ? (
        COMPARTMENTS.map((c) => {
          const arr = items.filter((it) => it.compartment === c.id)
          if (!arr.length) return null
          return (
            <div key={c.id}>
              <div className="cat-head">
                <span className="cat-head__name">{c.emoji} {c.name}</span>
                <span className="cat-head__line" />
                <StatusChip status="neutral" dot={false}>{arr.length}</StatusChip>
              </div>
              <Grid list={arr} />
            </div>
          )
        })
      ) : (
        <div style={{ marginTop: 12 }}><Grid list={shown} /></div>
      )}

      <div style={{ marginTop: 20 }}>
        <PrimaryButton icon="list" onClick={openGen}>Generate Shopping List</PrimaryButton>
      </div>

      {/* ===== add / edit item sheet ===== */}
      {editor && (
        <div className="sheet" onClick={() => setEditor(null)}>
          <div className="sheet__panel" onClick={(e) => e.stopPropagation()}>
            <div className="sheet__grip" />
            <div className="sheet__title">{editor.id ? 'Edit item' : 'Add item'}</div>

            <div className="sheet__label">Name</div>
            <div className="add-row__field" style={{ marginTop: 0 }}>
              <span style={{ fontSize: 20 }}>{guess(editor.name || ' ')[0]}</span>
              <input
                className="add-row__input"
                autoFocus={!editor.id}
                placeholder="e.g. Milk"
                value={editor.name}
                onChange={(e) => setEditor({ ...editor, name: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && save()}
              />
            </div>

            <div className="sheet__label">Compartment</div>
            <div className="seg">
              {COMPARTMENTS.map((c) => (
                <button key={c.id} className={`seg__opt ${editor.compartment === c.id ? 'is-on' : ''}`} onClick={() => setEditor({ ...editor, compartment: c.id })}>
                  {c.emoji} {c.name}
                </button>
              ))}
            </div>

            <div className="sheet__label">Expires in</div>
            <div className="stepper">
              <button className="stepper__btn" onClick={() => setEditor({ ...editor, days: Math.max(0, editor.days - 1) })}><Icon name="plus" size={18} style={{ transform: 'rotate(45deg)' }} /></button>
              <div className="stepper__val">{editor.days} <span>days</span></div>
              <button className="stepper__btn" onClick={() => setEditor({ ...editor, days: editor.days + 1 })}><Icon name="plus" size={18} strokeWidth={2.6} /></button>
            </div>
            <div className="preset-row">
              {PRESETS.map((d) => (
                <button key={d} className={`preset ${editor.days === d ? 'is-on' : ''}`} onClick={() => setEditor({ ...editor, days: d })}>{d}d</button>
              ))}
            </div>

            <div className="toggle-row" onClick={() => setEditor({ ...editor, low: !editor.low })}>
              <div>
                <div className="toggle-row__title">Running low</div>
                <div className="toggle-row__sub">Flag it to restock soon</div>
              </div>
              <span className={`toggle ${editor.low ? 'is-on' : ''}`}><span className="toggle__knob" /></span>
            </div>

            <PrimaryButton icon="check" onClick={save} style={{ marginTop: 16 }}>
              {editor.id ? 'Save changes' : 'Add to fridge'}
            </PrimaryButton>
            {editor.id && (
              <button className="sheet__delete" onClick={remove}>Remove item</button>
            )}
          </div>
        </div>
      )}

      {/* ===== smart generate sheet ===== */}
      {genOpen && (
        <div className="sheet" onClick={() => setGenOpen(false)}>
          <div className="sheet__panel" onClick={(e) => e.stopPropagation()}>
            <div className="sheet__grip" />
            <div className="sheet__head">
              <span className="ai-card__icn"><Icon name="spark" size={20} strokeWidth={2.2} /></span>
              <div>
                <div className="sheet__title">Smart list</div>
                <div className="sheet__sub">Based on your fridge inventory, you should get:</div>
              </div>
            </div>
            {suggestions.length === 0 ? (
              <div className="search__empty">Nothing to restock — your fridge looks great! 🎉</div>
            ) : (
              <div className="sheet__list">
                {suggestions.map((s) => {
                  const on = picked.has(s.id)
                  return (
                    <button key={s.id} className="suggest" onClick={() => setPicked((prev) => { const n = new Set(prev); n.has(s.id) ? n.delete(s.id) : n.add(s.id); return n })}>
                      <span className="product__emoji">{s.emoji}</span>
                      <div className="product__body">
                        <div className="product__name">{s.name}</div>
                        <div className="product__meta">{metaOf(s)}{s.low ? ' · running low' : ''}</div>
                      </div>
                      <span className={`checkbox ${on ? 'is-checked' : ''}`}><Icon name="check" size={16} strokeWidth={3} /></span>
                    </button>
                  )
                })}
              </div>
            )}
            {suggestions.length > 0 && (
              <>
                <div className="sheet__label">Add to which day?</div>
                <div className="week-strip week-strip--sheet">
                  {week.map((d) => (
                    <button key={d.key} className={`week-day ${d.key === genDay ? 'is-active' : ''} ${d.isToday ? 'is-today' : ''}`} onClick={() => setGenDay(d.key)}>
                      <span className="week-day__name">{d.short}</span>
                      <span className="week-day__date">{d.date}</span>
                    </button>
                  ))}
                </div>
                <PrimaryButton icon="plus" onClick={confirmGen} style={{ marginTop: 16 }}>
                  Add {picked ? picked.size : 0} to {week[genDay].short}
                </PrimaryButton>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
