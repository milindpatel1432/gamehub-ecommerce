# 🧪 GameHub Playwright End-to-End (E2E) Testing Guide

Welcome to the **GameHub** End-to-End testing suite documentation. This guide details how to run, write, and debug automated Playwright tests for the GameHub gaming e-commerce platform.

---

## 📐 Test Suite Architecture & Directory Layout

The testing suite is structured using the **Page Object Model (POM)** pattern for scalable, maintainable E2E testing:

```
tests/
├── accessibility/
│   └── accessibility.spec.ts    # Semantic HTML, form label & accessibility checks
├── admin/
│   └── admin.spec.ts            # Admin dashboard, product CRUD, category management
├── auth/
│   └── auth.spec.ts             # User registration, login, logout, protected routes
├── cart/
│   └── cart.spec.ts             # Cart addition, quantity updates, promo coupons
├── checkout/
│   └── checkout.spec.ts         # Checkout stepper, shipping forms & order creation
├── fixtures/
│   ├── mock-data.ts             # Shared test credentials, shipping data & coupons
│   └── page-objects/            # Page Object Model abstractions
│       ├── AdminPage.ts
│       ├── AuthPage.ts
│       ├── CartPage.ts
│       ├── CheckoutPage.ts
│       └── ShopPage.ts
├── home/
│   └── home.spec.ts             # Homepage loading, hero section & category carousels
├── orders/
│   └── orders.spec.ts           # Order history, order status tracking & detail views
├── products/
│   └── products.spec.ts         # Product catalog, search debounce, filters & details
├── profile/
│   └── profile.spec.ts          # User profile view, edit mode & settings toggles
├── responsive/
│   └── responsive.spec.ts       # Viewport testing (Desktop, Tablet & Mobile devices)
└── wishlist/
    └── wishlist.spec.ts         # Wishlist toggles & persistence
```

---

## 🚀 Getting Started & Installation

Ensure all project dependencies and Playwright browsers are installed:

```bash
# Install node dependencies
npm install

# Install Playwright browser binaries
npx playwright install
```

---

## 🏃 Running Tests

### 1. Run All E2E Tests (Headless)
Runs all test suites across configured browsers:
```bash
npx playwright test
```

### 2. Run a Single Test File
To run a specific test spec:
```bash
# Run Auth spec
npx playwright test tests/auth/auth.spec.ts

# Run Products spec
npx playwright test tests/products/products.spec.ts

# Run Admin spec
npx playwright test tests/admin/admin.spec.ts
```

### 3. Run Tests in Headed Mode (Visible Browser)
To view browser interactions visually while running tests:
```bash
npx playwright test --headed
```

### 4. Interactive UI Mode
Playwright UI Mode allows you to step through tests interactively with live DOM previews:
```bash
npx playwright test --ui
```

### 5. Filter Tests by Keyword / Project
```bash
# Run only Chromium project tests
npx playwright test --project=chromium

# Run tests matching a specific title keyword
npx playwright test -g "User Login"
```

---

## 📊 Viewing Test Reports & Artifacts

### HTML Report Viewer
After test execution, launch the interactive HTML report:
```bash
npx playwright show-report
```

The report includes:
* Detailed step timing for every test assertion.
* **Screenshots on Failure**: Captures the state of the app at the moment of failure.
* **Video Recordings**: Playback of the user session leading up to any failure.
* **Trace Viewer**: Step-by-step DOM snapshots and network log history.

### Debugging Failures with Trace Viewer
If a test fails, inspect the generated `.zip` trace file in `test-results/`:
```bash
npx playwright show-trace test-results/<failed-test-folder>/trace.zip
```

---

## 🔒 Test Credentials & Environment Configuration

The suite utilizes pre-configured test credentials defined in `tests/fixtures/mock-data.ts`:

* **Super Admin User:** `admin@gamehub.com` / `milind@2803`
* **Regular Demo User:** `testuser@gamehub.com` / `Password123!`
* **Base URL:** `http://localhost:5173` (configured in `playwright.config.ts`)

---

## 🤝 Best Practices Observed

1. **No Hardcoded Sleep Waits**: Replaced fixed timers with auto-waiting locators and explicit Playwright assertions.
2. **Page Object Model**: Abstracted UI locators and actions into reusable POM classes under `tests/fixtures/page-objects/`.
3. **Resilient Locators**: Used user-facing locators (`getByRole`, text selectors, ID attributes) for maximum test stability.
4. **Mocked Payment Flows**: Razorpay modal triggers are handled deterministically without making live payment transactions.
