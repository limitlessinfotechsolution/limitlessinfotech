import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Smartphone,
  Apple,
  SmartphoneIcon as Android,
  Zap,
  Shield,
  Users,
  CheckCircle,
  Code,
  Layout,
  ArrowLeft,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Mobile App Development Services | Limitless Infotech Solution",
  description:
    "Professional mobile app development for iOS and Android. Native and cross-platform solutions with React Native, Flutter, and more.",
}

const features = [
  {
    icon: Smartphone,
    title: "Cross-Platform Development",
    description: "Build once, deploy everywhere with React Native and Flutter",
  },
  {
    icon: Zap,
    title: "Native Performance",
    description: "Optimized for speed and smooth user experience",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security and data protection",
  },
  {
    icon: Users,
    title: "User-Centric Design",
    description: "Intuitive interfaces designed for maximum engagement",
  },
  {
    icon: Apple,
    title: "iOS Development",
    description: "Native iOS apps with Swift and Objective-C",
  },
  {
    icon: Android,
    title: "Android Development",
    description: "Native Android apps with Kotlin and Java",
  },
]

const platforms = [
  {
    name: "React Native",
    description: "Cross-platform development with native performance",
    pros: ["Single codebase", "Fast development", "Native modules", "Hot reloading"],
    bestFor: "Startups and businesses wanting quick time-to-market",
  },
  {
    name: "Flutter",
    description: "Google's UI toolkit for beautiful, natively compiled applications",
    pros: ["Beautiful UI", "Fast performance", "Single codebase", "Growing ecosystem"],
    bestFor: "Apps requiring custom UI and animations",
  },
  {
    name: "Native iOS",
    description: "Platform-specific development for optimal performance",
    pros: ["Best performance", "Platform features", "App Store optimization", "Latest iOS features"],
    bestFor: "iOS-first strategy and performance-critical apps",
  },
  {
    name: "Native Android",
    description: "Platform-specific development for Android ecosystem",
    pros: ["Best performance", "Material Design", "Google Play optimization", "Android features"],
    bestFor: "Android-first strategy and Google ecosystem integration",
  },
]

const packages = [
  {
    name: "Starter App",
    price: "$4,999",
    description: "Perfect for simple mobile applications",
    features: [
      "Single platform (iOS or Android)",
      "Up to 5 screens",
      "Basic UI/UX design",
      "API integration",
      "App store submission",
      "1 month support",
    ],
    popular: false,
  },
  {
    name: "Professional App",
    price: "$9,999",
    description: "Ideal for business applications",
    features: [
      "Cross-platform (iOS & Android)",
      "Up to 15 screens",
      "Custom UI/UX design",
      "Backend integration",
      "Push notifications",
      "Analytics integration",
      "App store optimization",
      "3 months support",
    ],
    popular: true,
  },
  {
    name: "Enterprise App",
    price: "$19,999",
    description: "For complex enterprise solutions",
    features: [
      "Cross-platform with native modules",
      "Unlimited screens",
      "Advanced UI/UX design",
      "Custom backend development",
      "Real-time features",
      "Advanced security",
      "Third-party integrations",
      "Admin dashboard",
      "6 months support",
      "Maintenance included",
    ],
    popular: false,
  },
]

const appTypes = [
  {
    title: "E-commerce Apps",
    description: "Shopping apps with payment integration, product catalogs, and order management",
    icon: "🛒",
    features: ["Product catalog", "Shopping cart", "Payment gateway", "Order tracking"],
  },
  {
    title: "Social Media Apps",
    description: "Social networking platforms with real-time messaging and content sharing",
    icon: "📱",
    features: ["User profiles", "Real-time chat", "Content sharing", "Social features"],
  },
  {
    title: "Healthcare Apps",
    description: "Medical applications with appointment booking and health tracking",
    icon: "🏥",
    features: ["Appointment booking", "Health records", "Telemedicine", "HIPAA compliance"],
  },
  {
    title: "Fitness Apps",
    description: "Health and fitness tracking with workout plans and progress monitoring",
    icon: "💪",
    features: ["Workout tracking", "Progress analytics", "Social challenges", "Wearable integration"],
  },
  {
    title: "Education Apps",
    description: "Learning platforms with interactive content and progress tracking",
    icon: "📚",
    features: ["Course content", "Progress tracking", "Interactive quizzes", "Offline access"],
  },
  {
    title: "Business Apps",
    description: "Enterprise solutions for productivity and business management",
    icon: "💼",
    features: ["Team collaboration", "Project management", "Document sharing", "Analytics"],
  },
]

export default function MobileAppDevelopmentPage() {
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Mobile App Development</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Transform your ideas into powerful, intuitive mobile experiences for iOS and Android.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="animate-fade-in-up">
            <Image
              src="/images/projects/fitness.jpg"
              alt="Mobile App Development"
              width={800}
              height={500}
              className="rounded-lg shadow-lg object-cover w-full h-auto"
            />
          </div>
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-3xl font-bold text-foreground">Reach Your Audience On-the-Go</h2>
            <p className="text-muted-foreground leading-relaxed">
              In today&apos;s mobile-first world, a compelling mobile application is essential for engaging customers
              and expanding your reach. We specialize in developing high-performance, user-friendly mobile apps that
              deliver exceptional experiences on both iOS and Android platforms.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From concept to launch, our team leverages the latest technologies and best practices to create innovative
              mobile solutions that drive engagement, streamline operations, and achieve your business goals.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">Our Mobile App Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="custom-card p-6 animate-fade-in-up">
              <CardHeader className="flex flex-col items-center pb-4">
                <Smartphone className="w-10 h-10 text-accent-blue mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Native iOS Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Crafting high-performance, feature-rich applications specifically for Apple devices.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Smartphone className="w-10 h-10 text-accent-green mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Native Android Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Building robust and scalable applications optimized for the Android ecosystem.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Code className="w-10 h-10 text-accent-orange mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Cross-Platform Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Developing efficient apps that run seamlessly on both iOS and Android from a single codebase.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Layout className="w-10 h-10 text-accent-purple mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">UI/UX Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Creating intuitive, engaging, and visually appealing user interfaces for optimal experience.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <CheckCircle className="w-10 h-10 text-accent-cyan mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">API Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Connecting your mobile app with backend services and third-party platforms.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Smartphone className="w-10 h-10 text-primary mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">App Store Deployment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Guiding you through the entire app store submission and approval process.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Mobile App Development Process</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            We follow a structured approach to ensure your mobile app is a success from concept to launch.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="custom-card p-6 animate-fade-in-up">
              <CardHeader className="flex flex-col items-center pb-4">
                <span className="text-5xl font-bold text-accent-blue mb-2">1</span>
                <CardTitle className="text-xl font-semibold text-foreground">Strategy & Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Defining your app&apos;s goals, target audience, and core functionalities.
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
                  Creating intuitive UI/UX and building robust, scalable code.
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
                  Rigorous testing, seamless app store submission, and ongoing support.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Launch Your App?</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
            Let&apos;s build a mobile application that stands out and drives your business forward.
          </p>
          <Button asChild className="btn-gradient">
            <Link href="/contact">Get a Free Consultation</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
