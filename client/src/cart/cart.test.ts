import { describe, expect, it } from 'vitest'

import { addToCart, totalQuantity } from './cart'
import type { CartState } from './types'

describe('cart domain logic', () => {
  it('adding same product+size twice yields single row quantity=2', () => {
    const initialState: CartState = { items: [] }

    const item = {
      productId: 1,
      title: 'Classic Tee',
      price: 75,
      imageURL: '/images/classic-tee.png',
      sizeLabel: 'M',
    }

    const stateAfterFirstAdd = addToCart(initialState, item)
    const stateAfterSecondAdd = addToCart(stateAfterFirstAdd, item)

    expect(stateAfterSecondAdd.items).toHaveLength(1)
    expect(stateAfterSecondAdd.items[0]?.quantity).toBe(2)
  })

  it('adding different sizes yields 2 rows', () => {
    const initialState: CartState = { items: [] }

    const medium = {
      productId: 1,
      title: 'Classic Tee',
      price: 75,
      imageURL: '/images/classic-tee.png',
      sizeLabel: 'M',
    }

    const large = {
      ...medium,
      sizeLabel: 'L',
    }

    const state = addToCart(addToCart(initialState, medium), large)

    expect(state.items).toHaveLength(2)
    expect(state.items.map((item) => item.sizeLabel).sort()).toEqual(['L', 'M'])
  })

  it('totalQuantity sums quantities', () => {
    const state: CartState = {
      items: [
        {
          productId: 1,
          title: 'Classic Tee',
          price: 75,
          imageURL: '/images/classic-tee.png',
          sizeLabel: 'S',
          quantity: 2,
        },
        {
          productId: 1,
          title: 'Classic Tee',
          price: 75,
          imageURL: '/images/classic-tee.png',
          sizeLabel: 'M',
          quantity: 3,
        },
      ],
    }

    expect(totalQuantity(state)).toBe(5)
  })
})
