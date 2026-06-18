import Card from '../components/Card'
import PrimaryButton from '../components/PrimaryButton'
import StatusChip from '../components/StatusChip'
import Icon from '../components/Icon'

const OTHERS = [
  { emoji: '🥣', name: 'Breakfast Bowl', meta: '10 min · 5 of 5 ingredients', bg: 'linear-gradient(140deg,#fde68a,#fbbf24)', ready: true },
  { emoji: '🌯', name: 'Family Wraps', meta: '15 min · 3 of 5 ingredients', bg: 'linear-gradient(140deg,#bbf7d0,#34d399)', ready: false },
  { emoji: '🥕', name: 'Veggie Soup', meta: '30 min · 6 of 7 ingredients', bg: 'linear-gradient(140deg,#fed7aa,#fb923c)', ready: false },
]

export default function Recipes({ go, toast }) {
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
        <div className="recipe-feat__img">
          🍝
          <div className="recipe-feat__badge">
            <StatusChip status="info" dot={false}>
              <Icon name="spark" size={13} /> Recommended
            </StatusChip>
          </div>
        </div>
        <div className="recipe-feat__body">
          <div className="recipe-feat__title">Tomato Pasta</div>
          <div className="recipe-feat__row">
            <span className="recipe-feat__meta"><Icon name="clock" size={15} /> Ready in 20 min</span>
            <span className="recipe-feat__meta"><Icon name="flame" size={15} /> Easy</span>
          </div>

          <div className="ingredient-bar">
            <div className="ingredient-bar__top">
              <span>You already have 4 of 6 ingredients</span>
              <span style={{ color: 'var(--green-dark)' }}>67%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar__fill" style={{ width: '67%' }} />
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <PrimaryButton icon="plus" onClick={() => { toast('2 ingredients added to list'); go('list') }}>
              Add missing ingredients
            </PrimaryButton>
          </div>
        </div>
      </div>

      <div className="section-title">More for your household</div>
      <Card flush>
        {OTHERS.map((r) => (
          <div className="recipe-row" key={r.name} style={{ borderTop: r === OTHERS[0] ? 'none' : '1px solid #f1f4f8' }}>
            <div className="recipe-row__img" style={{ background: r.bg }}>{r.emoji}</div>
            <div style={{ flex: 1 }}>
              <div className="recipe-row__title">{r.name}</div>
              <div className="recipe-row__sub">{r.meta}</div>
            </div>
            {r.ready ? (
              <StatusChip status="fresh" dot={false}>Ready</StatusChip>
            ) : (
              <StatusChip status="low" dot={false}>Missing</StatusChip>
            )}
          </div>
        ))}
      </Card>

      <div style={{ height: 4 }} />
    </div>
  )
}
