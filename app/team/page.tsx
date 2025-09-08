import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react"

interface TeamMember {
  name: string
  role: string
  imageUrl: string
  bio: string
  social: {
    linkedin?: string
    twitter?: string
    facebook?: string
    email?: string
  }
}

const teamMembers: TeamMember[] = [
  {
    name: "John Doe",
    role: "CEO & Founder",
    imageUrl: "/images/team/john-doe.jpg",
    bio: "John is the visionary behind Limitless Infotech Solutions, with over 20 years of experience in software architecture and business strategy. He leads the company with a passion for innovation and client success.",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "john.doe@limitless.com",
    },
  },
  {
    name: "Jane Smith",
    role: "Chief Technology Officer",
    imageUrl: "/images/team/jane-smith.jpg",
    bio: "Jane is a seasoned technologist responsible for our technical vision and product development. Her expertise spans across full-stack development, cloud infrastructure, and AI.",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "jane.smith@limitless.com",
    },
  },
  {
    name: "Mike Johnson",
    role: "Head of Web Development",
    imageUrl: "/images/team/mike-johnson.jpg",
    bio: "Mike leads our web development team, specializing in creating scalable and engaging web applications. He's passionate about user experience and clean code.",
    social: {
      linkedin: "#",
      facebook: "#",
      email: "mike.johnson@limitless.com",
    },
  },
  {
    name: "Emily Davis",
    role: "Lead Mobile Developer",
    imageUrl: "/images/team/emily-davis.jpg",
    bio: "Emily is our mobile app guru, with a knack for building intuitive and high-performance iOS and Android applications. She loves bringing ideas to life on mobile screens.",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "emily.davis@limitless.com",
    },
  },
  {
    name: "David Brown",
    role: "Senior Solutions Architect",
    imageUrl: "/images/team/david-brown.jpg",
    bio: "David designs robust and scalable software architectures for our custom solutions. His analytical mind ensures every project is built on a solid foundation.",
    social: {
      linkedin: "#",
      email: "david.brown@limitless.com",
    },
  },
  {
    name: "Sarah Wilson",
    role: "Project Manager",
    imageUrl: "/images/team/sarah-wilson.jpg",
    bio: "Sarah ensures our projects are delivered on time and within budget, keeping communication fluid between clients and our development teams. She's a master of organization.",
    social: {
      linkedin: "#",
      email: "sarah.wilson@limitless.com",
    },
  },
  {
    name: "Alex Martinez",
    role: "UI/UX Designer",
    imageUrl: "/images/team/alex-martinez.jpg",
    bio: "Alex crafts beautiful and user-friendly interfaces that make our software a joy to use. He believes great design is key to great user experiences.",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "alex.martinez@limitless.com",
    },
  },
  {
    name: "Lisa Taylor",
    role: "Quality Assurance Lead",
    imageUrl: "/images/team/lisa-taylor.jpg",
    bio: "Lisa is meticulous about quality, ensuring every product we deliver is bug-free and performs to the highest standards. Her attention to detail is unmatched.",
    social: {
      linkedin: "#",
      email: "lisa.taylor@limitless.com",
    },
  },
]

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-dark-blue-900 text-foreground py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Meet Our Expert Team</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Behind every successful project at Limitless Infotech Solutions is a dedicated team of passionate and
            skilled professionals.
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card
              key={member.name}
              className="custom-card overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative w-full h-64">
                <Image
                  src={member.imageUrl || "/placeholder.svg"}
                  alt={member.name}
                  layout="fill"
                  objectFit="cover"
                  className="object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-blue-900/70 to-transparent" />
              </div>
              <CardContent className="p-6 text-center">
                <CardTitle className="text-xl font-semibold text-foreground mb-1">{member.name}</CardTitle>
                <p className="text-accent-blue font-medium mb-4">{member.role}</p>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{member.bio}</p>
                <div className="flex justify-center space-x-4">
                  {member.social.linkedin && (
                    <Link
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-purple hover:text-accent-purple/80 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                      <span className="sr-only">LinkedIn</span>
                    </Link>
                  )}
                  {member.social.twitter && (
                    <Link
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-cyan hover:text-accent-cyan/80 transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                      <span className="sr-only">Twitter</span>
                    </Link>
                  )}
                  {member.social.facebook && (
                    <Link
                      href={member.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-blue hover:text-accent-blue/80 transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                      <span className="sr-only">Facebook</span>
                    </Link>
                  )}
                  {member.social.email && (
                    <Link
                      href={`mailto:${member.social.email}`}
                      className="text-accent-green hover:text-accent-green/80 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      <span className="sr-only">Email</span>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="text-center mt-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Join Our Growing Team!</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
            We&apos;re always looking for talented individuals to contribute to our innovative projects.
          </p>
          <Button asChild className="btn-gradient">
            <Link href="/careers">View Open Positions</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
