import { useState } from 'react'

import { useCart } from '../cart/CartProvider'
import MiniCart from '../components/MiniCart'

type Product = {
  id: number
  title: string
  description: string
  price: number
  imageURL: string
  sizeOptions: string[]
}

const product: Product = {
  id: 1,
  title: 'Classic Tee',
  description:
    'A clean, everyday t-shirt made from soft cotton with a relaxed fit for all-day comfort.',
  price: 75.0,
  imageURL:
    '/images/classic-tee.png',
  sizeOptions: ['S', 'M', 'L'],
}

function ProductPage() {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined)
  const [sizeError, setSizeError] = useState('')
  const { addItem } = useCart()

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    if (sizeError) {
      setSizeError('')
    }
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError('Please select a size.')
      return
    }

    addItem(product, selectedSize)
  }

  return (
    <main className="page">
      <header className="top-bar">
        <MiniCart />
      </header>

      <section className="product-layout">
        <div className="image-panel">
          <img src={product.imageURL} alt={product.title} className="product-image" />
        </div>

        <div className="details-panel">
          <h1 className="product-title">{product.title}</h1>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>

          <div className="size-section">
            <span className="size-label">SIZE: {selectedSize ?? '-'}</span>
            <div className="size-row">
              {product.sizeOptions.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`size-button ${selectedSize === size ? 'is-selected' : ''}`}
                  onClick={() => handleSizeSelect(size)}
                  aria-pressed={selectedSize === size}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizeError ? <p className="size-error">{sizeError}</p> : null}
          </div>

          <button type="button" className="add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </section>
    </main>
  )
}

export default ProductPage
