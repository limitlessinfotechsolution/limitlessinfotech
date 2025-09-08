import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CurrencyProvider } from "@/components/currency-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Limitless Infotech Solution Pvt. Ltd. | Where Innovation Meets Execution",
  description:
    "Empowering businesses with technology that is secure, unique, and limitless. Web development, mobile apps, custom software, and CRM solutions.",
  keywords:
    "web development, mobile app development, custom software, CRM solutions, IT services, technology consulting, digital transformation",
  openGraph: {
    title: "Limitless Infotech Solution Pvt. Ltd.",
    description: "Empowering businesses with technology that is secure, unique, and limitless.",
    url: "https://limitlessinfotech.com",
    siteName: "Limitless Infotech",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Limitless Infotech Solution",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <CurrencyProvider>
            <div className="flex min-h-screen flex-col bg-background">
              {" "}
              {/* Apply background here */}
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
