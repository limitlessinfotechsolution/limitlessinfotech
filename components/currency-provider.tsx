"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

interface CurrencyContextType {
  currency: string
  exchangeRates: Record<string, number>
  setCurrency: (currency: string) => void
  convert: (amount: number, fromCurrency: string, toCurrency: string) => number
  formatCurrency: (amount: number, currencyCode?: string) => string
  isLoading: boolean
  error: string | null
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState("USD") // Default currency
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchExchangeRates = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // In a real application, you would fetch from a reliable exchange rate API
        // For this mock, we'll use a simple API route
        const response = await fetch("/api/currency/latest")
        const data = await response.json()

        if (data.success && data.rates) {
          setExchangeRates(data.rates)
          toast({
            title: "Exchange Rates Loaded",
            description: "Latest currency exchange rates fetched successfully.",
            variant: "success",
          })
        } else {
          throw new Error(data.error || "Failed to fetch exchange rates.")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."
        setError(errorMessage)
        toast({
          title: "Error Loading Exchange Rates",
          description: errorMessage,
          variant: "destructive",
        })
        console.error("Failed to fetch exchange rates:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExchangeRates()
  }, [])

  const convert = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      console.warn(`Exchange rates for ${fromCurrency} or ${toCurrency} not available.`)
      return amount // Return original amount if rates are missing
    }

    // Convert to base currency (e.g., USD if all rates are relative to USD)
    // Assuming all rates are relative to USD (e.g., rates.EUR = USD_to_EUR)
    // So, to convert from EUR to USD: amount / rates.EUR
    // To convert from USD to EUR: amount * rates.EUR
    // To convert from EUR to GBP: (amount / rates.EUR) * rates.GBP

    const amountInUSD = amount / exchangeRates[fromCurrency]
    return amountInUSD * exchangeRates[toCurrency]
  }

  const formatCurrency = (amount: number, currencyCode: string = currency): string => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    } catch (e) {
      console.error("Error formatting currency:", e)
      return `${amount.toFixed(2)} ${currencyCode}` // Fallback
    }
  }

  const value = {
    currency,
    exchangeRates,
    setCurrency,
    convert,
    formatCurrency,
    isLoading,
    error,
  }

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
