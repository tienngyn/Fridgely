import Card from '../components/Card'
import PrimaryButton from '../components/PrimaryButton'
import StatusChip from '../components/StatusChip'
import Icon from '../components/Icon'

const ITEMS = [
  { emoji: '🥛', name: 'Milk', meta: '2 days left', status: 'expire', chip: 'Expires soon' },
  { emoji: '🥚', name: 'Eggs', meta: '6 left', status: 'fresh', chip: 'Fresh' },
  { emoji: '🍅', name: 'Tomatoes', meta: 'expires soon', status: 'expire', chip: 'Expires soon' },
  { emoji: '🥣', name: 'Yogurt', meta: 'running low', status: 'low', chip: 'Low' },
  { emoji: '🧀', name: 'Cheese', meta: 'good', status: 'fresh', chip: 'Fresh' },
  { emoji: '🧈', name: 'Butter', meta: '1 week left', status: 'fresh', chip: 'Fresh' },
]

export default function Fridge({ go, toast }) {
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
        <span className="ai-card__icn">
          <Icon name="spark" size={20} strokeWidth={2.2} />
        </span>
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
        <PrimaryButton icon="list" onClick={() => { toast('Shopping list generated'); go('list') }}>
          Generate Shopping List
        </PrimaryButton>
      </div>
    </div>
  )
}
