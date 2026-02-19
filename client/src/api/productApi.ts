export type Product = {
  id: number
  title: string
  description: string
  price: number
  imageURL: string
  sizeOptions: string[]
}

export type ProductApiSizeOption = {
  label?: string
  long?: string
  value?: string
  id?: string | number
}

export type ProductApiResponse = {
  id: number
  title: string
  description: string
  price: number
  imageURL: string
  sizeOptions: ProductApiSizeOption[]
}

const DEFAULT_API_BASE_URL = 'http://localhost:5000'

function getApiBaseUrl(): string {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL
  const baseUrl = configuredBaseUrl ? configuredBaseUrl : DEFAULT_API_BASE_URL
  return baseUrl.replace(/\/+$/, '')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === 'string'
}

function isSizeOption(value: unknown): value is ProductApiSizeOption {
  if (!isRecord(value)) {
    return false
  }

  return (
    isOptionalString(value.label) &&
    isOptionalString(value.long) &&
    isOptionalString(value.value) &&
    (value.id === undefined || typeof value.id === 'string' || typeof value.id === 'number')
  )
}

function isProductApiResponse(payload: unknown): payload is ProductApiResponse {
  if (!isRecord(payload)) {
    return false
  }

  return (
    typeof payload.id === 'number' &&
    typeof payload.title === 'string' &&
    typeof payload.description === 'string' &&
    typeof payload.price === 'number' &&
    typeof payload.imageURL === 'string' &&
    Array.isArray(payload.sizeOptions) &&
    payload.sizeOptions.every(isSizeOption)
  )
}

function normalizeSizeLabel(sizeOption: ProductApiSizeOption): string {
  const sizeLabel =
    sizeOption.label ?? sizeOption.long ?? sizeOption.value ?? String(sizeOption.id)

  return String(sizeLabel)
}

function parseProduct(payload: unknown): Product {
  if (!isProductApiResponse(payload)) {
    throw new Error('Invalid product payload')
  }

  return {
    id: payload.id,
    title: payload.title,
    description: payload.description,
    price: payload.price,
    imageURL: payload.imageURL,
    sizeOptions: payload.sizeOptions.map((option) => normalizeSizeLabel(option)),
  }
}

export async function fetchProduct(id: number): Promise<Product> {
  const response = await fetch(`${getApiBaseUrl()}/product/${id}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch product (${response.status})`)
  }

  const payload = await response.json()
  return parseProduct(payload)
}
