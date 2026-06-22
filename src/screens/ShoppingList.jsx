import { useMemo, useState } from 'react'
import Card from '../components/Card'
import ProductItem from '../components/ProductItem'
import PrimaryButton from '../components/PrimaryButton'
import StatusChip from '../components/StatusChip'
import Icon from '../components/Icon'

const CATEGORIES = ['Dairy', 'Fruit', 'Bakery', 'Pantry', 'Meat', 'Other']

// emoji + category guesser for freshly typed items
const DICT = {
  milk: ['🥛', 'Dairy'], yogurt: ['🥣', 'Dairy'], cheese: ['🧀', 'Dairy'], butter: ['🧈', 'Dairy'], eggs: ['🥚', 'Dairy'],
  apple: ['🍎', 'Fruit'], apples: ['🍎', 'Fruit'], banana: ['🍌', 'Fruit'], bananas: ['🍌', 'Fruit'], tomato: ['🍅', 'Fruit'], tomatoes: ['🍅', 'Fruit'], lemon: ['🍋', 'Fruit'],
  bread: ['🍞', 'Bakery'], croissant: ['🥐', 'Bakery'], bagel: ['🥯', 'Bakery'],
  pasta: ['🍝', 'Pantry'], rice: ['🍚', 'Pantry'], coffee: ['☕', 'Pantry'], oil: ['🫒', 'Pantry'], cereal: ['🥣', 'Pantry'],
  chicken: ['🍗', 'Meat'], fish: ['🐟', 'Meat'], beef: ['🥩', 'Meat'],
}
function guess(name) {
  const k = name.trim().toLowerCase()
  const [emoji, category] = DICT[k] || ['🛒', 'Other']
  return { name: name.trim().replace(/^\w/, (c) => c.toUpperCase()), emoji, category }
}

const QUICK = ['Milk', 'Bananas', 'Bread', 'Eggs', 'Coffee', 'Chicken']

export default function ShoppingList({ go, toast, list }) {
  const { week, lists, activeListId, setActiveListId, addList, listDay, setListDay, items, addItems, toggleItem } = list
  const [text, setText] = useState('')
  const [addingList, setAddingList] = useState(false)
  const [newListName, setNewListName] = useState('')

  const dayItems = useMemo(
    () => items.filter((it) => it.listId === activeListId && it.day === listDay),
    [items, activeListId, listDay]
  )
  const doneCount = dayItems.filter((i) => i.done).length

  const add = (raw) => {
    const name = (raw ?? text).trim()
    if (!name) return
    addItems(activeListId, listDay, [guess(name)])
    setText('')
    toast(`${name} added to ${week[listDay].short}`)
  }

  const selectedDay = week[listDay]

  return (
    <div className="rise">
      <div className="screen-head" style={{ justifyContent: 'space-between' }}>
        <div>
          <h1 className="screen-title">Shopping List</h1>
          <div className="screen-sub" style={{ marginTop: 6 }}>
            <span className="pill-label"><Icon name="users" size={14} /> Shared with family</span>
          </div>
        </div>
      </div>

      {/* list switcher (multiple lists) */}
      <div className="list-tabs">
        {lists.map((l) => (
          <button
            key={l.id}
            className={`list-tab ${l.id === activeListId ? 'is-active' : ''}`}
            onClick={() => setActiveListId(l.id)}
          >
            {l.name}
          </button>
        ))}
        {addingList ? (
          <span className="list-tab list-tab--input">
            <input
              autoFocus
              value={newListName}
              placeholder="List name"
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { addList(newListName); setNewListName(''); setAddingList(false); toast('List created') }
                if (e.key === 'Escape') { setNewListName(''); setAddingList(false) }
              }}
            />
          </span>
        ) : (
          <button className="list-tab list-tab--add" onClick={() => setAddingList(true)} aria-label="New list">
            <Icon name="plus" size={16} strokeWidth={2.6} /> New
          </button>
        )}
      </div>

      {/* week strip */}
      <div className="week-strip">
        {week.map((d) => {
          const count = items.filter((it) => it.listId === activeListId && it.day === d.key && !it.done).length
          return (
            <button
              key={d.key}
              className={`week-day ${d.key === listDay ? 'is-active' : ''} ${d.isToday ? 'is-today' : ''}`}
              onClick={() => setListDay(d.key)}
            >
              <span className="week-day__name">{d.short}</span>
              <span className="week-day__date">{d.date}</span>
              {count > 0 && <span className="week-day__dot">{count}</span>}
            </button>
          )
        })}
      </div>

      <div className="day-head">
        <span className="day-head__title">{selectedDay.full}{selectedDay.isToday ? ' · Today' : ''}</span>
        {dayItems.length > 0 && (
          <span className="day-head__meta">{doneCount}/{dayItems.length} done</span>
        )}
      </div>

      {/* items grouped by category */}
      {dayItems.length === 0 ? (
        <Card className="empty-list">
          <div className="empty-list__icn"><Icon name="list" size={26} /></div>
          <div className="empty-list__title">Nothing planned yet</div>
          <div className="empty-list__sub">Add products below to plan {selectedDay.short}.</div>
        </Card>
      ) : (
        CATEGORIES.map((cat) => {
          const catItems = dayItems.filter((i) => i.category === cat)
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
                    done={it.done}
                    checked={it.done}
                    onToggle={() => toggleItem(it.id)}
                  />
                ))}
              </Card>
            </div>
          )
        })
      )}

      {/* add product */}
      <div className="add-row">
        <div className="add-row__field">
          <Icon name="plus" size={18} className="muted" />
          <input
            className="add-row__input"
            placeholder={`Add to ${selectedDay.short}…`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
          />
          {text && (
            <button className="add-row__btn" onClick={() => add()}>Add</button>
          )}
        </div>
        <div className="quick-chips">
          {QUICK.map((q) => (
            <button key={q} className="quick-chip" onClick={() => add(q)}>+ {q}</button>
          ))}
        </div>
      </div>

      {dayItems.length > 0 && (
        <div className="sticky-actions">
          <PrimaryButton variant="blue" icon="route" onClick={() => go('map')}>
            Optimize Route
          </PrimaryButton>
          <PrimaryButton variant="ghost" icon="card" disabled demo>
            Pay with Fridgely
          </PrimaryButton>
        </div>
      )}
    </div>
  )
}
