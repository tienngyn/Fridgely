// status: fresh | low | expire | info | neutral
const LABELS = {
  fresh: 'Fresh',
  low: 'Low',
  expire: 'Expires soon',
  info: 'Info',
  neutral: 'Good',
}

export default function StatusChip({ status = 'neutral', children, dot = true }) {
  return (
    <span className={`chip chip--${status}`}>
      {dot && <span className="chip__dot" />}
      {children || LABELS[status]}
    </span>
  )
}
