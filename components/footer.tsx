import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-dark-blue-800 text-muted-foreground py-12 border-t border-dark-blue-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center space-x-3 mb-4">
            <Image src="/images/logo.png" alt="Limitless Infotech Solutions" width={40} height={40} />
            <span className="text-2xl font-bold text-foreground">Limitless Infotech</span>
          </Link>
          <p className="text-sm leading-relaxed">
            Empowering Businesses with Technology that is Secure, Unique, and Limitless. We are architects of
            transformation.
          </p>
          <div className="flex space-x-4 mt-4">
            <Link href="#" className="text-accent-blue hover:text-accent-blue/80 transition-colors">
              <Facebook className="w-6 h-6" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-accent-cyan hover:text-accent-cyan/80 transition-colors">
              <Twitter className="w-6 h-6" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-accent-purple hover:text-accent-purple/80 transition-colors">
              <Linkedin className="w-6 h-6" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="hover:text-primary transition-colors text-sm">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-primary transition-colors text-sm">
                Our Services
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:text-primary transition-colors text-sm">
                Our Projects
              </Link>
            </li>
            <li>
              <Link href="/team" className="hover:text-primary transition-colors text-sm">
                Our Team
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-primary transition-colors text-sm">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary transition-colors text-sm">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Services</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/services/web-development" className="hover:text-primary transition-colors text-sm">
                Web Development
              </Link>
            </li>
            <li>
              <Link href="/services/mobile-app-development" className="hover:text-primary transition-colors text-sm">
                Mobile App Development
              </Link>
            </li>
            <li>
              <Link href="/services/custom-software" className="hover:text-primary transition-colors text-sm">
                Custom Software
              </Link>
            </li>
            <li>
              <Link href="/services/crm-solutions" className="hover:text-primary transition-colors text-sm">
                CRM Solutions
              </Link>
            </li>
            <li>
              <Link href="/api-docs" className="hover:text-primary transition-colors text-sm">
                API Development
              </Link>
            </li>
            <li>
              <Link href="/cpanel" className="hover:text-primary transition-colors text-sm">
                Hosting & CPanel
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Contact Info</h3>
          <address className="not-italic space-y-3 text-sm">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-accent-blue flex-shrink-0" />
              <span>123 Tech Avenue, Suite 400, Innovation City, CA 90210, USA</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-accent-green flex-shrink-0" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-accent-orange flex-shrink-0" />
              <span>info@limitless.com</span>
            </div>
          </address>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 border-t border-dark-blue-700 mt-8 pt-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Limitless Infotech Solutions. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <Link href="/privacy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="/cookies" className="hover:text-primary transition-colors">
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
