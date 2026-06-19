import Logo from '../components/Logo'
import Icon from '../components/Icon'

export default function Onboarding({ onStart }) {
  return (
    <div className="onb">
      {/* soft decorative shapes */}
      <div className="onb__blob" style={{ top: -40, right: -50, width: 180, height: 180, background: 'rgba(255,255,255,0.18)' }} />
      <div className="onb__blob" style={{ bottom: 120, left: -60, width: 200, height: 200, background: 'rgba(255,255,255,0.12)' }} />

      <div className="onb__deco" style={{ top: 90, left: 30, '--r': '-12deg', fontSize: 30 }}>🍎</div>
      <div className="onb__deco" style={{ top: 140, right: 34, '--r': '14deg', fontSize: 26, animationDelay: '0.6s' }}>🥦</div>
      <div className="onb__deco" style={{ top: 64, right: 70, '--r': '8deg', fontSize: 22, animationDelay: '1.1s' }}>🥕</div>
      <div className="onb__deco" style={{ top: 200, left: 56, '--r': '-6deg', fontSize: 22, animationDelay: '1.6s' }}>🍋</div>

      <div className="onb__logo">
        <Logo size={104} />
      </div>
      <div className="onb__brand">
        <span className="brand-word">Fridgely</span>
      </div>
      <p className="onb__slogan">Your smart way from store to fridge</p>
      <p className="onb__text">Plan smarter, shop faster, and waste less food.</p>

      <div className="onb__spacer" />

      <div className="onb__features">
        <div className="onb__feature">
          <span className="onb__feature-icn"><Icon name="list" size={22} /></span>
          Smart lists
        </div>
        <div className="onb__feature">
          <span className="onb__feature-icn"><Icon name="map" size={22} /></span>
          Store routes
        </div>
        <div className="onb__feature">
          <span className="onb__feature-icn"><Icon name="leaf" size={22} /></span>
          Less waste
        </div>
      </div>

      <button className="onb__btn" onClick={onStart}>
        Get Started
        <Icon name="chevron" size={20} strokeWidth={2.4} />
      </button>

      <div className="onb__dots">
        <span className="onb__dot is-on" />
        <span className="onb__dot" />
        <span className="onb__dot" />
      </div>
    </div>
  )
}
