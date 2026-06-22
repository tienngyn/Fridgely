import { useState } from 'react'
import Card from '../components/Card'
import PrimaryButton from '../components/PrimaryButton'
import StatusChip from '../components/StatusChip'
import Icon from '../components/Icon'

const RECIPES = [
  {
    id: 'pasta', name: 'Tomato Pasta', emoji: '🍝', time: '20 min', level: 'Easy',
    img: 'linear-gradient(140deg,#fbbf24 0%,#f97316 60%,#ef4444 100%)', featured: true,
    ingredients: [
      { name: 'Pasta', emoji: '🍝', category: 'Pantry', have: true },
      { name: 'Tomatoes', emoji: '🍅', category: 'Fruit', have: true },
      { name: 'Onion', emoji: '🧅', category: 'Fruit', have: true },
      { name: 'Olive oil', emoji: '🫒', category: 'Pantry', have: true },
      { name: 'Garlic', emoji: '🧄', category: 'Fruit', have: false },
      { name: 'Parmesan', emoji: '🧀', category: 'Dairy', have: false },
    ],
  },
  {
    id: 'bowl', name: 'Breakfast Bowl', emoji: '🥣', time: '10 min', level: 'Easy',
    img: 'linear-gradient(140deg,#fde68a,#fbbf24)',
    ingredients: [
      { name: 'Yogurt', emoji: '🥣', category: 'Dairy', have: true },
      { name: 'Banana', emoji: '🍌', category: 'Fruit', have: true },
      { name: 'Oats', emoji: '🌾', category: 'Pantry', have: true },
      { name: 'Honey', emoji: '🍯', category: 'Pantry', have: true },
      { name: 'Berries', emoji: '🫐', category: 'Fruit', have: true },
    ],
  },
  {
    id: 'wraps', name: 'Family Wraps', emoji: '🌯', time: '15 min', level: 'Medium',
    img: 'linear-gradient(140deg,#bbf7d0,#34d399)',
    ingredients: [
      { name: 'Tortilla', emoji: '🫓', category: 'Bakery', have: true },
      { name: 'Chicken', emoji: '🍗', category: 'Meat', have: true },
      { name: 'Lettuce', emoji: '🥬', category: 'Fruit', have: true },
      { name: 'Cheese', emoji: '🧀', category: 'Dairy', have: false },
      { name: 'Salsa', emoji: '🌶️', category: 'Pantry', have: false },
    ],
  },
  {
    id: 'soup', name: 'Veggie Soup', emoji: '🥕', time: '30 min', level: 'Easy',
    img: 'linear-gradient(140deg,#fed7aa,#fb923c)',
    ingredients: [
      { name: 'Carrots', emoji: '🥕', category: 'Fruit', have: true },
      { name: 'Potato', emoji: '🥔', category: 'Fruit', have: true },
      { name: 'Onion', emoji: '🧅', category: 'Fruit', have: true },
      { name: 'Celery', emoji: '🥬', category: 'Fruit', have: true },
      { name: 'Broth', emoji: '🍲', category: 'Pantry', have: true },
      { name: 'Garlic', emoji: '🧄', category: 'Fruit', have: true },
      { name: 'Cream', emoji: '🥛', category: 'Dairy', have: false },
    ],
  },
]

const missingOf = (r) => r.ingredients.filter((i) => !i.have)
const haveCount = (r) => r.ingredients.filter((i) => i.have).length

