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
      { name: 'Pasta', emoji: '🍝', category: 'Pantry', have: true, qty: 200, unit: 'g' },
      { name: 'Tomatoes', emoji: '🍅', category: 'Fruit', have: true, qty: 400, unit: 'g' },
      { name: 'Onion', emoji: '🧅', category: 'Fruit', have: true, qty: 1, unit: 'pc' },
      { name: 'Olive oil', emoji: '🫒', category: 'Pantry', have: true, qty: 2, unit: 'tbsp' },
      { name: 'Garlic', emoji: '🧄', category: 'Fruit', have: false, qty: 2, unit: 'cloves' },
      { name: 'Parmesan', emoji: '🧀', category: 'Dairy', have: false, qty: 40, unit: 'g' },
    ],
    steps: [
      'Boil the pasta in salted water for about 9 minutes.',
      'Sauté chopped garlic and onion in olive oil until soft.',
      'Add the chopped tomatoes and simmer for 8 minutes.',
      'Drain the pasta, toss with the sauce and top with parmesan.',
    ],
  },
  {
    id: 'bowl', name: 'Breakfast Bowl', emoji: '🥣', time: '10 min', level: 'Easy',
    img: 'linear-gradient(140deg,#fde68a,#fbbf24)',
    ingredients: [
      { name: 'Yogurt', emoji: '🥣', category: 'Dairy', have: true, qty: 250, unit: 'g' },
      { name: 'Banana', emoji: '🍌', category: 'Fruit', have: true, qty: 1, unit: 'pc' },
      { name: 'Oats', emoji: '🌾', category: 'Pantry', have: true, qty: 40, unit: 'g' },
      { name: 'Honey', emoji: '🍯', category: 'Pantry', have: true, qty: 1, unit: 'tbsp' },
      { name: 'Berries', emoji: '🫐', category: 'Fruit', have: true, qty: 60, unit: 'g' },
    ],
    steps: [
      'Spoon the yogurt into a bowl.',
      'Top with sliced banana, berries and oats.',
      'Drizzle with honey and serve.',
    ],
  },
  {
    id: 'wraps', name: 'Family Wraps', emoji: '🌯', time: '15 min', level: 'Medium',
    img: 'linear-gradient(140deg,#bbf7d0,#34d399)',
    ingredients: [
      { name: 'Tortilla', emoji: '🫓', category: 'Bakery', have: true, qty: 4, unit: 'pc' },
      { name: 'Chicken', emoji: '🍗', category: 'Meat', have: true, qty: 300, unit: 'g' },
      { name: 'Lettuce', emoji: '🥬', category: 'Fruit', have: true, qty: 4, unit: 'leaves' },
      { name: 'Cheese', emoji: '🧀', category: 'Dairy', have: false, qty: 80, unit: 'g' },
      { name: 'Salsa', emoji: '🌶️', category: 'Pantry', have: false, qty: 4, unit: 'tbsp' },
    ],
    steps: [
      'Warm the tortillas in a dry pan.',
      'Fill each with chicken, lettuce and cheese.',
      'Add a spoon of salsa and roll up tightly.',
    ],
  },
  {
    id: 'soup', name: 'Veggie Soup', emoji: '🥕', time: '30 min', level: 'Easy',
    img: 'linear-gradient(140deg,#fed7aa,#fb923c)',
    ingredients: [
      { name: 'Carrots', emoji: '🥕', category: 'Fruit', have: true, qty: 3, unit: 'pc' },
      { name: 'Potato', emoji: '🥔', category: 'Fruit', have: true, qty: 2, unit: 'pc' },
      { name: 'Onion', emoji: '🧅', category: 'Fruit', have: true, qty: 1, unit: 'pc' },
      { name: 'Celery', emoji: '🥬', category: 'Fruit', have: true, qty: 2, unit: 'stalks' },
      { name: 'Broth', emoji: '🍲', category: 'Pantry', have: true, qty: 750, unit: 'ml' },
      { name: 'Garlic', emoji: '🧄', category: 'Fruit', have: true, qty: 2, unit: 'cloves' },
      { name: 'Cream', emoji: '🥛', category: 'Dairy', have: false, qty: 100, unit: 'ml' },
    ],
    steps: [
      'Chop all the vegetables into small pieces.',
      'Sauté the onion and garlic until fragrant.',
      'Add the vegetables and broth, simmer for 20 minutes.',
      'Blend smooth, stir in cream and season to taste.',
    ],
  },
]

