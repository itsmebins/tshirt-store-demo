export type Product = {
  id: number
  title: string
  description: string
  price: number
  imageURL: string
  sizeOptions: string[]
}

type ProductApiResponse = {
  id: unknown
  title: unknown
  description: unknown
  price: unknown
  imageURL: unknown
  sizeOptions: unknown
}

const DEFAULT_API_BASE_URL = 'http://localhost:5000'

function getApiBaseUrl(): string {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL
  const baseUrl = configuredBaseUrl ? configuredBaseUrl : DEFAULT_API_BASE_URL
  return baseUrl.replace(/\/+$/, '')
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  return value as Record<string, unknown>
}

function normalizeSizeLabel(option: unknown): string {
  if (!option || typeof option !== 'object' || Array.isArray(option)) {
    return String(option)
  }

  const sizeOption = option as Record<string, unknown>
  const sizeLabel =
    sizeOption.label ?? sizeOption.long ?? sizeOption.value ?? String(sizeOption.id)

  return String(sizeLabel)
}

function parseProduct(payload: unknown): Product {
  const parsed = asRecord(payload) as ProductApiResponse | null

  if (!parsed) {
    throw new Error('Invalid product payload')
  }

  if (
    typeof parsed.id !== 'number' ||
    typeof parsed.title !== 'string' ||
    typeof parsed.description !== 'string' ||
    typeof parsed.price !== 'number' ||
    typeof parsed.imageURL !== 'string' ||
    !Array.isArray(parsed.sizeOptions)
  ) {
    throw new Error('Invalid product payload')
  }

  return {
    id: parsed.id,
    title: parsed.title,
    description: parsed.description,
    price: parsed.price,
    imageURL: parsed.imageURL,
    sizeOptions: parsed.sizeOptions.map((option) => normalizeSizeLabel(option)),
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
