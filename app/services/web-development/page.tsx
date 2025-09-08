import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Code, Layout, Globe, ArrowLeft } from "lucide-react"

export default function WebDevelopmentPage() {
  return (
    <div className="min-h-screen bg-dark-blue-900 text-foreground py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/services"
          className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Services
        </Link>

        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Web Development Services</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Crafting stunning, high-performance websites and web applications tailored to your business needs.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="animate-fade-in-up">
            <Image
              src="/images/web-development-hero.jpg"
              alt="Web Development"
              width={800}
              height={500}
              className="rounded-lg shadow-lg object-cover w-full h-auto"
            />
          </div>
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-3xl font-bold text-foreground">Your Digital Presence, Perfected</h2>
            <p className="text-muted-foreground leading-relaxed">
              In today&apos;s digital age, your website is often the first impression customers have of your business.
              We specialize in creating engaging, responsive, and robust web solutions that not only look great but also
              perform flawlessly, driving your business objectives.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From dynamic e-commerce platforms to intricate web applications, our team leverages cutting-edge
              technologies and best practices to deliver a superior online experience for your users.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">Our Web Development Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="custom-card p-6 animate-fade-in-up">
              <CardHeader className="flex flex-col items-center pb-4">
                <Layout className="w-10 h-10 text-accent-blue mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Custom Website Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Unique, responsive designs that reflect your brand identity and engage your audience.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Code className="w-10 h-10 text-accent-green mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Web Application Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Building complex, interactive web applications for various business needs.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Globe className="w-10 h-10 text-accent-orange mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">E-commerce Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Developing secure and scalable online stores to maximize your sales.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <CheckCircle className="w-10 h-10 text-accent-purple mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">CMS Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Implementing and customizing content management systems like WordPress, Drupal, etc.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Code className="w-10 h-10 text-accent-cyan mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">API Development & Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Building custom APIs and integrating with third-party services for enhanced functionality.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Layout className="w-10 h-10 text-primary mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Website Maintenance & Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Ensuring your website remains secure, up-to-date, and performs optimally.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Web Development Process</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            We follow a collaborative and agile approach to deliver exceptional web solutions.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="custom-card p-6 animate-fade-in-up">
              <CardHeader className="flex flex-col items-center pb-4">
                <span className="text-5xl font-bold text-accent-blue mb-2">1</span>
                <CardTitle className="text-xl font-semibold text-foreground">Discovery & Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Understanding your vision, target audience, and technical requirements.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <span className="text-5xl font-bold text-accent-green mb-2">2</span>
                <CardTitle className="text-xl font-semibold text-foreground">Design & Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Crafting intuitive UI/UX and building robust, scalable code with continuous feedback.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <span className="text-5xl font-bold text-accent-orange mb-2">3</span>
                <CardTitle className="text-xl font-semibold text-foreground">Deployment & Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Seamless launch, performance optimization, and ongoing support to ensure success.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Build Your Dream Website?</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
            Contact us today for a free consultation and let&apos;s bring your digital vision to life.
          </p>
          <Button asChild className="btn-gradient">
            <Link href="/contact">Get a Free Consultation</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
