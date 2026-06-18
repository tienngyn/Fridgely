export default function Card({ children, className = '', tap = false, flush = false, style, onClick }) {
  const cls = ['card', flush && 'card--flush', tap && 'card--tap', className].filter(Boolean).join(' ')
  return (
    <div className={cls} style={style} onClick={onClick}>
      {children}
    </div>
  )
}
