import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Code, Lightbulb, Settings, Shield, ArrowLeft } from "lucide-react"

export default function CustomSoftwarePage() {
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
            Custom Software Development
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Tailored software solutions designed to meet your unique business challenges and drive innovation.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="animate-fade-in-up">
            <Image
              src="/images/hero-graphic.png"
              alt="Custom Software Development"
              width={800}
              height={500}
              className="rounded-lg shadow-lg object-cover w-full h-auto"
            />
          </div>
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-3xl font-bold text-foreground">Build Beyond Off-the-Shelf Limitations</h2>
            <p className="text-muted-foreground leading-relaxed">
              Off-the-shelf software often falls short of addressing specific business needs. At Limitless Infotech
              Solutions, we specialize in crafting bespoke software that perfectly aligns with your operational
              workflows, strategic goals, and unique industry requirements.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From complex enterprise systems to specialized tools, our custom software solutions are built from the
              ground up to enhance efficiency, automate processes, and provide a competitive edge.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">Our Expertise Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="custom-card p-6 animate-fade-in-up">
              <CardHeader className="flex flex-col items-center pb-4">
                <Code className="w-10 h-10 text-accent-blue mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Enterprise Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Developing large-scale, integrated systems for complex business operations.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Lightbulb className="w-10 h-10 text-accent-green mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Business Process Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Automating repetitive tasks and optimizing workflows for increased efficiency.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Settings className="w-10 h-10 text-accent-orange mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Data Management Systems</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Building robust databases and data warehousing solutions for insightful analytics.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Shield className="w-10 h-10 text-accent-purple mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Security & Compliance Software</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Developing secure applications that meet industry-specific regulatory requirements.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <CheckCircle className="w-10 h-10 text-accent-cyan mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Integration Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Seamlessly connecting new software with your existing systems and third-party APIs.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Lightbulb className="w-10 h-10 text-primary mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Legacy System Modernization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Updating and migrating outdated systems to modern, efficient platforms.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Custom Software Development Process</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            We follow a proven agile methodology to deliver high-quality, scalable, and maintainable software.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="custom-card p-6 animate-fade-in-up">
              <CardHeader className="flex flex-col items-center pb-4">
                <span className="text-5xl font-bold text-accent-blue mb-2">1</span>
                <CardTitle className="text-xl font-semibold text-foreground">Discovery & Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Deep dive into your business needs, challenges, and technical requirements.
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
                  Iterative development with continuous feedback, ensuring alignment with your vision.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <span className="text-5xl font-bold text-accent-orange mb-2">3</span>
                <CardTitle className="text-xl font-semibold text-foreground">Testing & Deployment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Rigorous testing and seamless deployment, followed by ongoing support and maintenance.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready for a Tailored Solution?</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
            Let&apos;s discuss your project and build software that gives you a competitive edge.
          </p>
          <Button asChild className="btn-gradient">
            <Link href="/contact">Get a Free Consultation</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
