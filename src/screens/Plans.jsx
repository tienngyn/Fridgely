import { useState } from 'react'
import Icon from '../components/Icon'
import Logo from '../components/Logo'

const PREMIUM_FEATS = [
  'Shelf map with live indoor navigation',
  'Unlimited list & inventory sharing',
  'AI camera for automatic inventory tracking',
  'Unlimited shopping lists & week planning',
  '“Favorites” for recipes',
  'Smart expiry alerts & recipe suggestions',
]
const FREE_FEATS = [
  'Shelf map — no live navigation',
  'One user only',
  'Manual inventory management',
  'One shopping list at a time',
  'No recipe favorites',
  'No smart expiry notifications',
]

export default function Plans({ onContinue, onBack }) {
  const [yearly, setYearly] = useState(false)

  return (
    <div className="plans">
      <div className="plans__top">
        {onBack && (
          <button className="plans__back" onClick={onBack} aria-label="Back">
            <Icon name="chevronLeft" size={20} strokeWidth={2.6} />
          </button>
        )}
        <div className="plans__logo"><Logo size={52} /></div>
        <h1 className="plans__title">Choose your plan</h1>
        <p className="plans__sub">This demo runs with all Premium features unlocked.</p>
      </div>

      <div className="bill-toggle">
        <button className={`bill-opt ${!yearly ? 'is-on' : ''}`} onClick={() => setYearly(false)}>Monthly</button>
        <button className={`bill-opt ${yearly ? 'is-on' : ''}`} onClick={() => setYearly(true)}>
          Yearly <span className="bill-save">−17%</span>
        </button>
      </div>

      {/* Premium */}
      <div className="plan-card plan-card--premium">
        <div className="plan-badge"><Icon name="crown" size={13} /> Most popular</div>
        <div className="plan-name plan-name--pre"><Icon name="crown" size={18} /> Premium</div>
        <div className="plan-price">
          {yearly ? '60,00 €' : '5,99 €'}
          <span>/{yearly ? 'year' : 'month'}</span>
        </div>
        <div className="plan-price-note">{yearly ? '≈ 5,00 €/month · billed yearly' : 'or 60,00 €/year'}</div>
        <div className="plan-feats">
          <div className="plan-feats__lead">Everything in Free, plus:</div>
          {PREMIUM_FEATS.map((f) => (
            <div className="plan-feat" key={f}>
              <span className="plan-feat__icn plan-feat__icn--on"><Icon name="check" size={13} strokeWidth={3} /></span>
              {f}
            </div>
          ))}
        </div>
        <button className="plan-cta plan-cta--pre" onClick={onContinue}>
          Start 7-day free trial
        </button>
      </div>

      {/* Free */}
      <div className="plan-card">
        <div className="plan-name">Free</div>
        <div className="plan-price plan-price--free">0 €</div>
        <div className="plan-price-note">Basic features, forever</div>
        <div className="plan-feats">
          {FREE_FEATS.map((f) => (
            <div className="plan-feat plan-feat--muted" key={f}>
              <span className="plan-feat__icn"><Icon name="check2" size={13} strokeWidth={3} /></span>
              {f}
            </div>
          ))}
        </div>
        <button className="plan-cta plan-cta--free" onClick={onContinue}>
          Continue with Free
        </button>
      </div>

      <p className="plans__note">🔒 Demo only — no real payment is taken.</p>
    </div>
  )
}
