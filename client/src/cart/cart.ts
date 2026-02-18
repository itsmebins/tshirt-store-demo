import type { CartItem, CartState } from './types'

type CartItemInput = Omit<CartItem, 'quantity'>

const itemKey = (productId: number, sizeLabel: string) => `${productId}::${sizeLabel}`

export function addToCart(state: CartState, itemWithoutQuantity: CartItemInput): CartState {
  const targetKey = itemKey(itemWithoutQuantity.productId, itemWithoutQuantity.sizeLabel)
  const existingIndex = state.items.findIndex(
    (item) => itemKey(item.productId, item.sizeLabel) === targetKey,
  )

  if (existingIndex === -1) {
    return {
      items: [...state.items, { ...itemWithoutQuantity, quantity: 1 }],
    }
  }

  return {
    items: state.items.map((item, index) =>
      index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item,
    ),
  }
}

export function totalQuantity(state: CartState): number {
  return state.items.reduce((sum, item) => sum + item.quantity, 0)
}
