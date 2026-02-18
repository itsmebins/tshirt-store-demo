export type CartItem = {
  productId: number
  title: string
  price: number
  imageURL: string
  sizeLabel: string
  quantity: number
}

export type CartState = {
  items: CartItem[]
}
