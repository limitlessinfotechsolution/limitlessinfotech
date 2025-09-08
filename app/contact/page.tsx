import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-dark-blue-900 text-foreground py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We&apos;d love to hear from you! Whether you have a question about our services, need support, or just want
            to say hello, our team is ready to assist.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-12 mb-16">
          <Card className="custom-card p-6 animate-fade-in-up">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-2 text-foreground text-2xl">
                <Mail className="w-6 h-6 text-accent-blue" />
                <span>Send Us a Message</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">
                    Your Name
                  </label>
                  <Input id="name" placeholder="John Doe" className="input-field" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
                    Your Email
                  </label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" className="input-field" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-muted-foreground mb-2">
                    Subject
                  </label>
                  <Input id="subject" placeholder="Inquiry about Web Development" className="input-field" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-2">
                    Your Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your needs..."
                    rows={5}
                    className="input-field"
                  />
                </div>
                <Button type="submit" className="btn-gradient w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <Card className="custom-card p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-foreground text-2xl">
                  <Phone className="w-6 h-6 text-accent-green" />
                  <span>Call Us</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">Speak directly with our team.</p>
                <p className="text-xl font-semibold text-foreground">+1 (555) 123-4567</p>
                <p className="text-sm text-muted-foreground">Available Monday - Friday, 9 AM - 5 PM EST</p>
              </CardContent>
            </Card>

            <Card className="custom-card p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-foreground text-2xl">
                  <MapPin className="w-6 h-6 text-accent-orange" />
                  <span>Our Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">Visit our office for a personal consultation.</p>
                <address className="not-italic text-foreground">
                  123 Tech Avenue, Suite 400
                  <br />
                  Innovation City, CA 90210
                  <br />
                  USA
                </address>
                <Button asChild variant="outline" className="btn-outline-primary mt-4 bg-transparent">
                  <Link href="https://maps.app.goo.gl/your-location" target="_blank" rel="noopener noreferrer">
                    Get Directions
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="custom-card p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-foreground text-2xl">
                  <Mail className="w-6 h-6 text-accent-purple" />
                  <span>General Inquiries</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">For general questions and partnerships.</p>
                <p className="text-xl font-semibold text-foreground">info@limitless.com</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Connect With Us</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
            Follow us on social media to stay updated on our latest news and innovations.
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="#" className="text-accent-blue hover:text-accent-blue/80 transition-colors">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-accent-cyan hover:text-accent-cyan/80 transition-colors">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c1.329 0 2.6-.387 3.67-1.157 1.07-.77 1.9-1.82 2.49-3.05.59-1.23.88-2.58.88-4.05 0-1.47-.29-2.82-.88-4.05-.59-1.23-1.42-2.28-2.49-3.05-1.07-.77-2.34-1.157-3.67-1.157-1.329 0-2.6.387-3.67 1.157-1.07.77-1.9 1.82-2.49 3.05-.59 1.23-.88 2.58-.88 4.05 0 1.47.29 2.82.88 4.05.59 1.23 1.42 2.28 2.49 3.05 1.07.77 2.34 1.157 3.67 1.157zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 8.25c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm-9 0c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm4.5 4.5c-1.864 0-3.416-1.21-3.984-2.875h7.968c-.568 1.665-2.12 2.875-3.984 2.875z" />
              </svg>
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-accent-purple hover:text-accent-purple/80 transition-colors">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.475 2 2 6.475 2 12c0 4.42 2.86 8.17 6.82 9.5V14.8h-2.5v-2.8h2.5V9.7c0-2.4 1.4-3.7 3.6-3.7 1.05 0 2.05.2 2.05.2V8.5h-1.2c-1.1 0-1.3.5-1.3 1.3V12h2.5l-.4 2.8h-2.1v6.7C19.14 20.17 22 16.42 22 12 22 6.475 17.525 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
