import Icon from './Icon'

export default function StatusBar({ theme = 'dark' }) {
  return (
    <div className={`statusbar is-${theme}`}>
      <span>9:41</span>
      <div className="statusbar__icons">
        <Icon name="wifi" size={16} strokeWidth={2.2} />
        {/* battery */}
        <svg width="26" height="14" viewBox="0 0 26 14" aria-hidden="true">
          <rect x="0.5" y="0.5" width="21" height="13" rx="3.5" fill="none" stroke="currentColor" opacity="0.5" />
          <rect x="2.5" y="2.5" width="16" height="9" rx="2" fill="currentColor" />
          <rect x="23" y="4.5" width="2.5" height="5" rx="1.25" fill="currentColor" opacity="0.6" />
        </svg>
      </div>
    </div>
  )
}
