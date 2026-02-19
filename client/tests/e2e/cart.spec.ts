import { expect, test, type Page } from '@playwright/test'

async function waitForProductPage(page: Page) {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Classic Tee' })).toBeVisible()
  await expect(page.getByTestId('size-options')).toBeVisible()
}

async function addSizeToCart(page: Page, size: string) {
  await page.getByTestId(`size-option-${size}`).click()
  await page.getByTestId('add-to-cart').click()
}

test('Add to Cart without size shows error', async ({ page }) => {
  await waitForProductPage(page)

  await page.getByTestId('add-to-cart').click()

  await expect(page.getByTestId('size-error')).toBeVisible()
  await expect(page.getByTestId('size-error')).toHaveText('Please select a size.')
})

test('Adding same size twice increments quantity and only one row exists for that size', async ({
  page,
}) => {
  await waitForProductPage(page)

  await addSizeToCart(page, 'S')
  await addSizeToCart(page, 'S')

  const cartToggle = page.getByTestId('mini-cart-toggle')
  await expect(cartToggle).toContainText('My Cart (2)')

  await cartToggle.click()
  await expect(page.getByTestId('mini-cart-panel')).toBeVisible()

  const sizeRowS = page.getByTestId('cart-row').filter({ has: page.getByTestId('cart-row-size-S') })
  await expect(sizeRowS).toHaveCount(1)
  await expect(sizeRowS.first().getByTestId('cart-row-qty')).toContainText('2x')
})

test('My Cart (N) equals total quantity', async ({ page }) => {
  await waitForProductPage(page)

  await addSizeToCart(page, 'S')
  await addSizeToCart(page, 'L')
  await addSizeToCart(page, 'L')

  const cartToggle = page.getByTestId('mini-cart-toggle')
  await expect(cartToggle).toContainText('My Cart (3)')

  await cartToggle.click()
  await expect(page.getByTestId('mini-cart-panel')).toBeVisible()

  const sizeRowS = page.getByTestId('cart-row').filter({ has: page.getByTestId('cart-row-size-S') })
  const sizeRowL = page.getByTestId('cart-row').filter({ has: page.getByTestId('cart-row-size-L') })

  await expect(sizeRowS).toHaveCount(1)
  await expect(sizeRowL).toHaveCount(1)
  await expect(sizeRowS.first().getByTestId('cart-row-qty')).toContainText('1x')
  await expect(sizeRowL.first().getByTestId('cart-row-qty')).toContainText('2x')
})
