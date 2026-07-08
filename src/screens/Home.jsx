import { useState } from 'react'
import Card from '../components/Card'
import StatusChip from '../components/StatusChip'
import Icon from '../components/Icon'

const FRIDGE_PREVIEW = [
  { emoji: '🥛', name: 'Milk', status: 'low', label: 'Running low' },
  { emoji: '🥚', name: 'Eggs', status: 'fresh', label: 'Fresh' },
  { emoji: '🍅', name: 'Tomatoes', status: 'expire', label: 'Expires soon' },
  { emoji: '🥣', name: 'Yogurt', status: 'low', label: 'Running low' },
]

// items about to go bad → drives the expiry warning
const EXPIRING = [
  { emoji: '🍅', name: 'Tomatoes', when: 'today' },
  { emoji: '🥛', name: 'Milk', when: 'in 2 days' },
]

export default function Home({ go, toast }) {
  const [warned, setWarned] = useState(true)

  return (
    <div className="rise">
      <div className="home-greet">
        <div>
          <div className="home-greet__hi">Welcome back,</div>
          <div className="home-greet__name">Max Mustermann 👋</div>
        </div>
        <div className="avatar" onClick={() => go('household')} style={{ cursor: 'pointer' }}>MM</div>
      </div>

      {/* Expiry warning */}
      {warned && EXPIRING.length > 0 && (
        <div className="expiry" onClick={() => go('fridge')}>
          <span className="expiry__icn"><Icon name="clock" size={20} strokeWidth={2.3} /></span>
          <div className="expiry__body">
            <div className="expiry__title">
              {EXPIRING.length} items expire soon
              <span className="expiry__emojis">{EXPIRING.map((e) => e.emoji).join(' ')}</span>
            </div>
            <div className="expiry__sub">Use your {EXPIRING[0].name.toLowerCase()} {EXPIRING[0].when} to avoid waste</div>
          </div>
          <button
            className="expiry__close"
            onClick={(e) => { e.stopPropagation(); setWarned(false) }}
            aria-label="Dismiss"
          >
            <Icon name="plus" size={16} style={{ transform: 'rotate(45deg)' }} />
          </button>
        </div>
      )}

      {/* Today's Shopping hero */}
      <div className="hero-card">
        <div className="hero-card__ring" style={{ width: 150, height: 150, top: -50, right: -40 }} />
        <div className="hero-card__ring" style={{ width: 90, height: 90, bottom: -30, right: 50 }} />
        <div className="hero-card__label">
          <Icon name="cart" size={16} /> Today's Shopping
        </div>
        <div className="hero-card__count">
          12 <span>items on the list</span>
        </div>
        <button className="hero-card__btn" onClick={() => go('list')}>
          <Icon name="cart" size={18} /> Start Shopping
        </button>
      </div>

      {/* Fridge Overview */}
      <Card style={{ marginTop: 16 }}>
        <div className="card-head">
          <div className="card-head__title">Fridge Overview</div>
          <button className="card-head__link" onClick={() => go('fridge')}>
            See all <Icon name="chevron" size={14} strokeWidth={2.6} />
          </button>
        </div>
        <div className="mini-row" style={{ marginTop: 12 }}>
          {FRIDGE_PREVIEW.map((f) => (
            <div className="mini-fridge" key={f.name}>
              <div className="mini-fridge__emoji">{f.emoji}</div>
              <div className="mini-fridge__name">{f.name}</div>
              <div className="mini-fridge__chip">
                <StatusChip status={f.status} dot={false}>{f.label}</StatusChip>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Suggested Recipe */}
      <Card style={{ marginTop: 16 }} tap onClick={() => go('recipes')}>
        <div className="card-head" style={{ marginBottom: 12 }}>
          <div className="card-head__title">Suggested Recipe</div>
          <StatusChip status="info" dot={false}>AI pick</StatusChip>
        </div>
        <div className="recipe-hero">
          <div className="recipe-hero__img">🍝</div>
          <div>
            <div className="recipe-hero__title">Pasta with Tomatoes</div>
            <div className="recipe-hero__sub">Uses ingredients already in your fridge</div>
            <div style={{ marginTop: 8 }}>
              <StatusChip status="fresh" dot={false}>
                <Icon name="clock" size={13} /> Ready in 20 min
              </StatusChip>
            </div>
          </div>
        </div>
      </Card>

      <div style={{ height: 4 }} />
    </div>
  )
}
