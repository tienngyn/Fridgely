import { useState } from 'react'
import Card from '../components/Card'
import PrimaryButton from '../components/PrimaryButton'
import StatusChip from '../components/StatusChip'
import Icon from '../components/Icon'

const ITEMS = [
  { emoji: '🥛', name: 'Milk', meta: '2 days left', status: 'expire', chip: 'Expires soon', category: 'Dairy', restock: true },
  { emoji: '🥚', name: 'Eggs', meta: '6 left', status: 'fresh', chip: 'Fresh', category: 'Dairy' },
  { emoji: '🍅', name: 'Tomatoes', meta: 'expires soon', status: 'expire', chip: 'Expires soon', category: 'Fruit', restock: true },
  { emoji: '🥣', name: 'Yogurt', meta: 'running low', status: 'low', chip: 'Low', category: 'Dairy', restock: true },
  { emoji: '🧀', name: 'Cheese', meta: 'good', status: 'fresh', chip: 'Fresh', category: 'Dairy' },
  { emoji: '🧈', name: 'Butter', meta: '1 week left', status: 'fresh', chip: 'Fresh', category: 'Dairy' },
]

export default function Fridge({ go, toast, list }) {
  const { week, todayIndex, activeListId, addItems, setListDay } = list
  const [sheet, setSheet] = useState(false)
  const suggestions = ITEMS.filter((i) => i.restock)
  const [picked, setPicked] = useState(() => new Set(suggestions.map((s) => s.name)))
  const [day, setDay] = useState(todayIndex)

  const togglePick = (name) =>
    setPicked((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })

  const confirm = () => {
    const chosen = suggestions
      .filter((s) => picked.has(s.name))
      .map((s) => ({ name: s.name, emoji: s.emoji, category: s.category }))
    if (chosen.length) addItems(activeListId, day, chosen)
    setListDay(day)
    setSheet(false)
    toast(`${chosen.length} items added to ${week[day].short}`)
    go('list')
  }

  return (
    <div className="rise">
      <div className="screen-head" style={{ justifyContent: 'space-between' }}>
        <div>
          <h1 className="screen-title">My Fridge</h1>
          <div className="screen-sub">6 items · 2 need attention</div>
        </div>
        <div className="avatar" style={{ background: 'var(--grad-green)' }}>
          <Icon name="fridge" size={22} />
        </div>
      </div>

      <Card className="ai-card" style={{ marginTop: 18, padding: 16 }}>
        <span className="ai-card__icn"><Icon name="spark" size={20} strokeWidth={2.2} /></span>
        <div>
          <div className="ai-card__tag">AI Suggestion</div>
          <div className="ai-card__text">Use tomatoes today to avoid waste. They pair perfectly with your pasta. 🍝</div>
        </div>
      </Card>

      <div className="section-title">Inventory</div>
      <div className="fridge-grid">
        {ITEMS.map((it) => (
          <div className="fridge-card" key={it.name}>
            <div className="fridge-card__top">
              <div className="fridge-card__emoji">{it.emoji}</div>
              <StatusChip status={it.status} dot={false}>{it.chip}</StatusChip>
            </div>
            <div className="fridge-card__name">{it.name}</div>
            <div className="fridge-card__meta">{it.meta}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <PrimaryButton icon="list" onClick={() => setSheet(true)}>
          Generate Shopping List
        </PrimaryButton>
      </div>

      {/* ===== smart generate sheet ===== */}
      {sheet && (
        <div className="sheet" onClick={() => setSheet(false)}>
          <div className="sheet__panel" onClick={(e) => e.stopPropagation()}>
            <div className="sheet__grip" />
            <div className="sheet__head">
              <span className="ai-card__icn"><Icon name="spark" size={20} strokeWidth={2.2} /></span>
              <div>
                <div className="sheet__title">Smart list</div>
                <div className="sheet__sub">Based on your fridge inventory, you should get:</div>
              </div>
            </div>

            <div className="sheet__list">
              {suggestions.map((s) => {
                const on = picked.has(s.name)
                return (
                  <button key={s.name} className="suggest" onClick={() => togglePick(s.name)}>
                    <span className="product__emoji">{s.emoji}</span>
                    <div className="product__body">
                      <div className="product__name">{s.name}</div>
                      <div className="product__meta">{s.meta}</div>
                    </div>
                    <span className={`checkbox ${on ? 'is-checked' : ''}`}>
                      <Icon name="check" size={16} strokeWidth={3} />
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="sheet__label">Add to which day?</div>
            <div className="week-strip week-strip--sheet">
              {week.map((d) => (
                <button
                  key={d.key}
                  className={`week-day ${d.key === day ? 'is-active' : ''} ${d.isToday ? 'is-today' : ''}`}
                  onClick={() => setDay(d.key)}
                >
                  <span className="week-day__name">{d.short}</span>
                  <span className="week-day__date">{d.date}</span>
                </button>
              ))}
            </div>

            <PrimaryButton icon="plus" onClick={confirm} style={{ marginTop: 16 }}>
              Add {picked.size} to {week[day].short}
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  )
}
