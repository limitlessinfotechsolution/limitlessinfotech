import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, Code, Globe, Lightbulb, Users } from "lucide-react"
import { notFound } from "next/navigation"

interface Project {
  slug: string
  title: string
  category: string
  description: string
  longDescription: string[]
  imageUrl: string
  technologies: string[]
  features: string[]
  client: string
  challenge: string
  solution: string
  results: string
  websiteUrl?: string
}

const projects: Project[] = [
  {
    slug: "crm-management-tracking-app",
    title: "CRM Management & Tracking App",
    category: "Custom Software",
    description: "A robust CRM solution to streamline customer relationship management and sales tracking.",
    longDescription: [
      "Developed a comprehensive CRM platform designed to centralize customer data, automate sales processes, and enhance client communication. This application provides a 360-degree view of customer interactions, from initial lead generation to post-sales support.",
      "Key functionalities include lead management, sales pipeline visualization, task automation, detailed analytics, and customizable reporting. The system is built to scale with business growth, offering flexibility and integration capabilities with existing tools.",
    ],
    imageUrl: "/images/projects/crm.jpg",
    technologies: ["React", "Node.js", "MongoDB", "Express.js", "Tailwind CSS"],
    features: [
      "Lead & Contact Management",
      "Sales Pipeline Automation",
      "Customer Interaction Tracking",
      "Customizable Dashboards",
      "Reporting & Analytics",
      "Integration Capabilities",
    ],
    client: "Global Sales Inc.",
    challenge:
      "Client needed a unified platform to manage disparate customer data and improve sales team efficiency, which was hindered by manual processes and fragmented information.",
    solution:
      "Designed and implemented a scalable CRM application with intuitive UI, real-time data synchronization, and automated workflows. Integrated with existing communication tools to provide a seamless user experience.",
    results:
      "Achieved a 30% increase in sales team productivity, 20% reduction in lead conversion time, and significant improvement in customer satisfaction scores.",
    websiteUrl: "#",
  },
  {
    slug: "e-commerce-platform-rebuild",
    title: "E-commerce Platform Rebuild",
    category: "Web Development",
    description: "Revamped an existing e-commerce platform for improved performance and user experience.",
    longDescription: [
      "Undertook a complete overhaul of a legacy e-commerce system, focusing on modernizing the tech stack, enhancing site speed, and optimizing the user journey. The new platform offers a seamless shopping experience across devices.",
      "Features include a responsive design, secure payment gateway integration, advanced product search and filtering, inventory management, and customer review functionalities. The backend was re-architected for better scalability and maintainability.",
    ],
    imageUrl: "/images/projects/ecommerce.jpg",
    technologies: ["Next.js", "TypeScript", "GraphQL", "PostgreSQL", "Stripe API"],
    features: [
      "Responsive Design",
      "Secure Payment Gateway",
      "Advanced Product Search",
      "Inventory Management",
      "Customer Reviews",
      "Performance Optimization",
    ],
    client: "Fashion Retail Co.",
    challenge:
      "The client's old e-commerce platform suffered from slow load times, poor mobile responsiveness, and a cumbersome checkout process, leading to high bounce rates and lost sales.",
    solution:
      "Rebuilt the platform using Next.js for server-side rendering and optimized image delivery. Implemented a streamlined checkout flow and integrated a robust payment system. Focused on mobile-first design principles.",
    results:
      "Achieved a 40% improvement in page load speed, 25% increase in mobile conversion rates, and a significant boost in overall sales.",
    websiteUrl: "#",
  },
  {
    slug: "educational-portal-development",
    title: "Educational Portal Development",
    category: "Web Development",
    description: "Created an interactive online learning portal for students and educators.",
    longDescription: [
      "Designed and developed a comprehensive educational portal that serves as a central hub for learning resources, course management, and interactive assignments. The platform supports various content formats, including videos, quizzes, and downloadable materials.",
      "Key features include user authentication for different roles (students, teachers, admins), progress tracking, discussion forums, and a robust content management system. The goal was to create an engaging and accessible learning environment.",
    ],
    imageUrl: "/images/projects/education.jpg",
    technologies: ["Vue.js", "Firebase", "Python (Django)", "WebSockets"],
    features: [
      "User Role Management",
      "Course & Content Delivery",
      "Progress Tracking",
      "Interactive Quizzes",
      "Discussion Forums",
      "Live Chat Support",
    ],
    client: "EduTech Innovations",
    challenge:
      "The client needed a scalable and user-friendly platform to deliver online courses and manage student progress, replacing a collection of disparate tools.",
    solution:
      "Built a single-page application with Vue.js for a dynamic user experience and Firebase for real-time data. Integrated a Django backend for robust content management and user authentication.",
    results:
      "Increased student engagement by 35%, streamlined course administration, and expanded reach to a global student base.",
    websiteUrl: "#",
  },
  {
    slug: "fintech-security-dashboard",
    title: "FinTech Security Dashboard",
    category: "Custom Software",
    description: "A secure, real-time dashboard for monitoring financial transactions and detecting anomalies.",
    longDescription: [
      "Developed a high-security FinTech dashboard providing real-time insights into financial transactions, fraud detection, and compliance monitoring. The application prioritizes data integrity and user security.",
      "Features include customizable alerts, detailed transaction logs, anomaly detection algorithms, and comprehensive reporting tools. The system is designed to meet stringent regulatory requirements and provide actionable intelligence for financial institutions.",
    ],
    imageUrl: "/images/projects/fintech.jpg",
    technologies: ["Angular", "Java (Spring Boot)", "Kafka", "Elasticsearch", "Kubernetes"],
    features: [
      "Real-time Transaction Monitoring",
      "Fraud Detection Algorithms",
      "Compliance Reporting",
      "Customizable Alerts",
      "Audit Trails",
      "High-Security Protocols",
    ],
    client: "SecureBank Corp.",
    challenge:
      "SecureBank needed a robust system to detect fraudulent activities in real-time and ensure compliance with financial regulations, which was difficult with their existing manual review processes.",
    solution:
      "Implemented a real-time data streaming architecture using Kafka and Elasticsearch for rapid anomaly detection. Developed a secure Angular frontend for intuitive data visualization and alert management.",
    results:
      "Reduced fraud detection time by 80%, improved compliance adherence, and enhanced overall financial security posture.",
    websiteUrl: "#",
  },
  {
    slug: "fitness-tracking-mobile-app",
    title: "Fitness Tracking Mobile App",
    category: "Mobile App Development",
    description: "A cross-platform mobile application for personal fitness tracking and workout planning.",
    longDescription: [
      "Created an intuitive mobile application for fitness enthusiasts to track their workouts, monitor progress, and plan routines. The app offers a personalized experience with data visualization and goal setting.",
      "Features include a workout builder, exercise library, progress charts, calorie tracking, and social sharing capabilities. The cross-platform development ensures a consistent experience on both iOS and Android devices.",
    ],
    imageUrl: "/images/projects/fitness.jpg",
    technologies: ["React Native", "Firebase", "Redux", "HealthKit/Google Fit API"],
    features: [
      "Personalized Workout Plans",
      "Exercise Library",
      "Progress Tracking & Charts",
      "Calorie & Macro Tracking",
      "Social Sharing",
      "Wearable Device Integration",
    ],
    client: "ActiveLife Fitness",
    challenge:
      "ActiveLife Fitness aimed to provide their members with a modern, engaging mobile app to complement their gym services and encourage consistent workout habits.",
    solution:
      "Developed a cross-platform app using React Native, integrating with health APIs for seamless data synchronization. Focused on a clean UI/UX and gamification elements to boost user engagement.",
    results:
      "Increased member engagement by 50%, improved workout consistency, and provided valuable data insights for personal trainers.",
    websiteUrl: "#",
  },
  {
    slug: "healthcare-patient-portal",
    title: "Healthcare Patient Portal",
    category: "Custom Software",
    description:
      "A secure and user-friendly portal for patients to manage appointments, view records, and communicate with providers.",
    longDescription: [
      "Built a HIPAA-compliant patient portal designed to enhance communication between patients and healthcare providers, streamline administrative tasks, and provide easy access to health information.",
      "Features include online appointment scheduling, secure messaging, access to lab results and medical history, prescription refill requests, and educational resources. The portal emphasizes data security and user privacy.",
    ],
    imageUrl: "/images/projects/healthcare.jpg",
    technologies: ["ASP.NET Core", "SQL Server", "Azure", "HL7/FHIR Integration"],
    features: [
      "Online Appointment Scheduling",
      "Secure Patient Messaging",
      "Access to Medical Records",
      "Prescription Refill Requests",
      "Health Education Resources",
      "HIPAA Compliance",
    ],
    client: "MediCare Group",
    challenge:
      "MediCare Group needed a secure and efficient way for patients to manage their healthcare online, reducing administrative burden and improving patient satisfaction.",
    solution:
      "Developed a robust, secure portal using ASP.NET Core and SQL Server, hosted on Azure for scalability and compliance. Integrated with existing EMR systems using HL7/FHIR standards.",
    results:
      "Reduced administrative calls by 30%, improved patient access to information, and enhanced overall patient experience.",
    websiteUrl: "#",
  },
]

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-dark-blue-900 text-foreground py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/projects"
          className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Projects
        </Link>

        <header className="text-center mb-12">
          <Badge className="bg-accent-blue/20 text-accent-blue px-4 py-1 rounded-full text-sm font-medium mb-4">
            {project.category}
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">{project.title}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{project.description}</p>
        </header>

        <section className="mb-12">
          <Image
            src={project.imageUrl || "/placeholder.svg"}
            alt={project.title}
            width={1200}
            height={675}
            className="rounded-lg shadow-xl object-cover w-full h-auto animate-fade-in"
          />
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="custom-card p-6 animate-fade-in-up">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-semibold text-foreground">Client</CardTitle>
              <Users className="w-6 h-6 text-accent-blue" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{project.client}</p>
            </CardContent>
          </Card>
          <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-semibold text-foreground">Category</CardTitle>
              <Lightbulb className="w-6 h-6 text-accent-green" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{project.category}</p>
            </CardContent>
          </Card>
          <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-semibold text-foreground">Technologies</CardTitle>
              <Code className="w-6 h-6 text-accent-orange" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="outline" className="bg-muted/20 text-muted-foreground border-border">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-10 mb-12">
          <Card className="custom-card p-8 animate-fade-in-up">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-foreground">Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              {project.longDescription.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </CardContent>
          </Card>

          <Card className="custom-card p-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-foreground">The Challenge</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>{project.challenge}</p>
            </CardContent>
          </Card>

          <Card className="custom-card p-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-foreground">Our Solution</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>{project.solution}</p>
            </CardContent>
          </Card>

          <Card className="custom-card p-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-foreground">Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-muted-foreground">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-accent-green flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="custom-card p-8 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-foreground">Results & Impact</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p>{project.results}</p>
            </CardContent>
          </Card>
        </section>

        {project.websiteUrl && (
          <section className="text-center mt-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">View Live Project</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
              Explore the live application and see our work in action.
            </p>
            <Button asChild className="btn-gradient">
              <Link href={project.websiteUrl} target="_blank" rel="noopener noreferrer">
                <Globe className="w-5 h-5 mr-2" />
                Visit Website
              </Link>
            </Button>
          </section>
        )}
      </div>
    </div>
  )
}
