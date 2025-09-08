import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-dark-blue-900 text-foreground py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using Our Service.
          </p>
        </header>

        <section className="max-w-4xl mx-auto space-y-8">
          <Card className="custom-card p-6 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-foreground">Introduction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Limitless Infotech Solutions. These Terms of Service (&quot;Terms&quot;) govern your access
                to and use of our website, products, and services (collectively, the &quot;Service&quot;). By accessing
                or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms,
                then you may not access the Service.
              </p>
            </CardContent>
          </Card>

          <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="text-foreground">Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                When you create an account with us, you must provide us with information that is accurate, complete, and
                current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate
                termination of your account on our Service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for safeguarding the password that you use to access the Service and for any
                activities or actions under your password, whether your password is with our Service or a third-party
                social media Service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You agree not to disclose your password to any third party. You must notify us immediately upon becoming
                aware of any breach of security or unauthorized use of your account.
              </p>
            </CardContent>
          </Card>

          <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="text-foreground">Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                The Service and its original content (excluding Content provided by users), features and functionality
                are and will remain the exclusive property of Limitless Infotech Solutions and its licensors. The
                Service is protected by copyright, trademark, and other laws of both the Country and foreign countries.
                Our trademarks and trade dress may not be used in connection with any product or service without the
                prior written consent of Limitless Infotech Solutions.
              </p>
            </CardContent>
          </Card>

          <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle className="text-foreground">Links To Other Web Sites</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Our Service may contain links to third-party web sites or services that are not owned or controlled by
                Limitless Infotech Solutions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Limitless Infotech Solutions has no control over, and assumes no responsibility for, the content,
                privacy policies, or practices of any third party web sites or services. You further acknowledge and
                agree that Limitless Infotech Solutions shall not be responsible or liable, directly or indirectly, for
                any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any
                such content, goods or services available on or through any such web sites or services.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We strongly advise you to read the terms and conditions and privacy policies of any third-party web
                sites or services that you visit.
              </p>
            </CardContent>
          </Card>

          <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="text-foreground">Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason
                whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Upon termination, your right to use the Service will immediately cease. If you wish to terminate your
                account, you may simply discontinue using the Service.
              </p>
            </CardContent>
          </Card>

          <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <CardHeader>
              <CardTitle className="text-foreground">Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without
                regard to its conflict of law provisions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those
                rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining
                provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us
                regarding our Service, and supersede and replace any prior agreements we might have between us regarding
                the Service.
              </p>
            </CardContent>
          </Card>

          <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <CardHeader>
              <CardTitle className="text-foreground">Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                revision is material we will try to provide at least 30 days notice prior to any new terms taking
                effect. What constitutes a material change will be determined at our sole discretion.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By continuing to access or use our Service after those revisions become effective, you agree to be bound
                by the revised terms. If you do not agree to the new terms, in whole or in part, please stop using the
                website and the Service.
              </p>
            </CardContent>
          </Card>

          <Card className="custom-card p-6 animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
            <CardHeader>
              <CardTitle className="text-foreground">Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                <li>
                  By email:{" "}
                  <Link href="mailto:legal@limitless.com" className="text-accent-blue hover:underline">
                    legal@limitless.com
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
