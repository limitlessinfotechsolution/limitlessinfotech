import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Users, TrendingUp, Shield, Lightbulb, ArrowLeft } from "lucide-react"

export default function CRMSolutionsPage() {
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            CRM Management & Tracking App
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Streamline your customer relationships and boost sales with our powerful, custom-built CRM solutions.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="animate-fade-in-up">
            <Image
              src="/images/projects/crm.jpg"
              alt="CRM Solution"
              width={800}
              height={500}
              className="rounded-lg shadow-lg object-cover w-full h-auto"
            />
          </div>
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-3xl font-bold text-foreground">Empower Your Sales & Customer Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              In today&apos;s competitive landscape, effective customer relationship management is paramount. Our CRM
              solutions are designed to centralize your customer data, automate sales processes, and enhance
              communication, giving your team the tools they need to succeed.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From lead generation to post-sales support, our custom CRM applications provide a 360-degree view of every
              customer interaction, enabling personalized engagement and informed decision-making.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">Key Features & Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="custom-card p-6 animate-fade-in-up">
              <CardHeader className="flex flex-col items-center pb-4">
                <Users className="w-10 h-10 text-accent-blue mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">
                  Comprehensive Contact Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Centralize all customer data, interaction history, and communication logs in one place.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <TrendingUp className="w-10 h-10 text-accent-green mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Sales Pipeline Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Automate lead nurturing, track sales stages, and forecast revenue with precision.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Lightbulb className="w-10 h-10 text-accent-orange mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">
                  Customizable Dashboards & Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Gain actionable insights with tailored dashboards and detailed performance reports.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Shield className="w-10 h-10 text-accent-purple mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Enhanced Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Protect sensitive customer information with robust security protocols and access controls.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <CheckCircle className="w-10 h-10 text-accent-cyan mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Seamless Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Integrate with your existing marketing, accounting, and communication tools.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Lightbulb className="w-10 h-10 text-primary mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Scalable & Flexible</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Designed to grow with your business, adapting to evolving needs and expanding operations.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our CRM Development Process</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            We follow a meticulous process to ensure your CRM solution is perfectly tailored to your business.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="custom-card p-6 animate-fade-in-up">
              <CardHeader className="flex flex-col items-center pb-4">
                <span className="text-5xl font-bold text-accent-blue mb-2">1</span>
                <CardTitle className="text-xl font-semibold text-foreground">Discovery & Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  In-depth analysis of your current workflows and future CRM requirements.
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
                  Building a user-friendly interface and robust backend with agile methodologies.
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
                  Seamless integration into your operations and continuous support for optimal performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Transform Your Customer Relationships?</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
            Contact us today for a free consultation and let&apos;s build a CRM solution that drives your business
            forward.
          </p>
          <Button asChild className="btn-gradient">
            <Link href="/contact">Get a Free Consultation</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
