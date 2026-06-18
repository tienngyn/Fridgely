import Icon from './Icon'

export default function ProductItem({
  emoji,
  name,
  meta,
  checked,
  onToggle,
  trailing,
  done = false,
}) {
  return (
    <div className="product">
      {emoji && <div className="product__emoji">{emoji}</div>}
      <div className="product__body">
        <div className={`product__name ${done ? 'is-done' : ''}`}>{name}</div>
        {meta && <div className="product__meta">{meta}</div>}
      </div>
      {trailing}
      {onToggle && (
        <button
          className={`checkbox ${checked ? 'is-checked' : ''}`}
          onClick={onToggle}
          aria-label={checked ? 'Uncheck' : 'Check'}
        >
          <Icon name="check" size={16} strokeWidth={3} />
        </button>
      )}
    </div>
  )
}
