import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'

import { addToCart, totalQuantity as getTotalQuantity } from './cart'
import type { CartItem, CartState } from './types'

type AddItemProduct = {
  id: number
  title: string
  price: number
  imageURL: string
}

type CartContextValue = {
  items: CartItem[]
  addItem: (product: AddItemProduct, sizeLabel: string) => void
  totalQuantity: number
}

type AddItemAction = {
  type: 'add_item'
  payload: {
    product: AddItemProduct
    sizeLabel: string
  }
}

type CartAction = AddItemAction

const initialCartState: CartState = {
  items: [],
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  if (action.type === 'add_item') {
    const { product, sizeLabel } = action.payload
    return addToCart(state, {
      productId: product.id,
      title: product.title,
      price: product.price,
      imageURL: product.imageURL,
      sizeLabel,
    })
  }

  return state
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState)

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      addItem: (product, sizeLabel) => {
        dispatch({
          type: 'add_item',
          payload: { product, sizeLabel },
        })
      },
      totalQuantity: getTotalQuantity(state),
    }),
    [state],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}
