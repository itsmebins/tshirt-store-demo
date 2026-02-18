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
  return (
    <main className="page">
      <header className="top-bar">
        <div className="cart-pill">My Cart (0)</div>
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
            <span className="size-label">Size</span>
            <div className="size-row">
              {product.sizeOptions.map((size) => (
                <button key={size} type="button" className="size-button">
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button type="button" className="add-to-cart-button">
            Add to Cart
          </button>
        </div>
      </section>
    </main>
  )
}

export default ProductPage
