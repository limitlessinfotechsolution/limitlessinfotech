import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, MapPin, DollarSign, ArrowRight, Users, Lightbulb, Code } from "lucide-react"

interface JobOpening {
  id: string
  title: string
  location: string
  type: "Full-time" | "Part-time" | "Contract" | "Internship"
  salaryRange: string
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
}

const jobOpenings: JobOpening[] = [
  {
    id: "1",
    title: "Senior Full-Stack Developer",
    location: "Remote",
    type: "Full-time",
    salaryRange: "$100,000 - $140,000",
    description:
      "We are seeking a highly skilled Senior Full-Stack Developer to join our dynamic team. You will be responsible for designing, developing, and maintaining robust web applications from front to back.",
    responsibilities: [
      "Develop and maintain scalable web applications using modern frameworks.",
      "Collaborate with product managers and designers to define and implement new features.",
      "Write clean, maintainable, and efficient code.",
      "Participate in code reviews and mentor junior developers.",
      "Troubleshoot and debug production issues.",
    ],
    requirements: [
      "5+ years of experience in full-stack development.",
      "Proficiency in React.js, Node.js, and TypeScript.",
      "Experience with database technologies (e.g., PostgreSQL, MongoDB).",
      "Strong understanding of RESTful APIs and microservices architecture.",
      "Excellent problem-solving and communication skills.",
    ],
    benefits: [
      "Competitive salary and benefits package.",
      "Flexible work hours and remote-first culture.",
      "Opportunities for professional growth and development.",
      "Health, dental, and vision insurance.",
      "Paid time off and holidays.",
    ],
  },
  {
    id: "2",
    title: "Mobile App Developer (iOS/Android)",
    location: "New York, NY",
    type: "Full-time",
    salaryRange: "$90,000 - $130,000",
    description:
      "Join our mobile team to build innovative and user-friendly applications for iOS and Android platforms. You will work on exciting projects that impact thousands of users.",
    responsibilities: [
      "Design and develop high-quality mobile applications for iOS and Android.",
      "Collaborate with cross-functional teams to define, design, and ship new features.",
      "Ensure the performance, quality, and responsiveness of applications.",
      "Identify and correct bottlenecks and fix bugs.",
      "Stay up-to-date with new mobile technologies.",
    ],
    requirements: [
      "3+ years of experience in mobile app development.",
      "Proficiency in React Native or native iOS (Swift/Objective-C) / Android (Kotlin/Java) development.",
      "Experience with mobile UI/UX best practices.",
      "Familiarity with RESTful APIs to connect mobile applications to back-end services.",
      "Strong portfolio of released applications on the App Store or Google Play.",
    ],
    benefits: [
      "Competitive salary and benefits package.",
      "Opportunities for professional growth and development.",
      "Health, dental, and vision insurance.",
      "Generous paid time off.",
      "Modern office space with amenities.",
    ],
  },
  {
    id: "3",
    title: "UI/UX Designer",
    location: "Remote",
    type: "Full-time",
    salaryRange: "$70,000 - $100,000",
    description:
      "We are looking for a talented UI/UX Designer to create intuitive and visually appealing interfaces for our web and mobile applications. You will play a key role in shaping the user experience.",
    responsibilities: [
      "Conduct user research and usability testing.",
      "Create wireframes, storyboards, user flows, process flows, and site maps.",
      "Design intuitive and aesthetically pleasing user interfaces.",
      "Collaborate with developers to ensure design feasibility and implementation.",
      "Maintain and evolve our design system.",
    ],
    requirements: [
      "3+ years of experience in UI/UX design.",
      "Proficiency in design tools such as Figma, Sketch, Adobe XD.",
      "Strong portfolio showcasing a range of UI/UX projects.",
      "Understanding of user-centered design principles.",
      "Excellent communication and presentation skills.",
    ],
    benefits: [
      "Competitive salary and benefits package.",
      "Flexible work hours and remote-first culture.",
      "Creative and collaborative work environment.",
      "Opportunities to work on diverse projects.",
      "Professional development budget.",
    ],
  },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-dark-blue-900 text-foreground py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Join Our Team</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            At Limitless Infotech Solutions, we believe in fostering a culture of innovation, collaboration, and
            continuous learning. Explore our open positions and become a part of our growing family.
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {jobOpenings.map((job, index) => (
            <Card key={job.id} className="custom-card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground mb-2">{job.title}</CardTitle>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="bg-accent-blue/20 text-accent-blue border-accent-blue/30">
                    <MapPin className="w-3 h-3 mr-1" />
                    {job.location}
                  </Badge>
                  <Badge variant="outline" className="bg-accent-green/20 text-accent-green border-accent-green/30">
                    <Briefcase className="w-3 h-3 mr-1" />
                    {job.type}
                  </Badge>
                  <Badge variant="outline" className="bg-accent-orange/20 text-accent-orange border-accent-orange/30">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {job.salaryRange}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{job.description}</p>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Responsibilities:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {job.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Requirements:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {job.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Benefits:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {job.benefits.map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <Button asChild className="btn-gradient w-full mt-4">
                  <Link href={`#apply-${job.id}`}>
                    Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Why Work With Us?</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
            We offer a dynamic environment where your skills are valued and your career can thrive.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="custom-card p-6 animate-fade-in-up">
              <CardHeader className="flex flex-col items-center pb-4">
                <Users className="w-12 h-12 text-accent-blue mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Collaborative Culture</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Work alongside talented professionals in a supportive and engaging environment.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Lightbulb className="w-12 h-12 text-accent-green mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Innovation & Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Be part of cutting-edge projects and continuously expand your skill set.
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader className="flex flex-col items-center pb-4">
                <Code className="w-12 h-12 text-accent-orange mb-3" />
                <CardTitle className="text-xl font-semibold text-foreground">Impactful Work</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Contribute to solutions that make a real difference for businesses worldwide.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
