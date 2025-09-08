import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Target, Lightbulb, Handshake, Users, Award, Shield } from "lucide-react"

export default function MissionValuesPage() {
  const values = [
    {
      title: "Innovation",
      description:
        "Continuously exploring new technologies and creative approaches to deliver groundbreaking solutions.",
      icon: Lightbulb,
      color: "text-accent-blue",
    },
    {
      title: "Integrity",
      description: "Operating with transparency, honesty, and ethical practices in all our interactions and solutions.",
      icon: Handshake,
      color: "text-accent-green",
    },
    {
      title: "Client-Centricity",
      description: "Prioritizing client needs, understanding their vision, and building strong, lasting partnerships.",
      icon: Users,
      color: "text-accent-orange",
    },
    {
      title: "Excellence",
      description: "Committed to delivering high-quality, reliable, and scalable solutions that exceed expectations.",
      icon: Award,
      color: "text-accent-purple",
    },
    {
      title: "Security",
      description: "Ensuring the highest standards of data protection and cybersecurity in every solution we build.",
      icon: Shield,
      color: "text-accent-cyan",
    },
  ]

  return (
    <div className="min-h-screen bg-dark-blue-900 text-foreground py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/docs"
          className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Documentation
        </Link>

        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Our Mission & Values</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our guiding principles that define who we are, how we operate, and what we strive to achieve.
          </p>
        </header>

        <section className="max-w-4xl mx-auto space-y-8 mb-16">
          <Card className="custom-card p-6 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <Target className="w-6 h-6 text-accent-blue" />
                <span>Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Our mission at Limitless Infotech Solutions is to empower businesses worldwide with cutting-edge,
                secure, and unique technology solutions. We aim to be the architects of digital transformation,
                delivering precision-engineered software, web, and mobile applications that drive efficiency, foster
                growth, and provide a limitless competitive advantage. We are committed to turning complex challenges
                into innovative opportunities for our clients.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card
                key={value.title}
                className="custom-card p-6 text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="flex flex-col items-center pb-4">
                  <value.icon className={`w-12 h-12 mb-3 ${value.color}`} />
                  <CardTitle className="text-xl font-semibold text-foreground">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Our Commitment to You</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
            These values are not just words; they are the foundation of every project we undertake and every
            relationship we build. We are dedicated to upholding them in our pursuit of technological excellence.
          </p>
          <Link href="/contact" className="btn-gradient inline-flex items-center px-6 py-3 text-lg rounded-md">
            Partner With Us
          </Link>
        </section>
      </div>
    </div>
  )
}
