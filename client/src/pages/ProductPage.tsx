import { useEffect, useState } from 'react'

import { fetchProduct, type Product } from '../api/productApi'
import { useCart } from '../cart/CartProvider'
import MiniCart from '../components/MiniCart'

const PRODUCT_ID = 1

function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined)
  const [sizeError, setSizeError] = useState('')
  const { addItem } = useCart()

  const loadProduct = async () => {
    setIsLoading(true)
    setLoadError('')

    try {
      const loadedProduct = await fetchProduct(PRODUCT_ID)
      setProduct(loadedProduct)
      setSelectedSize(undefined)
      setSizeError('')
    } catch {
      setProduct(null)
      setLoadError('Unable to load product. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadProduct()
  }, [])

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    if (sizeError) {
      setSizeError('')
    }
  }

  const handleAddToCart = () => {
    if (!product) {
      return
    }

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

      {isLoading ? (
        <section className="status-panel">
          <p className="status-message">Loading product...</p>
        </section>
      ) : null}

      {!isLoading && loadError ? (
        <section className="status-panel">
          <p className="status-message status-message-error">{loadError}</p>
          <button type="button" className="retry-button" onClick={() => void loadProduct()}>
            Retry
          </button>
        </section>
      ) : null}

      {!isLoading && !loadError && product ? (
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
      ) : null}
    </main>
  )
}

export default ProductPage
