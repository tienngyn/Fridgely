import { useState } from 'react'
import Card from '../components/Card'
import ProductItem from '../components/ProductItem'
import PrimaryButton from '../components/PrimaryButton'
import StatusChip from '../components/StatusChip'
import Icon from '../components/Icon'

const ITEMS = [
  { id: 'milk', emoji: '🥛', name: 'Milk', meta: '1 L · Bio', category: 'Dairy', done: false },
  { id: 'yogurt', emoji: '🥣', name: 'Yogurt', meta: '4 × 150 g', category: 'Dairy', done: false },
  { id: 'cheese', emoji: '🧀', name: 'Cheese', meta: 'Gouda, 250 g', category: 'Dairy', done: true },
  { id: 'apples', emoji: '🍎', name: 'Apples', meta: '6 pcs', category: 'Fruit', done: false },
  { id: 'tomatoes', emoji: '🍅', name: 'Tomatoes', meta: '500 g', category: 'Fruit', done: false },
  { id: 'bread', emoji: '🍞', name: 'Bread', meta: 'Wholegrain', category: 'Bakery', done: true },
  { id: 'pasta', emoji: '🍝', name: 'Pasta', meta: 'Penne, 500 g', category: 'Pantry', done: false },
]

const CATEGORIES = ['Dairy', 'Fruit', 'Bakery', 'Pantry']

export default function ShoppingList({ go, toast }) {
  const [items, setItems] = useState(ITEMS)
  const toggle = (id) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it)))

  const doneCount = items.filter((i) => i.done).length
  const pct = Math.round((doneCount / items.length) * 100)

  return (
    <div className="rise">
      <div className="screen-head" style={{ justifyContent: 'space-between' }}>
        <div>
          <h1 className="screen-title">Shopping List</h1>
          <div className="screen-sub" style={{ marginTop: 6 }}>
            <span className="pill-label">
              <Icon name="users" size={14} /> Family List
            </span>
          </div>
        </div>
      </div>

      <div className="list-progress" style={{ marginTop: 18 }}>
        <div className="row between">
          <span style={{ fontSize: 14, fontWeight: 700 }}>
            {doneCount} of {items.length} collected
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--green-dark)' }}>{pct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {CATEGORIES.map((cat) => {
        const catItems = items.filter((i) => i.category === cat)
        if (!catItems.length) return null
        return (
          <div key={cat}>
            <div className="cat-head">
              <span className="cat-head__name">{cat}</span>
              <span className="cat-head__line" />
              <StatusChip status="neutral" dot={false}>{catItems.length}</StatusChip>
            </div>
            <Card flush>
              {catItems.map((it) => (
                <ProductItem
                  key={it.id}
                  emoji={it.emoji}
                  name={it.name}
                  meta={it.meta}
                  done={it.done}
                  checked={it.done}
                  onToggle={() => toggle(it.id)}
                />
              ))}
            </Card>
          </div>
        )
      })}

      <div className="sticky-actions">
        <PrimaryButton variant="blue" icon="route" onClick={() => go('map')}>
          Optimize Route
        </PrimaryButton>
        <PrimaryButton
          variant="ghost"
          icon="card"
          disabled
          demo
          onClick={() => toast('Payment is disabled in this demo')}
        >
          Pay with Fridgely
        </PrimaryButton>
      </div>
    </div>
  )
}