const GRADIENTS = [
  'linear-gradient(140deg,#fbbf24 0%,#f97316 60%,#ef4444 100%)',
  'linear-gradient(140deg,#bbf7d0,#34d399)',
  'linear-gradient(140deg,#a5f3fc,#3b82f6)',
  'linear-gradient(140deg,#fbcfe8,#ec4899)',
  'linear-gradient(140deg,#ddd6fe,#8b5cf6)',
  'linear-gradient(140deg,#fed7aa,#fb923c)',
]
const EMOJIS = ['🍽️', '🍝', '🥗', '🍲', '🌮', '🍛', '🥘', '🍜', '🥪', '🍳', '🍰', '🥞']
const LEVELS = ['Easy', 'Medium', 'Hard']
const UNITS = ['g', 'ml', 'pc', 'tbsp', 'tsp', 'cloves', 'leaves', 'stalks']

const missingOf = (r) => r.ingredients.filter((i) => !i.have)
const haveCount = (r) => r.ingredients.filter((i) => i.have).length

const BASE_SERVINGS = 2
function fmtQty(ing, servings) {
  const v = (Number(ing.qty) * servings) / BASE_SERVINGS
  if (ing.unit === 'g' || ing.unit === 'ml') return `${Math.round(v)} ${ing.unit}`
  const r = Math.round(v * 10) / 10
  return `${r} ${ing.unit}`
}

