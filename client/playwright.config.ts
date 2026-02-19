import { defineConfig } from '@playwright/test'

const clientPort = process.env.E2E_CLIENT_PORT ?? '5173'
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${clientPort}`
const e2eApiBaseURL = process.env.E2E_API_BASE_URL ?? 'http://localhost:5000'
const shouldStartClientFromPlaywright = process.env.E2E_MANAGED_CLIENT === '1'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: shouldStartClientFromPlaywright
    ? {
        command: `npm run dev -- --host 0.0.0.0 --port ${clientPort}`,
        cwd: __dirname,
        url: baseURL,
        timeout: 120_000,
        reuseExistingServer: !process.env.CI,
        env: {
          ...process.env,
          VITE_API_BASE_URL: e2eApiBaseURL,
        },
      }
    : undefined,
})
