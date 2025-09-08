"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/team", label: "Team" },
    { href: "/careers", label: "Careers" },
    { href: "/api-docs", label: "API Docs" },
    { href: "/cpanel", label: "cPanel" },
    { href: "/webmail", label: "Webmail" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="bg-dark-blue-900 text-foreground py-4 border-b border-dark-blue-700 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <Image src="/images/logo.png" alt="Limitless Infotech Solutions" width={40} height={40} />
          <span className="text-2xl font-bold text-foreground hidden md:block">Limitless Infotech</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-primary transition-colors text-base font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions & Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          <Button asChild className="btn-gradient hidden md:inline-flex">
            <Link href="/contact">Get a Quote</Link>
          </Button>
          <ThemeToggle />

          {/* Mobile Menu Toggle */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted/20">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-dark-blue-800 border-dark-blue-700 text-foreground w-full sm:w-80 p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center space-x-3" onClick={() => setIsOpen(false)}>
                  <Image src="/images/logo.png" alt="Limitless Infotech Solutions" width={32} height={32} />
                  <span className="text-xl font-bold text-foreground">Limitless Infotech</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-foreground hover:bg-muted/20"
                >
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button asChild className="btn-gradient mt-4">
                  <Link href="/contact" onClick={() => setIsOpen(false)}>
                    Get a Quote
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