function Heart({ on, onClick, size = 22 }) {
  return (
    <button
      className={`fav-btn ${on ? 'is-on' : ''}`}
      onClick={(e) => { e.stopPropagation(); onClick() }}
      aria-label={on ? 'Remove favorite' : 'Save recipe'}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill={on ? '#ef4444' : 'none'} stroke={on ? '#ef4444' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20.5C10.5 19.2 4 14.6 4 9.8A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 20 9.8c0 4.8-6.5 9.4-8 10.7Z" />
      </svg>
    </button>
  )
}

const blankIngredient = () => ({ name: '', qty: '1', unit: 'pc', have: true })
const blankRecipe = () => ({
  name: '', emoji: EMOJIS[0], img: GRADIENTS[0], time: '20 min', level: 'Easy',
  ingredients: [blankIngredient()], steps: [''],
})

let uid = 1

export default function Recipes({ go, toast, list, favorites, onFav }) {
  const { activeListId, listDay, week, addItems } = list
  const [custom, setCustom] = useState([])
  const [open, setOpen] = useState(null)
  const [tab, setTab] = useState('all')
  const [servings, setServings] = useState(BASE_SERVINGS)
  const [editor, setEditor] = useState(null) // recipe editor form state, or null

  const ALL = [...RECIPES, ...custom]
  const openDetail = (r) => { setServings(BASE_SERVINGS); setOpen(r) }

  const featured = ALL[0]
  const others = ALL.slice(1)
  const saved = ALL.filter((r) => favorites.has(r.id))
  const cookable = ALL.filter((r) => missingOf(r).length === 0)

  const addMissing = (r) => {
    const missing = missingOf(r).map((i) => ({ name: i.name, emoji: i.emoji || '🥡', category: i.category || 'Other' }))
    if (missing.length) addItems(activeListId, listDay, missing)
    setOpen(null)
    toast(`${missing.length} ingredients added to ${week[listDay].short}`)
    go('list')
  }
  const fav = (r) => {
    const wasOn = favorites.has(r.id)
    onFav(r.id)
    toast(wasOn ? 'Removed from favorites' : 'Saved to favorites ❤️')
  }

  // ===== own recipe editor =====
  const openNewRecipe = () => setEditor(blankRecipe())
  const openEditRecipe = (r) => setEditor({ ...r, ingredients: r.ingredients.map((i) => ({ ...i })), steps: [...r.steps] })

  const updateIng = (idx, patch) =>
    setEditor((e) => ({ ...e, ingredients: e.ingredients.map((ing, i) => (i === idx ? { ...ing, ...patch } : ing)) }))
  const addIng = () => setEditor((e) => ({ ...e, ingredients: [...e.ingredients, blankIngredient()] }))
  const removeIng = (idx) => setEditor((e) => ({ ...e, ingredients: e.ingredients.filter((_, i) => i !== idx) }))

  const updateStep = (idx, val) =>
    setEditor((e) => ({ ...e, steps: e.steps.map((s, i) => (i === idx ? val : s)) }))
  const addStep = () => setEditor((e) => ({ ...e, steps: [...e.steps, ''] }))
  const removeStep = (idx) => setEditor((e) => ({ ...e, steps: e.steps.filter((_, i) => i !== idx) }))

  const saveRecipe = () => {
    const name = editor.name.trim()
    if (!name) return
    const ingredients = editor.ingredients
      .filter((i) => i.name.trim())
      .map((i) => ({ name: i.name.trim(), emoji: '🥡', category: 'Other', have: i.have, qty: Number(i.qty) || 1, unit: i.unit }))
    const steps = editor.steps.map((s) => s.trim()).filter(Boolean)
    const isEdit = editor.id && !editor.id.startsWith?.('new')

    if (isEdit) {
      setCustom((prev) => prev.map((r) => (r.id === editor.id ? { ...editor, name, ingredients, steps } : r)))
      toast('Recipe updated')
    } else {
      const id = `mine-${uid++}`
      setCustom((prev) => [...prev, { ...editor, id, name, ingredients, steps, mine: true }])
      toast('Recipe added')
    }
    setEditor(null)
  }
  const deleteRecipe = () => {
    setCustom((prev) => prev.filter((r) => r.id !== editor.id))
    setEditor(null)
    setOpen(null)
    toast('Recipe deleted')
  }

  const Row = ({ r, i }) => {
    const miss = missingOf(r).length
    return (
      <div className="recipe-row" onClick={() => openDetail(r)} style={{ borderTop: i === 0 ? 'none' : '1px solid #f1f4f8', cursor: 'pointer' }}>
        <div className="recipe-row__img" style={{ background: r.img }}>{r.emoji}</div>
        <div style={{ flex: 1 }}>
          <div className="recipe-row__title">{r.name}{r.mine && <span className="mine-tag">Mine</span>}</div>
          <div className="recipe-row__sub">{r.time} · {haveCount(r)} of {r.ingredients.length} ingredients</div>
        </div>
        <Heart on={favorites.has(r.id)} onClick={() => fav(r)} size={20} />
        {miss === 0
          ? <StatusChip status="fresh" dot={false}>Ready</StatusChip>
          : <StatusChip status="low" dot={false}>{miss} missing</StatusChip>}
      </div>
    )
  }

  return (
    <div className="rise">
      <div className="screen-head" style={{ justifyContent: 'space-between' }}>
        <div>
          <h1 className="screen-title">Recipes</h1>
          <div className="screen-sub">Based on what's in your fridge</div>
        </div>
        <button className="head-add" onClick={openNewRecipe} aria-label="Add recipe">
          <Icon name="plus" size={22} strokeWidth={2.5} />
        </button>
      </div>

      {/* filters */}
      <div className="rec-tabs">
        <button className={`rec-tab ${tab === 'all' ? 'is-active' : ''}`} onClick={() => setTab('all')}>All</button>
        <button className={`rec-tab ${tab === 'cook' ? 'is-active' : ''}`} onClick={() => setTab('cook')}>
          <Icon name="check" size={15} strokeWidth={2.6} /> Cook now{cookable.length ? ` (${cookable.length})` : ''}
        </button>
        <button className={`rec-tab ${tab === 'saved' ? 'is-active' : ''}`} onClick={() => setTab('saved')}>
          <Icon name="heart" size={15} /> Saved{saved.length ? ` (${saved.length})` : ''}
        </button>
      </div>

      {tab === 'saved' ? (
        saved.length === 0 ? (
          <Card className="empty-list">
            <div className="empty-list__icn"><Icon name="heart" size={26} /></div>
            <div className="empty-list__title">No saved recipes yet</div>
            <div className="empty-list__sub">Tap the ❤️ on any recipe to save it here.</div>
          </Card>
        ) : (
          <Card flush>{saved.map((r, i) => <Row key={r.id} r={r} i={i} />)}</Card>
        )
      ) : tab === 'cook' ? (
        cookable.length === 0 ? (
          <Card className="empty-list">
            <div className="empty-list__icn"><Icon name="chef" size={26} /></div>
            <div className="empty-list__title">Nothing fully in stock</div>
            <div className="empty-list__sub">Add a few ingredients and they'll show up here.</div>
          </Card>
        ) : (
          <>
            <div className="cook-note"><Icon name="spark" size={15} /> Recipes you can make with what's in your fridge</div>
            <Card flush>{cookable.map((r, i) => <Row key={r.id} r={r} i={i} />)}</Card>
          </>
        )
      ) : (
        <>
          {/* Featured */}
          <div className="recipe-feat">
            <div className="recipe-feat__img" onClick={() => openDetail(featured)} style={{ background: featured.img, cursor: 'pointer' }}>
              {featured.emoji}
              <div className="recipe-feat__badge">
                <StatusChip status="info" dot={false}><Icon name="spark" size={13} /> Recommended</StatusChip>
              </div>
              <div className="recipe-feat__fav"><Heart on={favorites.has(featured.id)} onClick={() => fav(featured)} /></div>
            </div>
            <div className="recipe-feat__body">
              <div className="recipe-feat__title" onClick={() => openDetail(featured)} style={{ cursor: 'pointer' }}>{featured.name}</div>
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
                <PrimaryButton icon="plus" onClick={() => addMissing(featured)}>Add missing ingredients</PrimaryButton>
              </div>
            </div>
          </div>

          <div className="section-title">More for your household</div>
          <Card flush>{others.map((r, i) => <Row key={r.id} r={r} i={i} />)}</Card>

          <button className="add-recipe-cta" onClick={openNewRecipe}>
            <Icon name="plus" size={18} strokeWidth={2.6} /> Add your own recipe
          </button>
        </>
      )}

      <div style={{ height: 4 }} />

      {/* recipe detail sheet */}
      {open && (
        <div className="sheet" onClick={() => setOpen(null)}>
          <div className="sheet__panel" onClick={(e) => e.stopPropagation()}>
            <div className="sheet__grip" />
            <div className="recipe-detail__img" style={{ background: open.img }}>{open.emoji}</div>
            <div className="recipe-detail__head">
              <div className="recipe-detail__title">{open.name}</div>
              <div className="row gap8">
                {open.mine && (
                  <button className="fav-btn" onClick={() => openEditRecipe(open)} aria-label="Edit recipe">
                    <Icon name="settings" size={18} />
                  </button>
                )}
                <Heart on={favorites.has(open.id)} onClick={() => fav(open)} size={26} />
              </div>
            </div>
            <div className="recipe-feat__row" style={{ marginTop: 6 }}>
              <span className="recipe-feat__meta"><Icon name="clock" size={15} /> {open.time}</span>
              <span className="recipe-feat__meta"><Icon name="flame" size={15} /> {open.level}</span>
              <span className="recipe-feat__meta"><Icon name="check" size={15} /> {haveCount(open)}/{open.ingredients.length} in fridge</span>
              {open.mine && <span className="mine-tag">Mine</span>}
            </div>

            <div className="serv">
              <div>
                <div className="serv__title">Servings</div>
                <div className="serv__sub">Amounts scale automatically</div>
              </div>
              <div className="stepper stepper--sm">
                <button className="stepper__btn" onClick={() => setServings((s) => Math.max(1, s - 1))}><Icon name="plus" size={16} style={{ transform: 'rotate(45deg)' }} /></button>
                <div className="stepper__val">{servings}</div>
                <button className="stepper__btn" onClick={() => setServings((s) => Math.min(12, s + 1))}><Icon name="plus" size={16} strokeWidth={2.6} /></button>
              </div>
            </div>

            <div className="sheet__label">Ingredients</div>
            <div className="ingredient-list">
              {open.ingredients.map((ing) => (
                <div className="ingredient" key={ing.name}>
                  <span className="ingredient__emoji">{ing.emoji || '🥡'}</span>
                  <div className="ingredient__main">
                    <span className="ingredient__name">{ing.name}</span>
                    <span className="ingredient__amt">{fmtQty(ing, servings)}</span>
                  </div>
                  {ing.have
                    ? <StatusChip status="fresh" dot={false}>In fridge</StatusChip>
                    : <StatusChip status="low" dot={false}>Missing</StatusChip>}
                </div>
              ))}
            </div>

            {open.steps.length > 0 && (
              <>
                <div className="sheet__label">Preparation</div>
                <div className="steps">
                  {open.steps.map((s, i) => (
                    <div className="step" key={i}>
                      <span className="step__num">{i + 1}</span>
                      <span className="step__text">{s}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

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

      {/* ===== own recipe editor sheet ===== */}
      {editor && (
        <div className="sheet" onClick={() => setEditor(null)}>
          <div className="sheet__panel" onClick={(e) => e.stopPropagation()}>
            <div className="sheet__grip" />
            <div className="sheet__title">{editor.id ? 'Edit recipe' : 'Add your recipe'}</div>

            <div className="sheet__label">Icon</div>
            <div className="emoji-row">
              {EMOJIS.map((e) => (
                <button key={e} className={`emoji-opt ${editor.emoji === e ? 'is-on' : ''}`} onClick={() => setEditor({ ...editor, emoji: e })}>{e}</button>
              ))}
            </div>

            <div className="sheet__label">Cover color</div>
            <div className="gradient-row">
              {GRADIENTS.map((g) => (
                <button key={g} className={`gradient-opt ${editor.img === g ? 'is-on' : ''}`} style={{ background: g }} onClick={() => setEditor({ ...editor, img: g })} />
              ))}
            </div>

            <div className="sheet__label">Name</div>
            <div className="add-row__field" style={{ marginTop: 0 }}>
              <span style={{ fontSize: 20 }}>{editor.emoji}</span>
              <input
                className="add-row__input"
                autoFocus={!editor.id}
                placeholder="e.g. Grandma's Lasagna"
                value={editor.name}
                onChange={(e) => setEditor({ ...editor, name: e.target.value })}
              />
            </div>

            <div className="two-col">
              <div>
                <div className="sheet__label">Time</div>
                <div className="add-row__field" style={{ marginTop: 0 }}>
                  <Icon name="clock" size={17} className="muted" />
                  <input className="add-row__input" placeholder="20 min" value={editor.time} onChange={(e) => setEditor({ ...editor, time: e.target.value })} />
                </div>
              </div>
              <div>
                <div className="sheet__label">Difficulty</div>
                <div className="seg">
                  {LEVELS.map((l) => (
                    <button key={l} className={`seg__opt ${editor.level === l ? 'is-on' : ''}`} onClick={() => setEditor({ ...editor, level: l })}>{l}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="sheet__label">Ingredients</div>
            <div className="editor-ings">
              {editor.ingredients.map((ing, idx) => (
                <div className="editor-ing" key={idx}>
                  <button
                    className={`checkbox ${ing.have ? 'is-checked' : ''}`}
                    onClick={() => updateIng(idx, { have: !ing.have })}
                    aria-label="Have this ingredient"
                    title="I already have this"
                  >
                    <Icon name="check" size={14} strokeWidth={3} />
                  </button>
                  <input
                    className="editor-ing__name"
                    placeholder="Ingredient"
                    value={ing.name}
                    onChange={(e) => updateIng(idx, { name: e.target.value })}
                  />
                  <input
                    className="editor-ing__qty"
                    inputMode="decimal"
                    placeholder="1"
                    value={ing.qty}
                    onChange={(e) => updateIng(idx, { qty: e.target.value })}
                  />
                  <select className="editor-ing__unit" value={ing.unit} onChange={(e) => updateIng(idx, { unit: e.target.value })}>
                    {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <button className="editor-remove" onClick={() => removeIng(idx)} aria-label="Remove ingredient">
                    <Icon name="plus" size={16} style={{ transform: 'rotate(45deg)' }} />
                  </button>
                </div>
              ))}
            </div>
            <button className="editor-addline" onClick={addIng}>
              <Icon name="plus" size={16} strokeWidth={2.6} /> Add ingredient
            </button>

            <div className="sheet__label">Preparation steps</div>
            <div className="editor-steps">
              {editor.steps.map((s, idx) => (
                <div className="editor-step" key={idx}>
                  <span className="step__num">{idx + 1}</span>
                  <input
                    className="editor-step__text"
                    placeholder={`Step ${idx + 1}…`}
                    value={s}
                    onChange={(e) => updateStep(idx, e.target.value)}
                  />
                  <button className="editor-remove" onClick={() => removeStep(idx)} aria-label="Remove step">
                    <Icon name="plus" size={16} style={{ transform: 'rotate(45deg)' }} />
                  </button>
                </div>
              ))}
            </div>
            <button className="editor-addline" onClick={addStep}>
              <Icon name="plus" size={16} strokeWidth={2.6} /> Add step
            </button>

            <PrimaryButton icon="check" onClick={saveRecipe} style={{ marginTop: 18 }}>
              {editor.id ? 'Save changes' : 'Save recipe'}
            </PrimaryButton>
            {editor.id && (
              <button className="sheet__delete" onClick={deleteRecipe}>Delete recipe</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
