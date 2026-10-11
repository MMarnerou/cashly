# Cashly

A small transaction dashboard built with [Next.js](https://nextjs.org) (App Router). It shows an account summary and its recent transactions, with filters, sorting and a details panel. Data is mocked, and sign-in uses a single demo account.

## Run locally

Requires Node.js 20 or newer and [pnpm](https://pnpm.io). No environment variables are needed.

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start the development server**

   ```bash
   pnpm dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000)**. You'll be sent to the sign-in page first. Sign in with the demo account below.

**Demo account:** `mmarnerou@test.com` / `TestMe999!`. The details are also in [`mocks/mockUsers.ts`](mocks/mockUsers.ts) and shown on the sign-in page.

### Run a production build locally

To check the app the way it runs in production:

```bash
pnpm build
pnpm start
```

Then open [http://localhost:3000](http://localhost:3000). The production build sets session cookies to `secure`. Browsers still accept those on `localhost`, but over plain HTTP from another device (for example by IP address) sign-in won't stick. Use `pnpm dev` for day-to-day work.

### Troubleshooting

| Problem | Fix |
| --- | --- |
| `pnpm: command not found` | Run `corepack enable`, or install pnpm with `npm install -g pnpm`. |
| Port 3000 is already in use | Run `pnpm dev -p 3001` (or `pnpm start -p 3001`) and open that port instead. |
| Sign-in doesn't stick when opening the app from another device | Session cookies are `secure` in the production build, so use HTTPS, or test on `localhost`. |
| Fonts look like the system default | The app loads Geist from Google Fonts, so it needs an internet connection. |

## Scenarios to try

### Signing in and out

| Scenario | Steps | What you should see |
| --- | --- | --- |
| Signed-out visitor opens the app | Go to `/` | Redirected to `/login`. |
| Empty sign-in | Click **Sign in** with both fields empty | "Enter your email address." and "Enter your password." appear under the fields. Nothing is sent to the server. |
| Invalid email | Type `not-an-email` in the email field, fill in a password, click **Sign in** | "Enter a valid email address." appears under the email field. |
| Wrong password | Use the demo email with any other password | "Invalid email or password." appears above the button. |
| Password visibility | Click the eye button in the password field | The password is shown as text. Click again to hide it. The button label changes to match. |
| Successful sign-in | Use the demo account | Redirected to the dashboard. |
| Signed-in user opens `/login` | Go to `/login` while signed in | Redirected to `/`. |
| Sign out | Click **Sign out** in the header, or the sign-out icon on a phone | Returned to `/login`. |
| Expired or tampered session | Edit the `session` cookie, or wait 7 days | Treated as signed out. |

### Dashboard

| Scenario | How to reach it | What you should see |
| --- | --- | --- |
| Normal data | `/` | Account summary, filters and the transaction list. |
| Loading | Any visit to `/` | A loading skeleton for about 700 ms. |
| No transactions | `/?scenario=empty` | The filters are hidden and the "No transactions yet" panel appears. |
| Account can't be loaded | Open `/error` directly, or if the account request fails for any reason | The "We couldn't load your transactions" page, with a **Try again** link back to `/`. |
| No filter matches | Search for a merchant that doesn't exist | The "No transactions match your filters" panel, with a button to clear the filters. |

### Filters and list

- **Merchant search:** matches part of the merchant name, case-insensitive.
- **Status:** completed, pending or declined.
- **Type:** credits or debits.
- **Sort:** date (newest or oldest first) or amount (highest or lowest first).
- **Clear filters** resets everything.
- Credits are green with a `+` sign, and debits show a `-` sign.
- Declined amounts are struck through.
- Transactions in a foreign currency also show the equivalent in the account currency, marked with `≈`.

### Details panel

- Click a transaction to open the panel. It shows the full description, reference, type and currency.
- Pending transactions show a note that the amount may change.
- Declined transactions show a note that they don't affect the balance.
- Close it with the × button, the Escape key, or a click outside the panel.
- The **Copy** button next to the reference copies it to the clipboard and shows "Copied" for two seconds. If the browser blocks clipboard access, it shows "Copy failed".

### Profile

- `/profile` shows the signed-in user's name, email, and account name, ID and currency.
- The **Copy** button next to the account ID works the same way as in the details panel.

### Phone layout

Below 768 px wide, the text links in the header are replaced by icon buttons along the bottom of the screen. The filters are more compact, and the page has no horizontal scrolling.

## Routes

| Route | Description | Access |
| --- | --- | --- |
| `/login` | Sign-in form | Public. Signed-in users are redirected to `/`. |
| `/` | Account summary, filters and transaction list | Signed in |
| `/profile` | User details and account information | Signed in |
| `/error` | Shown when the account can't be loaded | Signed in |
| `/api/account` | Returns the signed-in user's account and transactions. Accepts `?scenario=empty`. | Signed in (401 otherwise) |
| `/icon.svg` | Tab icon | Public |

Access is enforced in [`proxy.ts`](proxy.ts). Signed-out visitors are redirected to `/login`. API requests without a session get a 401.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server on port 3000 |
| `pnpm build` | Build for production |
| `pnpm start` | Serve the production build on port 3000 |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run the unit tests with Vitest |
| `pnpm test:coverage` | Run the unit tests and report coverage. The run fails below 80% on any metric. |
| `pnpm test:e2e` | Run the end-to-end tests with Playwright (see below) |

## Tests

### Unit tests

Tests use Vitest, jsdom and React Testing Library. Component tests sit beside each component, for example `components/copyButton/copyButton.test.tsx`. Tests for the app pages, API route, sign-in actions and the rest of the code are in `tests/`.

```bash
pnpm test
pnpm test:coverage
```

Current coverage is about 96% of statements, 92% of branches, 93% of functions and 97% of lines.

### End-to-end tests

The Playwright tests in `e2e/` run against the production build on port 3100. The configuration in [`playwright.config.ts`](playwright.config.ts) builds and starts the app for you. The tests use the installed Google Chrome, so Chrome needs to be installed.

```bash
pnpm test:e2e
```

They cover signing in and out, the dashboard filters, sorting and details panel, the profile page, and the phone bottom bar.

## Project layout

```
app/
  (dashboard)/    Pages that need sign-in and show the header
    error/        Error page for failed account loads
    profile/      Profile page
  login/          Sign-in page
  actions/        Server actions for sign-in and sign-out
  api/account/    Account and transactions endpoint
  globals.css     Base styles and shared primitives (buttons, fields, cards)
  tokens.css      Design tokens (colours, type scale, spacing, radii)
assets/icons/     Icon SVGs, imported as React components
components/       UI components. Each has its own folder, component, tests and CSS.
e2e/              Playwright end-to-end tests
hooks/            useAccount: loads the account data
lib/              Types, formatting, filtering and sorting, session, shared helpers
mocks/            Mock account, transactions and demo user
public/           Static files served as-is (the tab icon)
tests/            Unit tests for app pages, routes, actions and lib
proxy.ts          Sign-in protection for pages and the API
```

Styling is plain CSS, with no framework. Shared styles are in `app/globals.css`, and each component's own styles are in its folder. To change the look, start with `app/tokens.css`.

## Technical notes

- **Sessions:** a signed JWT (HS256, via [`jose`](https://github.com/panva/jose)) in an `httpOnly` cookie that lasts 7 days.
- **Forms:** the sign-in form uses [Formik](https://formik.org) and [Yup](https://github.com/jquense/yup) for field checks. The server action checks the credentials again.
- **Icons:** SVG files are imported as React components through `@svgr/webpack`, and they use `currentColor`, so they take the colour of their container.
- **Money and dates:** amounts are stored as whole minor units (cents for USD, whole yen for JPY) and formatted with `Intl`, so there are no floating-point rounding errors. Dates are formatted for `en-US`.

### Known limitations

- **The session secret is hardcoded** in [`lib/session.ts`](lib/session.ts) as `development-only-secret`. Anyone who can read the code can forge a session. Move it to an environment variable before deploying anywhere shared.
- **Data is mocked.** Accounts and transactions come from [`mocks/`](mocks), and sign-in accepts only the demo account.

## Logging (planned)

The ideal scenario is to send structured application logs to [Datadog] or any other logging platform is available so that sign-in, API and error events can be searched and monitored in UAT and production.

This is **not implemented yet**. It needs a Datadog account with an API key, which hasn't been set up. Once it has been, the key will go in `.env` as `DD_API_KEY`, and the app will need a small logging module to send events.
