import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'

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

const CART_STORAGE_KEY = 'mr-cart-v1'

const initialCartState: CartState = {
  items: [],
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') {
    return false
  }

  const item = value as Record<string, unknown>

  return (
    typeof item.productId === 'number' &&
    typeof item.title === 'string' &&
    typeof item.price === 'number' &&
    typeof item.imageURL === 'string' &&
    typeof item.sizeLabel === 'string' &&
    typeof item.quantity === 'number'
  )
}

function isCartState(value: unknown): value is CartState {
  if (!value || typeof value !== 'object') {
    return false
  }

  const parsed = value as Record<string, unknown>
  return Array.isArray(parsed.items) && parsed.items.every(isCartItem)
}

function loadInitialCartState(fallbackState: CartState): CartState {
  if (typeof window === 'undefined') {
    return fallbackState
  }

  try {
    const rawState = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!rawState) {
      return fallbackState
    }

    const parsedState = JSON.parse(rawState)
    return isCartState(parsedState) ? parsedState : fallbackState
  } catch {
    // Invalid JSON or inaccessible storage should not break cart initialization.
    return fallbackState
  }
}

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
  const [state, dispatch] = useReducer(cartReducer, initialCartState, loadInitialCartState)

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Swallow storage failures (e.g. quota/private mode) and keep app usable.
    }
  }, [state])

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
