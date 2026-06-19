import { useState } from 'react'
import Icon from '../components/Icon'
import QRCode from '../components/QRCode'

const euro = (n) => '€' + n.toFixed(2).replace('.', ',')

export default function Checkout({ items, onClose, toast }) {
  const [paid, setPaid] = useState(false)

  const list = items.map((it) => ({ ...it, price: it.price ?? 1.99 }))
  const subtotal = list.reduce((s, it) => s + it.price, 0)
  const savings = Math.round(subtotal * 0.12 * 100) / 100
  const total = Math.max(0, subtotal - savings)
  const qrValue = `FRIDGELY|${total.toFixed(2)}|${list.length}|${Date.now()}`

  // ===== Paid success state =====
  if (paid) {
    return (
      <div className="checkout checkout--done">
        <div className="co__done">
          <div className="co__done-badge">
            <Icon name="check" size={56} strokeWidth={2.6} />
          </div>
          <h1 className="co__done-title">Paid</h1>
          <div className="co__done-amount">{euro(total)}</div>
          <p className="co__done-sub">{list.length} items · receipt saved to your account</p>
          <button className="co__primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    )
  }

  // ===== Checkout summary =====
  return (
    <div className="checkout">
      <div className="co__head">
        <div className="co__check">
          <Icon name="check" size={30} strokeWidth={2.8} />
        </div>
        <h1 className="co__title">All done!</h1>
        <p className="co__sub">{list.length} items collected on your tour</p>
      </div>

      <div className="co__body">
        <div className="co__section-label">Your basket</div>
        <div className="co__list">
          {list.map((it) => (
            <div className="co__item" key={it.id}>
              <span className="co__item-emoji">{it.emoji}</span>
              <div className="co__item-body">
                <div className="co__item-name">{it.name}</div>
                <div className="co__item-meta">1 × {euro(it.price)}</div>
              </div>
              <div className="co__item-price">{euro(it.price)}</div>
            </div>
          ))}
        </div>

        <div className="co__totals">
          <div className="co__total-row">
            <span>Items</span>
            <span>{euro(subtotal)}</span>
          </div>
          <div className="co__total-row co__total-row--save">
            <span>
              <Icon name="tag" size={15} /> Member savings
            </span>
            <span>−{euro(savings)}</span>
          </div>
          <div className="co__total-row co__total-row--big">
            <span>Total</span>
            <span>{euro(total)}</span>
          </div>
        </div>

        <div className="co__qr-card">
          <QRCode value={qrValue} size={172} />
          <div className="co__qr-text">
            <div className="co__qr-title">Scan at checkout</div>
            <div className="co__qr-note">Show this code to pay everything at once</div>
            <span className="co__qr-demo">DEMO CODE</span>
          </div>
        </div>
      </div>

      <div className="co__foot">
        <button className="co__primary" onClick={() => { setPaid(true); toast?.('Payment successful') }}>
          <Icon name="card" size={20} /> Pay {euro(total)} in app
        </button>
        <button className="co__secondary" onClick={onClose}>
          Not now
        </button>
      </div>
    </div>
  )
}
