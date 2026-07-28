import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry configuration: 2 on CI, 1 in local development for stability */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI if needed */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. Includes both HTML reporter and list logger */
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  /* Shared settings for all projects */
  use: {
    /* Base URL for page navigation actions */
    baseURL: 'http://localhost:5173',

    /* Capture screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record video on test failure */
    video: 'retain-on-failure',

    /* Collect trace files on failure */
    trace: 'retain-on-failure',

    /* Action & Navigation Timeouts */
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  /* Configure test execution projects */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Run local dev server automatically if not running */
  webServer: [
    {
      command: 'npm --prefix backend start',
      url: 'http://127.0.0.1:5000/api/v1',
      reuseExistingServer: true,
      timeout: 120 * 1000,
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 120 * 1000,
    },
  ],
});
