import { useEffect, useRef, useState } from 'react'

import { useCart } from '../cart/CartProvider'

function MiniCart() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, totalQuantity } = useCart()
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node | null
      if (!target) {
        return
      }

      if (containerRef.current?.contains(target)) {
        return
      }

      setIsOpen(false)
    }

    document.addEventListener('mousedown', handleDocumentClick)
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
    }
  }, [isOpen])

  return (
    <div className="mini-cart" ref={containerRef}>
      <button
        type="button"
        className="cart-pill"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={`My Cart (${totalQuantity})`}
        data-testid="mini-cart-toggle"
      >
        My Cart ({totalQuantity})
      </button>

      {isOpen ? (
        <div className="mini-cart-panel" data-testid="mini-cart-panel">
          {items.length === 0 ? (
            <p className="mini-cart-empty">Your cart is empty.</p>
          ) : (
            <ul className="mini-cart-list">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.sizeLabel}`}
                  className="mini-cart-row"
                  data-testid="cart-row"
                >
                  <img src={item.imageURL} alt={item.title} className="mini-cart-thumb" />
                  <div className="mini-cart-details">
                    <p className="mini-cart-title">{item.title}</p>
                    <p className="mini-cart-meta" data-testid="cart-row-qty">
                      {item.quantity}x ${item.price.toFixed(2)}
                    </p>
                    <p className="mini-cart-meta" data-testid={`cart-row-size-${item.sizeLabel}`}>
                      Size: {item.sizeLabel}
                    </p>
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
