import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen bg-dark-blue-900 text-foreground py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Cookie Policy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understanding how we use cookies to enhance your experience on our website.
          </p>
        </header>

        <section className="max-w-4xl mx-auto space-y-8">
          <Card className="custom-card p-6 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-foreground">What are Cookies?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website.
                They are widely used to make websites work, or to work more efficiently, as well as to provide
                information to the owners of the site. Cookies enable us to remember your preferences, analyze how our
                website is performing, and provide you with a more personalized experience.
              </p>
            </CardContent>
          </Card>

          <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="text-foreground">How We Use Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">We use cookies for several purposes, including:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <span className="font-semibold text-foreground">Essential Cookies:</span> These cookies are strictly
                  necessary for the operation of our website. They enable you to navigate the site and use its features,
                  such as accessing secure areas. Without these cookies, services like shopping carts or e-billing
                  cannot be provided.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Performance and Analytics Cookies:</span> These
                  cookies collect information about how visitors use our website, such as which pages are visited most
                  often, and if they get error messages from web pages. These cookies do not collect information that
                  identifies a visitor. All information these cookies collect is aggregated and therefore anonymous. It
                  is only used to improve how a website works.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Functionality Cookies:</span> These cookies allow our
                  website to remember choices you make (such as your user name, language, or the region you are in) and
                  provide enhanced, more personal features. For instance, a website may be able to provide you with
                  local weather reports or traffic news by storing in a cookie the region in which you are currently
                  located.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Advertising and Targeting Cookies:</span> These
                  cookies are used to deliver advertisements more relevant to you and your interests. They are also used
                  to limit the number of times you see an advertisement as well as help measure the effectiveness of the
                  advertising campaign. They are usually placed by advertising networks with the website operator’s
                  permission.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="text-foreground">Your Choices Regarding Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie
                preferences by clicking on the appropriate opt-out links provided in the cookie consent banner or by
                modifying your browser settings.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  Most web browsers allow some control of most cookies through the browser settings. To find out more
                  about cookies, including how to see what cookies have been set and how to manage and delete them,
                  visit{" "}
                  <Link
                    href="http://www.allaboutcookies.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-blue hover:underline"
                  >
                    www.allaboutcookies.org
                  </Link>
                  .
                </li>
                <li>
                  You can also opt-out of targeted advertising by visiting:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>
                      <Link
                        href="http://www.aboutads.info/choices/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-blue hover:underline"
                      >
                        Digital Advertising Alliance
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="http://www.youronlinechoices.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-blue hover:underline"
                      >
                        European Interactive Digital Advertising Alliance
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Please note that if you choose to disable cookies, some features of our website may not function
                properly.
              </p>
            </CardContent>
          </Card>

          <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle className="text-foreground">Changes to Our Cookie Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time in order to reflect, for example, changes to the
                cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this
                Cookie Policy regularly to stay informed about our use of cookies and related technologies.
              </p>
            </CardContent>
          </Card>

          <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="text-foreground">Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about our use of cookies or other technologies, please email us at{" "}
                <Link href="mailto:privacy@limitless.com" className="text-accent-blue hover:underline">
                  privacy@limitless.com
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
