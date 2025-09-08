import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Rocket, Users, Award, Globe, Lightbulb } from "lucide-react"

export default function CompanyHistoryPage() {
  const historyEvents = [
    {
      year: "2010",
      title: "Founding of Limitless Infotech Solutions",
      description: "Established with a vision to provide innovative software solutions to businesses.",
      icon: Rocket,
    },
    {
      year: "2012",
      title: "First Major Web Development Project",
      description:
        "Successfully delivered a large-scale e-commerce platform for a national retailer, marking our entry into significant web projects.",
      icon: Globe,
    },
    {
      year: "2015",
      title: "Expansion into Mobile App Development",
      description: "Launched our dedicated mobile app development division, focusing on iOS and Android applications.",
      icon: Users,
    },
    {
      year: "2018",
      title: "Introduction of Custom CRM Solutions",
      description:
        "Developed our flagship CRM Management & Tracking App, providing tailored solutions for customer relationship management.",
      icon: Award,
    },
    {
      year: "2020",
      title: "Global Client Base Achieved",
      description:
        "Expanded our reach to serve clients across multiple continents, solidifying our international presence.",
      icon: Globe,
    },
    {
      year: "2023",
      title: "AI & Machine Learning Integration",
      description:
        "Began integrating advanced AI and ML capabilities into our custom software solutions, enhancing automation and intelligence.",
      icon: Lightbulb,
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Our Company History</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A journey of innovation, growth, and commitment to empowering businesses through technology.
          </p>
        </header>

        <section className="relative max-w-3xl mx-auto">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-border rounded-full hidden md:block" />
          <div className="space-y-12">
            {historyEvents.map((event, index) => (
              <div
                key={index}
                className="relative flex items-center md:justify-between md:even:flex-row-reverse group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-full md:w-5/12 text-right md:text-left">
                  <Card className="custom-card p-6">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-semibold text-foreground flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-accent-blue" />
                        <span>{event.year}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-lg font-bold text-foreground mb-2">{event.title}</h3>
                      <p className="text-muted-foreground text-sm">{event.description}</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10 bg-dark-blue-900 p-3 rounded-full border-4 border-dark-blue-700 group-hover:scale-110 transition-transform duration-200 hidden md:block">
                  <event.icon className="w-6 h-6 text-accent-green" />
                </div>
                <div className="w-full md:w-5/12" />
              </div>
            ))}
          </div>
        </section>

        <section className="text-center mt-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Our Future is Limitless</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
            We continue to innovate and expand our capabilities, always striving to deliver the best for our clients.
          </p>
          {/* Button component is not imported, assuming it's a custom component */}
          <button className="btn-gradient">
            <Link href="/contact">Join Our Journey</Link>
          </button>
        </section>
      </div>
    </div>
  )
}
