import Icon from './Icon'

export default function PrimaryButton({
  children,
  variant = 'green',
  size,
  icon,
  iconRight,
  disabled = false,
  demo = false,
  onClick,
  className = '',
  style,
}) {
  const cls = [
    'btn',
    variant === 'blue' && 'btn--blue',
    variant === 'brand' && 'btn--brand',
    variant === 'ghost' && 'btn--ghost',
    variant === 'soft' && 'btn--soft',
    size === 'sm' && 'btn--sm',
    disabled && 'btn--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={cls} onClick={disabled ? undefined : onClick} disabled={disabled} style={style}>
      {icon && <Icon name={icon} size={size === 'sm' ? 17 : 19} />}
      {children}
      {demo && <span className="btn__demo-tag">DEMO</span>}
      {iconRight && <Icon name={iconRight} size={size === 'sm' ? 17 : 19} />}
    </button>
  )
}
