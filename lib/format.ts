const LOCALE = 'en-US'

const dateFormatter = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium' })
const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

/** Number of minor-unit digits for a currency: 2 for USD, 0 for JPY. */
export const getCurrencyDigits = (currency: string): number => {
  return (
    new Intl.NumberFormat(LOCALE, { style: 'currency', currency }).resolvedOptions()
      .maximumFractionDigits ?? 2
  )
}

/**
 * Formats an integer amount in minor units, e.g. 428150 USD -> "$4,281.50".
 * Pass `showSign` to prefix positive amounts with "+" (negative amounts always show "-").
 */
export const formatMoney = (
  value: number,
  currency: string,
  { showSign = false }: { showSign?: boolean } = {},
): string => {
  const amount = value / 10 ** getCurrencyDigits(currency)

  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency,
    signDisplay: showSign ? 'exceptZero' : 'auto',
  }).format(amount)
}

export const formatDate = (iso: string): string => {
  return dateFormatter.format(new Date(iso))
}

export const formatDateTime = (iso: string): string => {
  return dateTimeFormatter.format(new Date(iso))
}
