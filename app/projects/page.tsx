import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface Project {
  slug: string
  title: string
  category: string
  description: string
  imageUrl: string
  technologies: string[]
}

const projects: Project[] = [
  {
    slug: "crm-management-tracking-app",
    title: "CRM Management & Tracking App",
    category: "Custom Software",
    description: "A robust CRM solution to streamline customer relationship management and sales tracking.",
    imageUrl: "/images/projects/crm.jpg",
    technologies: ["React", "Node.js", "MongoDB"],
  },
  {
    slug: "e-commerce-platform-rebuild",
    title: "E-commerce Platform Rebuild",
    category: "Web Development",
    description: "Revamped an existing e-commerce platform for improved performance and user experience.",
    imageUrl: "/images/projects/ecommerce.jpg",
    technologies: ["Next.js", "TypeScript", "GraphQL"],
  },
  {
    slug: "educational-portal-development",
    title: "Educational Portal Development",
    category: "Web Development",
    description: "Created an interactive online learning portal for students and educators.",
    imageUrl: "/images/projects/education.jpg",
    technologies: ["Vue.js", "Firebase", "Python (Django)"],
  },
  {
    slug: "fintech-security-dashboard",
    title: "FinTech Security Dashboard",
    category: "Custom Software",
    description: "A secure, real-time dashboard for monitoring financial transactions and detecting anomalies.",
    imageUrl: "/images/projects/fintech.jpg",
    technologies: ["Angular", "Java (Spring Boot)", "Kafka"],
  },
  {
    slug: "fitness-tracking-mobile-app",
    title: "Fitness Tracking Mobile App",
    category: "Mobile App Development",
    description: "A cross-platform mobile application for personal fitness tracking and workout planning.",
    imageUrl: "/images/projects/fitness.jpg",
    technologies: ["React Native", "Firebase", "Redux"],
  },
  {
    slug: "healthcare-patient-portal",
    title: "Healthcare Patient Portal",
    category: "Custom Software",
    description:
      "A secure and user-friendly portal for patients to manage appointments, view records, and communicate with providers.",
    imageUrl: "/images/projects/healthcare.jpg",
    technologies: ["ASP.NET Core", "SQL Server", "Azure"],
  },
]

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-dark-blue-900 text-foreground py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Our Projects</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore our diverse portfolio of successful projects, showcasing our expertise in delivering innovative and
            impactful technology solutions.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group block animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className="custom-card overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:shadow-glow-md group-hover:scale-[1.02]">
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={project.imageUrl || "/placeholder.svg"}
                    alt={project.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-blue-900/70 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-accent-blue/20 text-accent-blue px-3 py-1 rounded-full text-sm font-medium">
                    {project.category}
                  </Badge>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <CardTitle className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm mb-4 flex-1">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge
                        key={techIndex}
                        variant="outline"
                        className="bg-muted/20 text-muted-foreground border-border text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center text-accent-blue group-hover:text-accent-blue/80 transition-colors font-medium">
                    View Details
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>

        <section className="text-center mt-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Have a Project in Mind?</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
            Let&apos;s collaborate to bring your innovative ideas to life.
          </p>
          <Button asChild className="btn-gradient">
            <Link href="/contact">Start Your Project</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
