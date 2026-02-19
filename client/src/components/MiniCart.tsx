import { useState } from 'react'

import { useCart } from '../cart/CartProvider'

function MiniCart() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, totalQuantity } = useCart()

  return (
    <div className="mini-cart">
      <button
        type="button"
        className="cart-pill"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={`My Cart (${totalQuantity})`}
      >
        My Cart ({totalQuantity})
      </button>

      {isOpen ? (
        <div className="mini-cart-panel">
          {items.length === 0 ? (
            <p className="mini-cart-empty">Your cart is empty.</p>
          ) : (
            <ul className="mini-cart-list">
              {items.map((item) => (
                <li key={`${item.productId}-${item.sizeLabel}`} className="mini-cart-row">
                  <img src={item.imageURL} alt={item.title} className="mini-cart-thumb" />
                  <div className="mini-cart-details">
                    <p className="mini-cart-title">{item.title}</p>
                    <p className="mini-cart-meta">
                      {item.quantity}x ${item.price.toFixed(2)}
                    </p>
                    <p className="mini-cart-meta">Size: {item.sizeLabel}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default MiniCart
