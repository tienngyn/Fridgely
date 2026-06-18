import Icon from './Icon'

const TABS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'list', label: 'List', icon: 'list' },
  { id: 'map', label: 'Map', icon: 'map' },
  { id: 'fridge', label: 'Fridge', icon: 'fridge' },
  { id: 'recipes', label: 'Recipes', icon: 'recipes' },
]

export default function BottomNav({ active, onNavigate }) {
  return (
    <nav className="bottomnav">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`bottomnav__item ${active === t.id ? 'is-active' : ''}`}
          onClick={() => onNavigate(t.id)}
        >
          <span className="bottomnav__icon">
            <Icon name={t.icon} size={23} strokeWidth={active === t.id ? 2.2 : 1.9} />
          </span>
          {t.label}
        </button>
      ))}
    </nav>
  )
}
