import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Code, Shield, TrendingUp, Users, Lightbulb, Rocket } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-blue-900 text-foreground">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-48 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-graphic.png"
            alt="Hero Background"
            layout="fill"
            objectFit="cover"
            quality={100}
            className="opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-blue-900/80 to-dark-blue-900" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6 animate-fade-in-up">
            Where Innovation Meets Execution.
          </h1>
          <p
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Empowering Businesses with Technology that is Secure, Unique, and Limitless.
          </p>
          <div
            className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Button asChild className="btn-gradient px-8 py-3 text-lg">
              <Link href="/contact">Get a Free Consultation</Link>
            </Button>
            <Button asChild variant="outline" className="btn-outline-primary px-8 py-3 text-lg bg-transparent">
              <Link href="/services">
                Explore Services <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-dark-blue-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <Image
                src="/images/about-image.jpg"
                alt="About Us"
                width={600}
                height={400}
                className="rounded-lg shadow-xl object-cover w-full h-auto"
              />
            </div>
            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                We&apos;re Architects of Transformation.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Limitless Infotech Solutions, we are redefining how businesses build their digital identity.
                We&apos;re not just developers — we&apos;re architects of transformation. From code to concept, every
                solution we deliver is infused with precision, creativity, and futuristic thinking.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We provide cutting-edge Websites, Mobile Apps, Custom Software, Business Systems, and our flagship CRM
                Management & Tracking App — all designed to help businesses scale smartly, efficiently, and securely.
              </p>
              <Button asChild variant="outline" className="btn-outline-primary bg-transparent">
                <Link href="/about">
                  Learn More About Us <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-dark-blue-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 animate-fade-in-up">Our Core Services</h2>
          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            We offer a comprehensive suite of technology services to empower your business.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="custom-card p-6 animate-fade-in-up">
              <CardHeader className="flex flex-col items-center pb-4">
                <Code className="w-12 h-12 text-accent-blue mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Web Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Stunning, responsive websites and powerful web applications.
                </p>
                <Button asChild variant="link" className="text-accent-blue hover:text-accent-blue/80">
                  <Link href="/services/web-development">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Rocket className="w-12 h-12 text-accent-green mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Mobile App Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Intuitive iOS and Android applications for your audience on-the-go.
                </p>
                <Button asChild variant="link" className="text-accent-green hover:text-accent-green/80">
                  <Link href="/services/mobile-app-development">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Lightbulb className="w-12 h-12 text-accent-orange mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Custom Software</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Tailored solutions to automate processes and solve unique challenges.
                </p>
                <Button asChild variant="link" className="text-accent-orange hover:text-accent-orange/80">
                  <Link href="/services/custom-software">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Users className="w-12 h-12 text-accent-purple mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">CRM Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Streamline customer relationships and boost sales efficiency.
                </p>
                <Button asChild variant="link" className="text-accent-purple hover:text-accent-purple/80">
                  <Link href="/services/crm-solutions">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-dark-blue-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 animate-fade-in-up">
            Why Choose Limitless Infotech?
          </h2>
          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            We are committed to delivering excellence and driving real business value.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="custom-card p-6 animate-fade-in-up">
              <CardHeader className="flex flex-col items-center pb-4">
                <Shield className="w-12 h-12 text-accent-blue mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Secure & Reliable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Building robust, secure, and scalable solutions that you can trust.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Lightbulb className="w-12 h-12 text-accent-green mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Innovative Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Leveraging cutting-edge technologies to create future-proof applications.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <TrendingUp className="w-12 h-12 text-accent-orange mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Results-Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Focused on delivering measurable outcomes that contribute to your success.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-dark-blue-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 animate-fade-in-up">
            Ready to Transform Your Business?
          </h2>
          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Partner with Limitless Infotech Solutions and unlock your full digital potential.
          </p>
          <Button
            asChild
            className="btn-gradient px-8 py-3 text-lg animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Link href="/contact">Let&apos;s Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
