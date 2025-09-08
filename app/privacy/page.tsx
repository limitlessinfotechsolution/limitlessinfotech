import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-dark-blue-900 text-foreground py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your privacy is critically important to us. This policy outlines how we collect, use, and protect your
            information.
          </p>
        </header>

        <section className="max-w-4xl mx-auto space-y-8">
          <Card className="custom-card p-6 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-foreground">Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                We collect various types of information to provide and improve our services to you.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <span className="font-semibold text-foreground">Personal Information:</span> This includes information
                  you voluntarily provide to us when you register for an account, fill out a form, subscribe to our
                  newsletter, or contact us. Examples include your name, email address, phone number, company name, and
                  billing information.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Usage Data:</span> We automatically collect
                  information on how the Service is accessed and used. This Usage Data may include information such as
                  your computer&apos;s Internet Protocol address (e.g., IP address), browser type, browser version, the
                  pages of our Service that you visit, the time and date of your visit, the time spent on those pages,
                  unique device identifiers, and other diagnostic data.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Cookies and Tracking Technologies:</span> We use
                  cookies and similar tracking technologies to track the activity on our Service and hold certain
                  information. Cookies are files with a small amount of data which may include an anonymous unique
                  identifier. For more details, please refer to our{" "}
                  <Link href="/cookies" className="text-accent-blue hover:underline">
                    Cookie Policy
                  </Link>
                  .
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="text-foreground">How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">We use the collected data for various purposes:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>To provide and maintain our Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve our Service</li>
                <li>To monitor the usage of our Service</li>
                <li>To detect, prevent and address technical issues</li>
                <li>
                  To provide you with news, special offers and general information about other goods, services and
                  events which we offer that are similar to those that you have already purchased or enquired about
                  unless you have opted not to receive such information
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="text-foreground">Disclosure of Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                We may disclose your Personal Information in the good faith belief that such action is necessary to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>To comply with a legal obligation</li>
                <li>To protect and defend the rights or property of Limitless Infotech Solutions</li>
                <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
                <li>To protect the personal safety of users of the Service or the public</li>
                <li>To protect against legal liability</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information
                unless we provide users with advance notice. This does not include website hosting partners and other
                parties who assist us in operating our website, conducting our business, or serving our users, so long
                as those parties agree to keep this information confidential.
              </p>
            </CardContent>
          </Card>

          <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle className="text-foreground">Security of Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                The security of your data is important to us, but remember that no method of transmission over the
                Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable
                means to protect your Personal Data, we cannot guarantee its absolute security. We implement a variety
                of security measures when a user places an order or enters, submits, or accesses their information to
                maintain the safety of your personal information.
              </p>
            </CardContent>
          </Card>

          <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="text-foreground">Your Data Protection Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Depending on your location, you may have the following data protection rights:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>The right to access, update or to delete the information we have on you.</li>
                <li>The right of rectification.</li>
                <li>The right to object.</li>
                <li>The right of restriction.</li>
                <li>The right to data portability.</li>
                <li>The right to withdraw consent.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                If you wish to exercise any of these rights, please contact us.
              </p>
            </CardContent>
          </Card>

          <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <CardHeader>
              <CardTitle className="text-foreground">Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service,
                prior to the change becoming effective and update the &quot;effective date&quot; at the top of this
                Privacy Policy.
              </p>
            </CardContent>
          </Card>

          <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <CardHeader>
              <CardTitle className="text-foreground">Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                <li>
                  By email:{" "}
                  <Link href="mailto:privacy@limitless.com" className="text-accent-blue hover:underline">
                    privacy@limitless.com
                  </Link>
                </li>
                <li>
                  By visiting this page on our website:{" "}
                  <Link href="/contact" className="text-accent-blue hover:underline">
                    limitless.com/contact
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
