import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Smartphone, Lightbulb, Users, Shield, Globe, ArrowRight } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      title: "Web Development",
      description: "Crafting stunning, high-performance websites and web applications tailored to your business needs.",
      icon: Code,
      link: "/services/web-development",
      color: "text-accent-blue",
    },
    {
      title: "Mobile App Development",
      description: "Transform your ideas into powerful, intuitive mobile experiences for iOS and Android.",
      icon: Smartphone,
      link: "/services/mobile-app-development",
      color: "text-accent-green",
    },
    {
      title: "Custom Software Development",
      description: "Tailored software solutions designed to meet your unique business challenges and drive innovation.",
      icon: Lightbulb,
      link: "/services/custom-software",
      color: "text-accent-orange",
    },
    {
      title: "CRM Solutions",
      description:
        "Streamline your customer relationships and boost sales with our powerful, custom-built CRM applications.",
      icon: Users,
      link: "/services/crm-solutions",
      color: "text-accent-purple",
    },
    {
      title: "API Development & Integration",
      description: "Building robust APIs and seamlessly integrating third-party services for enhanced functionality.",
      icon: Globe,
      link: "/api-docs",
      color: "text-accent-cyan",
    },
    {
      title: "Cloud & Hosting Solutions",
      description: "Reliable and scalable cloud hosting, cPanel management, and infrastructure support.",
      icon: Shield,
      link: "/cpanel",
      color: "text-primary",
    },
  ]

  return (
    <div className="min-h-screen bg-dark-blue-900 text-foreground py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Our Services</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            At Limitless Infotech Solutions, we offer a comprehensive suite of technology services designed to empower
            your business and drive digital transformation.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Link
              key={service.title}
              href={service.link}
              className="group block animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className="custom-card h-full flex flex-col transition-all duration-300 group-hover:shadow-glow-md group-hover:scale-[1.02]">
                <CardHeader className="flex flex-col items-center text-center pb-4">
                  <service.icon className={`w-12 h-12 mb-3 ${service.color}`} />
                  <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                  <Button asChild variant="link" className={`${service.color} hover:${service.color}/80`}>
                    <Link href={service.link}>
                      Learn More <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Can&apos;t Find What You&apos;re Looking For?</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
            Our expertise extends beyond these core services. Contact us to discuss your unique project needs.
          </p>
          <Button asChild className="btn-gradient">
            <Link href="/contact">Get a Custom Solution</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
