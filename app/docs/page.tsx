import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, Lightbulb, Users, FileText, ArrowRight, Shield, Mail } from "lucide-react"

export default function DocsPage() {
  const docCategories = [
    {
      title: "Company Information",
      description: "Learn about Limitless Infotech Solutions, our history, mission, and values.",
      icon: Book,
      links: [
        { href: "/docs/company-history", label: "Company History" },
        { href: "/docs/mission-values", label: "Mission & Values" },
        { href: "/team", label: "Our Team" },
      ],
      color: "text-accent-blue",
    },
    {
      title: "Service Guides",
      description: "Detailed guides and documentation for our various services.",
      icon: FileText,
      links: [
        { href: "/services/web-development", label: "Web Development Guide" },
        { href: "/services/mobile-app-development", label: "Mobile App Guide" },
        { href: "/services/custom-software", label: "Custom Software Guide" },
        { href: "/services/crm-solutions", label: "CRM Solutions Guide" },
      ],
      color: "text-accent-green",
    },
    {
      title: "API Documentation",
      description: "Comprehensive documentation for integrating with our APIs.",
      icon: Lightbulb,
      links: [
        { href: "/api-docs", label: "API Reference" },
        { href: "/api-docs", label: "Getting Started with APIs" },
        { href: "/api-docs", label: "API Use Cases" },
      ],
      color: "text-accent-orange",
    },
    {
      title: "Legal & Policies",
      description: "Our legal terms, privacy policy, and cookie policy.",
      icon: Shield,
      links: [
        { href: "/terms", label: "Terms of Service" },
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/cookies", label: "Cookie Policy" },
      ],
      color: "text-accent-purple",
    },
    {
      title: "CPanel & Hosting",
      description: "Guides for managing your hosting account and cPanel features.",
      icon: Users,
      links: [
        { href: "/cpanel", label: "cPanel Overview" },
        { href: "/cpanel?tab=file-manager", label: "File Management" },
        { href: "/cpanel?tab=database-manager", label: "Database Management" },
        { href: "/cpanel?tab=email-manager", label: "Email Management" },
      ],
      color: "text-accent-cyan",
    },
    {
      title: "Webmail Access",
      description: "Instructions for accessing and using your webmail.",
      icon: Mail,
      links: [
        { href: "/webmail", label: "Access Webmail" },
        { href: "/webmail", label: "Webmail Features" },
        { href: "/webmail", label: "Troubleshooting Webmail" },
      ],
      color: "text-primary",
    },
  ]

  return (
    <div className="min-h-screen bg-dark-blue-900 text-foreground py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Documentation & Guides</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Find comprehensive resources, guides, and policies to help you understand and utilize Limitless Infotech
            Solutions to its fullest potential.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {docCategories.map((category, index) => (
            <Card
              key={category.title}
              className="custom-card h-full flex flex-col animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="flex flex-col items-center text-center pb-4">
                <category.icon className={`w-12 h-12 mb-3 ${category.color}`} />
                <CardTitle className="text-xl font-semibold text-foreground">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="flex items-center text-accent-blue hover:text-accent-blue/80 transition-colors text-sm"
                      >
                        <ArrowRight className="w-4 h-4 mr-2 flex-shrink-0" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Need More Help?</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
            If you can&apos;t find the information you&apos;re looking for, our support team is here to assist you.
          </p>
          <Link href="/contact" className="btn-gradient">
            Contact Support
          </Link>
        </section>
      </div>
    </div>
  )
}