export default function Recipes({ go, toast, list }) {
  const { activeListId, listDay, week, addItems } = list
  const [open, setOpen] = useState(null) // recipe detail

  const featured = RECIPES[0]
  const others = RECIPES.slice(1)

  const addMissing = (r) => {
    const missing = missingOf(r).map((i) => ({ name: i.name, emoji: i.emoji, category: i.category }))
    if (missing.length) addItems(activeListId, listDay, missing)
    setOpen(null)
    toast(`${missing.length} ingredients added to ${week[listDay].short}`)
    go('list')
  }

  return (
    <div className="rise">
      <div className="screen-head" style={{ justifyContent: 'space-between' }}>
        <div>
          <h1 className="screen-title">Recipes</h1>
          <div className="screen-sub">Based on what's in your fridge</div>
        </div>
        <div className="avatar" style={{ background: 'linear-gradient(140deg,#fbbf24,#f97316)' }}>
          <Icon name="chef" size={22} />
        </div>
      </div>

      {/* Featured */}
      <div className="recipe-feat" style={{ marginTop: 18 }}>
        <div className="recipe-feat__img" onClick={() => setOpen(featured)} style={{ background: featured.img, cursor: 'pointer' }}>
          {featured.emoji}
          <div className="recipe-feat__badge">
            <StatusChip status="info" dot={false}><Icon name="spark" size={13} /> Recommended</StatusChip>
          </div>
        </div>
        <div className="recipe-feat__body">
          <div className="recipe-feat__title" onClick={() => setOpen(featured)} style={{ cursor: 'pointer' }}>
            {featured.name}
          </div>
          <div className="recipe-feat__row">
            <span className="recipe-feat__meta"><Icon name="clock" size={15} /> Ready in {featured.time}</span>
            <span className="recipe-feat__meta"><Icon name="flame" size={15} /> {featured.level}</span>
          </div>

          <div className="ingredient-bar">
            <div className="ingredient-bar__top">
              <span>You already have {haveCount(featured)} of {featured.ingredients.length} ingredients</span>
              <span style={{ color: 'var(--green-dark)' }}>{Math.round((haveCount(featured) / featured.ingredients.length) * 100)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar__fill" style={{ width: `${(haveCount(featured) / featured.ingredients.length) * 100}%` }} />
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <PrimaryButton icon="plus" onClick={() => addMissing(featured)}>
              Add missing ingredients
            </PrimaryButton>
          </div>
        </div>
      </div>

      <div className="section-title">More for your household</div>
      <Card flush>
        {others.map((r, i) => {
          const miss = missingOf(r).length
          return (
            <div
              className="recipe-row"
              key={r.id}
              onClick={() => setOpen(r)}
              style={{ borderTop: i === 0 ? 'none' : '1px solid #f1f4f8', cursor: 'pointer' }}
            >
              <div className="recipe-row__img" style={{ background: r.img }}>{r.emoji}</div>
              <div style={{ flex: 1 }}>
                <div className="recipe-row__title">{r.name}</div>
                <div className="recipe-row__sub">{r.time} · {haveCount(r)} of {r.ingredients.length} ingredients</div>
              </div>
              {miss === 0 ? (
                <StatusChip status="fresh" dot={false}>Ready</StatusChip>
              ) : (
                <StatusChip status="low" dot={false}>{miss} missing</StatusChip>
              )}
            </div>
          )
        })}
      </Card>

      <div style={{ height: 4 }} />

      {/* ===== recipe detail sheet ===== */}
      {open && (
        <div className="sheet" onClick={() => setOpen(null)}>
          <div className="sheet__panel" onClick={(e) => e.stopPropagation()}>
            <div className="sheet__grip" />
            <div className="recipe-detail__img" style={{ background: open.img }}>{open.emoji}</div>
            <div className="recipe-detail__title">{open.name}</div>
            <div className="recipe-feat__row" style={{ marginTop: 6 }}>
              <span className="recipe-feat__meta"><Icon name="clock" size={15} /> {open.time}</span>
              <span className="recipe-feat__meta"><Icon name="flame" size={15} /> {open.level}</span>
              <span className="recipe-feat__meta"><Icon name="check" size={15} /> {haveCount(open)}/{open.ingredients.length} in fridge</span>
            </div>

            <div className="sheet__label">Ingredients</div>
            <div className="ingredient-list">
              {open.ingredients.map((ing) => (
                <div className="ingredient" key={ing.name}>
                  <span className="ingredient__emoji">{ing.emoji}</span>
                  <span className="ingredient__name">{ing.name}</span>
                  {ing.have ? (
                    <StatusChip status="fresh" dot={false}>In fridge</StatusChip>
                  ) : (
                    <StatusChip status="low" dot={false}>Missing</StatusChip>
                  )}
                </div>
              ))}
            </div>

            {missingOf(open).length > 0 ? (
              <PrimaryButton icon="plus" onClick={() => addMissing(open)} style={{ marginTop: 16 }}>
                Add {missingOf(open).length} missing ingredients
              </PrimaryButton>
            ) : (
              <PrimaryButton variant="soft" onClick={() => setOpen(null)} style={{ marginTop: 16 }}>
                You have everything 🎉
              </PrimaryButton>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
