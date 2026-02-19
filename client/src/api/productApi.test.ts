import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchProduct } from './productApi'

describe('fetchProduct', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('maps mixed size option keys into display labels', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        id: 1,
        title: 'Classic Tee',
        description: 'desc',
        price: 75,
        imageURL: '/images/classic-tee.jpg',
        sizeOptions: [{ label: 'S' }, { long: 'M' }, { value: 'XL' }, { id: 42 }],
      }),
    } as Response)

    vi.stubGlobal('fetch', fetchMock)

    const product = await fetchProduct(1)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const calledUrl = fetchMock.mock.calls[0]?.[0]
    expect(String(calledUrl)).toMatch(/\/product\/1$/)
    expect(product.sizeOptions).toEqual(['S', 'M', 'XL', '42'])
  })

  it('throws on non-ok responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: 'not_found' }),
      } as Response),
    )

    await expect(fetchProduct(999)).rejects.toThrow('Failed to fetch product (404)')
  })
})
