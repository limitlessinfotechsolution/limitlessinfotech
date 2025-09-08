interface CurrencyData {
  code: string
  symbol: string
  name: string
  rate: number
}

interface LocationData {
  country: string
  currency: string
}

const currencyRates: Record<string, CurrencyData> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  EUR: { code: "EUR", symbol: "€", name: "Euro", rate: 0.85 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", rate: 0.73 },
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83.12 },
  CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 1.35 },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.52 },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 149.5 },
  CNY: { code: "CNY", symbol: "¥", name: "Chinese Yuan", rate: 7.24 },
  BRL: { code: "BRL", symbol: "R$", name: "Brazilian Real", rate: 4.95 },
  MXN: { code: "MXN", symbol: "$", name: "Mexican Peso", rate: 17.12 },
}

const countryCurrencyMap: Record<string, string> = {
  US: "USD",
  CA: "CAD",
  GB: "GBP",
  IN: "INR",
  AU: "AUD",
  JP: "JPY",
  CN: "CNY",
  BR: "BRL",
  MX: "MXN",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  PT: "EUR",
  IE: "EUR",
  FI: "EUR",
  GR: "EUR",
}

export async function detectUserLocation(): Promise<LocationData | null> {
  try {
    // Try to get location from IP geolocation service
    const response = await fetch("https://ipapi.co/json/")
    const data = await response.json()

    if (data.country_code) {
      return {
        country: data.country_code,
        currency: countryCurrencyMap[data.country_code] || "USD",
      }
    }
  } catch (error) {
    console.error("Failed to detect location:", error)
  }

  // Fallback to browser language/locale
  try {
    const locale = navigator.language || "en-US"
    const countryCode = locale.split("-")[1]?.toUpperCase()

    if (countryCode && countryCurrencyMap[countryCode]) {
      return {
        country: countryCode,
        currency: countryCurrencyMap[countryCode],
      }
    }
  } catch (error) {
    console.error("Failed to get locale:", error)
  }

  return { country: "US", currency: "USD" }
}

export function convertPrice(priceUSD: number, targetCurrency: string): string {
  const currency = currencyRates[targetCurrency] || currencyRates.USD
  const convertedPrice = priceUSD * currency.rate

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(convertedPrice)
}

export function getCurrencyData(currencyCode: string): CurrencyData {
  return currencyRates[currencyCode] || currencyRates.USD
}

export async function updateCurrencyRates(): Promise<void> {
  try {
    // Fetch via our own API route to avoid CORS / network restrictions
    const response = await fetch("/api/currency/latest")
    if (!response.ok) throw new Error(`Status ${response.status}`)

    const data: { rates: Record<string, number> } = await response.json()

    Object.entries(data.rates).forEach(([code, rate]) => {
      if (currencyRates[code]) {
        currencyRates[code].rate = rate
      }
    })
  } catch (error) {
    // Don’t explode – just keep the baked-in fallback rates
    console.warn("Currency-rate update skipped – using fallback rates:", error)
  }
}
