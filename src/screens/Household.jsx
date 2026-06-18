import { useState } from 'react'
import Card from '../components/Card'
import StatusChip from '../components/StatusChip'
import Icon from '../components/Icon'

const MEMBERS = [
  { name: 'Alex', role: 'Owner', initials: 'A', bg: 'linear-gradient(140deg,#34d399,#10b981)' },
  { name: 'Mia', role: 'Member', initials: 'M', bg: 'linear-gradient(140deg,#60a5fa,#3b82f6)' },
  { name: 'Tom', role: 'Member', initials: 'T', bg: 'linear-gradient(140deg,#fbbf24,#f97316)' },
]

const NOTIFICATIONS = [
  { id: 'expire', icon: 'clock', color: '#dc2626', bg: '#fee2e2', title: 'Expiring food reminders', sub: 'Get alerts before food goes bad' },
  { id: 'stock', icon: 'cart', color: '#b45309', bg: '#fef3c7', title: 'Low stock reminders', sub: 'Know when staples run low' },
  { id: 'meal', icon: 'recipes', color: '#1d4ed8', bg: '#dbeafe', title: 'Weekly meal planning', sub: 'Sunday recipe suggestions' },
]

export default function Household({ go, toast }) {
  const [toggles, setToggles] = useState({ expire: true, stock: true, meal: false })
  const flip = (id) => setToggles((t) => ({ ...t, [id]: !t[id] }))

  return (
    <div className="rise">
      <div className="screen-head">
        <button className="screen-head__back" onClick={() => go('home')}>
          <Icon name="chevronLeft" size={20} strokeWidth={2.4} />
        </button>
        <h1 className="screen-title">Household</h1>
      </div>

      <Card style={{ marginTop: 16 }}>
        <div className="profile-hero">
          <div className="profile-hero__av">MM</div>
          <div style={{ flex: 1 }}>
            <div className="profile-hero__name">Mustermann Family</div>
            <div className="profile-hero__sub">3 members · 1 shared list</div>
          </div>
          <StatusChip status="fresh" dot={false}>Premium</StatusChip>
        </div>
      </Card>

      <div className="section-title">Family Members</div>
      <Card>
        <div className="member-strip">
          {MEMBERS.map((m) => (
            <div className="member" key={m.name}>
              <div className="member__avatar" style={{ background: m.bg }}>{m.initials}</div>
              <div className="member__name">{m.name}</div>
              <div className="member__role">{m.role}</div>
            </div>
          ))}
          <div className="member member--add" onClick={() => toast('Invite sent (demo)')} style={{ cursor: 'pointer' }}>
            <div className="member__avatar"><Icon name="plus" size={24} strokeWidth={2.4} /></div>
            <div className="member__name">Invite</div>
            <div className="member__role">&nbsp;</div>
          </div>
        </div>
      </Card>

      <div className="section-title">Shared shopping list</div>
      <Card tap onClick={() => go('list')}>
        <div className="setting-row" style={{ padding: '4px' }}>
          <div className="setting-row__icn" style={{ background: 'var(--mint)', color: '#047857' }}>
            <Icon name="list" size={21} />
          </div>
          <div className="setting-row__body">
            <div className="setting-row__title">Family List</div>
            <div className="setting-row__sub">12 items · synced with all members</div>
          </div>
          <Icon name="chevron" size={18} className="muted" />
        </div>
      </Card>

      <div className="section-title">Notifications</div>
      <Card>
        {NOTIFICATIONS.map((n) => (
          <div className="setting-row" key={n.id}>
            <div className="setting-row__icn" style={{ background: n.bg, color: n.color }}>
              <Icon name={n.icon} size={20} />
            </div>
            <div className="setting-row__body">
              <div className="setting-row__title">{n.title}</div>
              <div className="setting-row__sub">{n.sub}</div>
            </div>
            <button
              className={`toggle ${toggles[n.id] ? 'is-on' : ''}`}
              onClick={() => flip(n.id)}
              aria-label={`Toggle ${n.title}`}
            >
              <span className="toggle__knob" />
            </button>
          </div>
        ))}
      </Card>

      <div style={{ height: 4 }} />
    </div>
  )
}
