import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Lightbulb, Handshake, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark-blue-900 text-foreground py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            About Limitless Infotech Solutions
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Where Innovation Meets Execution. Empowering Businesses with Technology that is Secure, Unique, and
            Limitless.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="animate-fade-in-up">
            <Image
              src="/images/about-image.jpg"
              alt="Our Team Working"
              width={800}
              height={500}
              className="rounded-lg shadow-lg object-cover w-full h-auto"
            />
          </div>
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-3xl font-bold text-foreground">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              At Limitless Infotech Solutions, we are redefining how businesses build their digital identity. Founded
              with a vision to bridge the gap between complex technological needs and accessible, innovative solutions,
              we&apos;ve grown into a trusted partner for businesses worldwide.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We&apos;re not just developers — we&apos;re architects of transformation. From code to concept, every
              solution we deliver is infused with precision, creativity, and futuristic thinking. Our journey began with
              a simple idea: to provide cutting-edge technology that truly empowers.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">Our Mission & Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="custom-card text-center p-6 animate-fade-in-up">
              <CardHeader className="flex flex-col items-center pb-4">
                <Lightbulb className="w-10 h-10 text-accent-blue mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Continuously exploring new technologies to deliver groundbreaking solutions.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card text-center p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Handshake className="w-10 h-10 text-accent-green mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Operating with transparency, honesty, and ethical practices in all we do.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card text-center p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Users className="w-10 h-10 text-accent-orange mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Client-Centricity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Prioritizing client needs and building strong, lasting partnerships.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card text-center p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Award className="w-10 h-10 text-accent-purple mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Committed to delivering high-quality, reliable, and scalable solutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Approach</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            We combine agile methodologies with deep industry expertise to deliver solutions that are not just
            functional, but also transformative. Our process is collaborative, ensuring your vision is at the heart of
            every project.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="custom-card p-6 animate-fade-in-up">
              <CardHeader className="flex flex-col items-center pb-4">
                <span className="text-5xl font-bold text-accent-blue mb-2">1</span>
                <CardTitle className="text-xl font-semibold text-foreground">Discovery & Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Understanding your unique challenges and defining a clear roadmap.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <span className="text-5xl font-bold text-accent-green mb-2">2</span>
                <CardTitle className="text-xl font-semibold text-foreground">Development & Iteration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Building robust solutions with continuous feedback and refinement.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <span className="text-5xl font-bold text-accent-orange mb-2">3</span>
                <CardTitle className="text-xl font-semibold text-foreground">Deployment & Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Seamless launch and ongoing support to ensure long-term success.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Transform Your Business?</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
            Partner with Limitless Infotech Solutions and unlock your full digital potential.
          </p>
          <Button asChild className="btn-gradient">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
