# Cashly

A small transaction dashboard built with [Next.js](https://nextjs.org) (App Router). It shows an account summary and its recent transactions, with filters, sorting and a details panel. Data is mocked, and sign-in uses a single demo account.

## Run locally

Requires Node.js 20 or newer and [pnpm](https://pnpm.io).

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Create your environment file**

   ```bash
   cp .env.template .env        # Windows: copy .env.template .env
   ```

3. **Set `SESSION_SECRET` in `.env`** to a long random value. Generate one with:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

   If you leave it empty, a development-only value is used. That's fine for local demos, but not for anything shared.

4. **Start the development server**

   ```bash
   pnpm dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** and sign in with the demo account. You'll be sent to the sign-in page first.

**Demo account:** the email and password are in [`mocks/mockUsers.ts`](mocks/mockUsers.ts). The sign-in page also shows them.

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `SESSION_SECRET` | No (recommended) | Signs the session cookie. Falls back to a development-only value when empty. |

See [`.env.template`](.env.template) for the full list.

### Run a production build locally

To check the app the way it will run in UAT and production:

```bash
pnpm build
pnpm start
```

Then open [http://localhost:3000](http://localhost:3000). This build sets session cookies to `secure`. Browsers still accept those on `localhost`, but if you open the app from another device over plain HTTP (for example by IP address), sign-in won't stick. Use `pnpm dev` for day-to-day work on your machine.

### Troubleshooting

| Problem | Fix |
| --- | --- |
| `pnpm: command not found` | Run `corepack enable`, or install pnpm with `npm install -g pnpm`. |
| Port 3000 is already in use | Run `pnpm dev -p 3001` (or `pnpm start -p 3001`) and open that port instead. |
| Sign-in doesn't stick when opening the app from another device | Session cookies are `secure` in the production build, so use HTTPS, or test on `localhost`. |
| Fonts look like the system default | The app loads Geist from Google Fonts, so it needs an internet connection. |
| Changes to `.env` have no effect | Restart `pnpm dev` or `pnpm start`. Environment files are read only at startup. |

## Routes

| Route | Description | Access |
| --- | --- | --- |
| `/login` | Sign-in form | Public. Signed-in users are redirected to `/`. |
| `/` | Account summary, filters and transaction list | Signed in |
| `/profile` | User details and account information, with a copy button for the account ID | Signed in |
| `/api/account` | Returns the signed-in user's account and transactions | Signed in (401 otherwise) |

Access is enforced in [`proxy.ts`](proxy.ts). Signed-out visitors are redirected to `/login`. Sign-out is in the header.

## Testing the states

The dashboard reads its data from `/api/account`. Two query parameters on the dashboard URL let you reach the non-default states:

| URL | What you should see |
| --- | --- |
| `/` | Normal data. |
| `/?scenario=empty` | The account has no transactions. The filters are hidden and the "No transactions yet" panel appears. |
| `/?scenario=error` | The request fails. The "We couldn't load your transactions" panel appears, with a **Try again** button. |

The API takes about 700 ms to respond, so the loading skeleton appears briefly on every visit.

## Dashboard behaviour

**Account summary:** account name, current balance and currency.

**Filters:**
- Merchant search, matching part of the merchant name, case-insensitive.
- Status: completed, pending or declined.
- Type: credits or debits.
- Sort: date (newest or oldest first) or amount (highest or lowest first).
- **Clear filters** resets everything.
- When filters match nothing, the "No transactions match your filters" panel appears, with a button to clear them.

**Transaction list:**
- Each row shows the merchant, description, date, status and amount.
- Credits are green with a `+` sign, and debits show a `-` sign.
- Declined amounts are struck through.
- Transactions in a foreign currency also show the equivalent in the account currency, marked with `≈`.
- Long merchant names and descriptions are truncated in the list.
- Clicking a row opens the details panel.

**Details panel:**
- Shows the full description, the reference, the type, and the currency.
- Pending transactions show a note that the amount may change.
- Declined transactions show a note that they don't affect the balance.
- Close with the × button, the Escape key, or a click outside the panel.

## Profile

Shows the signed-in user's name, email, and account name, ID and currency. The **Copy** button next to the account ID copies it to the clipboard.

## Project layout

```
app/
  (dashboard)/    Pages that need sign-in and show the header
  login/          Sign-in page
  actions/        Server actions for sign-in and sign-out
  api/account/   Account and transactions endpoint
  globals.css     Base styles and component classes
  tokens.css      Design tokens (colours, type scale, spacing, radii)
components/       UI components
hooks/            useAccount: loads and tracks the account data
lib/              Types, formatting, filtering and sorting, session
mocks/            Mock account, transactions and demo user
proxy.ts          Sign-in protection for pages and the API
```

Styling is plain CSS, with no framework. To change the look, start with `app/tokens.css`.

## Logging (planned)

We plan to send structured application logs to [Datadog](https://www.datadoghq.com) so that sign-in, API and error events can be searched and monitored in UAT and production.

This is **not implemented yet**. It needs a Datadog account with an API key, which hasn't been set up. Once it has been, the key will go in `.env` as `DD_API_KEY`, and the app will need a small logging module to send events.

## Money and dates

Amounts are stored as whole minor units (cents for USD, whole yen for JPY) and formatted with `Intl`, so there are no floating-point rounding errors. Dates are formatted for `en-US`.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Build for production |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run the unit tests with Vitest |

## Tests

Each component lives in its own folder under `components/`, with its unit test beside it, for example `components/copyButton/copyButton.test.tsx`. Tests use Vitest, jsdom and React Testing Library. Run them with `pnpm test`.
