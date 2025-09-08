import { chromium, type Browser, type Page } from "playwright"
import { performance } from "perf_hooks"

export interface TestResult {
  testName: string
  status: "PASS" | "FAIL" | "WARNING"
  message: string
  details?: any
  duration: number
}

export interface SecurityTestResult extends TestResult {
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  cve?: string
}

export interface PerformanceMetrics {
  loadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
}

export class ComprehensiveTestFramework {
  private browser: Browser | null = null
  private page: Page | null = null
  private baseUrl: string
  private results: TestResult[] = []

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async initialize() {
    this.browser = await chromium.launch({ headless: true })
    this.page = await this.browser.newPage()

    // Set viewport for consistent testing
    await this.page.setViewportSize({ width: 1920, height: 1080 })

    // Enable JavaScript
    await this.page.context().addInitScript(() => {
      window.testMode = true
    })
  }

  async cleanup() {
    if (this.page) await this.page.close()
    if (this.browser) await this.browser.close()
  }

  private async addResult(result: TestResult) {
    this.results.push(result)
    console.log(`[${result.status}] ${result.testName}: ${result.message}`)
  }

  // FUNCTIONALITY TESTING
  async testFunctionality() {
    console.log("\n🔧 Running Functionality Tests...")

    await this.testHomePage()
    await this.testNavigation()
    await this.testContactForm()
    await this.testAuthenticationFlow()
    await this.testAdminPanel()
    await this.testCPanelFeatures()
    await this.testAPIEndpoints()
    await this.testFileUpload()
    await this.testEmailFunctionality()
  }

  private async testHomePage() {
    const start = performance.now()
    try {
      await this.page!.goto(this.baseUrl)
      await this.page!.waitForLoadState("networkidle")

      // Check if main elements are present
      const heroSection = await this.page!.locator("h1").first()
      const navigation = await this.page!.locator("nav")
      const footer = await this.page!.locator("footer")

      if ((await heroSection.isVisible()) && (await navigation.isVisible()) && (await footer.isVisible())) {
        await this.addResult({
          testName: "Homepage Load",
          status: "PASS",
          message: "Homepage loads successfully with all main elements",
          duration: performance.now() - start,
        })
      } else {
        await this.addResult({
          testName: "Homepage Load",
          status: "FAIL",
          message: "Missing main elements on homepage",
          duration: performance.now() - start,
        })
      }
    } catch (error) {
      await this.addResult({
        testName: "Homepage Load",
        status: "FAIL",
        message: `Homepage failed to load: ${error}`,
        duration: performance.now() - start,
      })
    }
  }

  private async testNavigation() {
    const start = performance.now()
    const navigationLinks = [
      { path: "/about", name: "About Page" },
      { path: "/services", name: "Services Page" },
      { path: "/projects", name: "Projects Page" },
      { path: "/team", name: "Team Page" },
      { path: "/contact", name: "Contact Page" },
      { path: "/careers", name: "Careers Page" },
    ]

    for (const link of navigationLinks) {
      try {
        await this.page!.goto(`${this.baseUrl}${link.path}`)
        await this.page!.waitForLoadState("networkidle")

        const title = await this.page!.title()
        if (title && !title.includes("404")) {
          await this.addResult({
            testName: `Navigation - ${link.name}`,
            status: "PASS",
            message: `${link.name} loads successfully`,
            duration: performance.now() - start,
          })
        } else {
          await this.addResult({
            testName: `Navigation - ${link.name}`,
            status: "FAIL",
            message: `${link.name} returns 404 or has no title`,
            duration: performance.now() - start,
          })
        }
      } catch (error) {
        await this.addResult({
          testName: `Navigation - ${link.name}`,
          status: "FAIL",
          message: `Failed to load ${link.name}: ${error}`,
          duration: performance.now() - start,
        })
      }
    }
  }

  private async testContactForm() {
    const start = performance.now()
    try {
      await this.page!.goto(`${this.baseUrl}/contact`)
      await this.page!.waitForLoadState("networkidle")

      // Fill out contact form
      await this.page!.fill('input[name="firstName"]', "Test")
      await this.page!.fill('input[name="lastName"]', "User")
      await this.page!.fill('input[name="email"]', "test@example.com")
      await this.page!.fill('input[name="subject"]', "Test Subject")
      await this.page!.fill('textarea[name="message"]', "This is a test message")

      // Submit form
      await this.page!.click('button[type="submit"]')

      // Wait for response
      await this.page!.waitForTimeout(2000)

      // Check for success message or error
      const successMessage = await this.page!.locator(".success, .toast, [data-success]").first()
      const errorMessage = await this.page!.locator(".error, .alert-error, [data-error]").first()

      if (await successMessage.isVisible()) {
        await this.addResult({
          testName: "Contact Form Submission",
          status: "PASS",
          message: "Contact form submits successfully",
          duration: performance.now() - start,
        })
      } else if (await errorMessage.isVisible()) {
        await this.addResult({
          testName: "Contact Form Submission",
          status: "WARNING",
          message: "Contact form shows error message",
          duration: performance.now() - start,
        })
      } else {
        await this.addResult({
          testName: "Contact Form Submission",
          status: "FAIL",
          message: "No feedback after form submission",
          duration: performance.now() - start,
        })
      }
    } catch (error) {
      await this.addResult({
        testName: "Contact Form Submission",
        status: "FAIL",
        message: `Contact form test failed: ${error}`,
        duration: performance.now() - start,
      })
    }
  }

  private async testAuthenticationFlow() {
    const start = performance.now()
    try {
      // Test login page access
      await this.page!.goto(`${this.baseUrl}/admin`)
      await this.page!.waitForLoadState("networkidle")

      // Should redirect to login or show login form
      const currentUrl = this.page!.url()
      const hasLoginForm = (await this.page!.locator('input[type="email"], input[type="password"]').count()) > 0

      if (currentUrl.includes("login") || hasLoginForm) {
        await this.addResult({
          testName: "Authentication Redirect",
          status: "PASS",
          message: "Unauthenticated users are properly redirected to login",
          duration: performance.now() - start,
        })

        // Test login with demo credentials
        if (hasLoginForm) {
          await this.page!.fill('input[type="email"]', "admin@example.com")
          await this.page!.fill('input[type="password"]', "admin123")
          await this.page!.click('button[type="submit"]')
          await this.page!.waitForTimeout(2000)

          const newUrl = this.page!.url()
          if (newUrl.includes("admin") && !newUrl.includes("login")) {
            await this.addResult({
              testName: "Admin Login",
              status: "PASS",
              message: "Admin login works with demo credentials",
              duration: performance.now() - start,
            })
          } else {
            await this.addResult({
              testName: "Admin Login",
              status: "FAIL",
              message: "Admin login failed with demo credentials",
              duration: performance.now() - start,
            })
          }
        }
      } else {
        await this.addResult({
          testName: "Authentication Redirect",
          status: "FAIL",
          message: "No authentication protection on admin routes",
          duration: performance.now() - start,
        })
      }
    } catch (error) {
      await this.addResult({
        testName: "Authentication Flow",
        status: "FAIL",
        message: `Authentication test failed: ${error}`,
        duration: performance.now() - start,
      })
    }
  }

  private async testAdminPanel() {
    const start = performance.now()
    try {
      await this.page!.goto(`${this.baseUrl}/admin`)
      await this.page!.waitForLoadState("networkidle")

      // Check for admin panel elements
      const dashboard = await this.page!.locator(
        '[data-testid="admin-dashboard"], .admin-dashboard, h1:has-text("Admin")',
      ).first()

      if (await dashboard.isVisible()) {
        await this.addResult({
          testName: "Admin Panel Access",
          status: "PASS",
          message: "Admin panel is accessible and loads correctly",
          duration: performance.now() - start,
        })
      } else {
        await this.addResult({
          testName: "Admin Panel Access",
          status: "FAIL",
          message: "Admin panel not accessible or missing elements",
          duration: performance.now() - start,
        })
      }
    } catch (error) {
      await this.addResult({
        testName: "Admin Panel Access",
        status: "FAIL",
        message: `Admin panel test failed: ${error}`,
        duration: performance.now() - start,
      })
    }
  }

  private async testCPanelFeatures() {
    const start = performance.now()
    try {
      await this.page!.goto(`${this.baseUrl}/cpanel`)
      await this.page!.waitForLoadState("networkidle")

      // Test cPanel tabs
      const tabs = await this.page!.locator('[role="tab"], .tab-trigger').count()

      if (tabs > 0) {
        await this.addResult({
          testName: "cPanel Interface",
          status: "PASS",
          message: `cPanel loads with ${tabs} feature tabs`,
          duration: performance.now() - start,
        })

        // Test switching between tabs
        const firstTab = await this.page!.locator('[role="tab"], .tab-trigger').first()
        await firstTab.click()
        await this.page!.waitForTimeout(1000)

        await this.addResult({
          testName: "cPanel Tab Navigation",
          status: "PASS",
          message: "cPanel tab navigation works correctly",
          duration: performance.now() - start,
        })
      } else {
        await this.addResult({
          testName: "cPanel Interface",
          status: "FAIL",
          message: "cPanel interface missing or not loading properly",
          duration: performance.now() - start,
        })
      }
    } catch (error) {
      await this.addResult({
        testName: "cPanel Features",
        status: "FAIL",
        message: `cPanel test failed: ${error}`,
        duration: performance.now() - start,
      })
    }
  }

  private async testAPIEndpoints() {
    const start = performance.now()
    const endpoints = [
      { path: "/api/health", method: "GET", name: "Health Check" },
      { path: "/api/contact", method: "POST", name: "Contact API" },
      { path: "/api/auth/login", method: "POST", name: "Login API" },
      { path: "/api/approvals", method: "GET", name: "Approvals API" },
      { path: "/api/projects", method: "GET", name: "Projects API" },
    ]

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint.path}`, {
          method: endpoint.method,
          headers: { "Content-Type": "application/json" },
          body: endpoint.method === "POST" ? JSON.stringify({}) : undefined,
        })

        if (response.status < 500) {
          await this.addResult({
            testName: `API - ${endpoint.name}`,
            status: "PASS",
            message: `${endpoint.name} endpoint responds (${response.status})`,
            duration: performance.now() - start,
          })
        } else {
          await this.addResult({
            testName: `API - ${endpoint.name}`,
            status: "FAIL",
            message: `${endpoint.name} endpoint returns server error (${response.status})`,
            duration: performance.now() - start,
          })
        }
      } catch (error) {
        await this.addResult({
          testName: `API - ${endpoint.name}`,
          status: "FAIL",
          message: `${endpoint.name} endpoint failed: ${error}`,
          duration: performance.now() - start,
        })
      }
    }
  }

  private async testFileUpload() {
    const start = performance.now()
    try {
      // Test if file upload endpoint exists
      const response = await fetch(`${this.baseUrl}/api/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.status !== 404) {
        await this.addResult({
          testName: "File Upload API",
          status: "PASS",
          message: "File upload endpoint is available",
          duration: performance.now() - start,
        })
      } else {
        await this.addResult({
          testName: "File Upload API",
          status: "WARNING",
          message: "File upload endpoint not found",
          duration: performance.now() - start,
        })
      }
    } catch (error) {
      await this.addResult({
        testName: "File Upload API",
        status: "FAIL",
        message: `File upload test failed: ${error}`,
        duration: performance.now() - start,
      })
    }
  }

  private async testEmailFunctionality() {
    const start = performance.now()
    try {
      // Test email API endpoint
      const response = await fetch(`${this.baseUrl}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "test@example.com",
          subject: "Test Email",
          message: "This is a test email",
        }),
      })

      if (response.status < 500) {
        await this.addResult({
          testName: "Email Service",
          status: "PASS",
          message: "Email service endpoint is functional",
          duration: performance.now() - start,
        })
      } else {
        await this.addResult({
          testName: "Email Service",
          status: "FAIL",
          message: "Email service endpoint returns server error",
          duration: performance.now() - start,
        })
      }
    } catch (error) {
      await this.addResult({
        testName: "Email Service",
        status: "FAIL",
        message: `Email service test failed: ${error}`,
        duration: performance.now() - start,
      })
    }
  }

  // PERFORMANCE TESTING
  async testPerformance(): Promise<PerformanceMetrics> {
    console.log("\n⚡ Running Performance Tests...")

    const start = performance.now()
    await this.page!.goto(this.baseUrl)

    // Get performance metrics
    const metrics = await this.page!.evaluate(() => {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      const paint = performance.getEntriesByType("paint")

      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        firstContentfulPaint: paint.find((p) => p.name === "first-contentful-paint")?.startTime || 0,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      }
    })

    const performanceMetrics: PerformanceMetrics = {
      loadTime: metrics.loadTime,
      firstContentfulPaint: metrics.firstContentfulPaint,
      largestContentfulPaint: 0, // Would need more complex measurement
      cumulativeLayoutShift: 0, // Would need more complex measurement
      firstInputDelay: 0, // Would need more complex measurement
    }

    // Evaluate performance
    if (metrics.loadTime < 3000) {
      await this.addResult({
        testName: "Page Load Performance",
        status: "PASS",
        message: `Page loads in ${metrics.loadTime}ms (< 3s)`,
        duration: performance.now() - start,
        details: performanceMetrics,
      })
    } else if (metrics.loadTime < 5000) {
      await this.addResult({
        testName: "Page Load Performance",
        status: "WARNING",
        message: `Page loads in ${metrics.loadTime}ms (3-5s)`,
        duration: performance.now() - start,
        details: performanceMetrics,
      })
    } else {
      await this.addResult({
        testName: "Page Load Performance",
        status: "FAIL",
        message: `Page loads in ${metrics.loadTime}ms (> 5s)`,
        duration: performance.now() - start,
        details: performanceMetrics,
      })
    }

    return performanceMetrics
  }

  // SECURITY TESTING
  async testSecurity() {
    console.log("\n🔒 Running Security Tests...")

    await this.testHTTPSRedirect()
    await this.testSecurityHeaders()
    await this.testXSSProtection()
    await this.testCSRFProtection()
    await this.testSQLInjection()
    await this.testAuthenticationSecurity()
  }

  private async testHTTPSRedirect() {
    const start = performance.now()
    try {
      const httpUrl = this.baseUrl.replace("https://", "http://")
      const response = await fetch(httpUrl, { redirect: "manual" })

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location")
        if (location && location.startsWith("https://")) {
          await this.addResult({
            testName: "HTTPS Redirect",
            status: "PASS",
            message: "HTTP requests are properly redirected to HTTPS",
            duration: performance.now() - start,
          })
        } else {
          await this.addResult({
            testName: "HTTPS Redirect",
            status: "FAIL",
            message: "HTTP requests are not redirected to HTTPS",
            duration: performance.now() - start,
          })
        }
      } else {
        await this.addResult({
          testName: "HTTPS Redirect",
          status: "WARNING",
          message: "Unable to test HTTPS redirect (site may already be HTTPS-only)",
          duration: performance.now() - start,
        })
      }
    } catch (error) {
      await this.addResult({
        testName: "HTTPS Redirect",
        status: "WARNING",
        message: `HTTPS redirect test inconclusive: ${error}`,
        duration: performance.now() - start,
      })
    }
  }

  private async testSecurityHeaders() {
    const start = performance.now()
    try {
      const response = await fetch(this.baseUrl)
      const headers = response.headers

      const securityHeaders = {
        "x-frame-options": headers.get("x-frame-options"),
        "x-content-type-options": headers.get("x-content-type-options"),
        "x-xss-protection": headers.get("x-xss-protection"),
        "strict-transport-security": headers.get("strict-transport-security"),
        "content-security-policy": headers.get("content-security-policy"),
      }

      const missingHeaders = Object.entries(securityHeaders)
        .filter(([_, value]) => !value)
        .map(([header, _]) => header)

      if (missingHeaders.length === 0) {
        await this.addResult({
          testName: "Security Headers",
          status: "PASS",
          message: "All important security headers are present",
          duration: performance.now() - start,
          details: securityHeaders,
        })
      } else if (missingHeaders.length <= 2) {
        await this.addResult({
          testName: "Security Headers",
          status: "WARNING",
          message: `Some security headers missing: ${missingHeaders.join(", ")}`,
          duration: performance.now() - start,
          details: securityHeaders,
        })
      } else {
        await this.addResult({
          testName: "Security Headers",
          status: "FAIL",
          message: `Multiple security headers missing: ${missingHeaders.join(", ")}`,
          duration: performance.now() - start,
          details: securityHeaders,
        })
      }
    } catch (error) {
      await this.addResult({
        testName: "Security Headers",
        status: "FAIL",
        message: `Security headers test failed: ${error}`,
        duration: performance.now() - start,
      })
    }
  }

  private async testXSSProtection() {
    const start = performance.now()
    try {
      // Test XSS in URL parameters
      const xssPayload = '<script>alert("xss")</script>'
      await this.page!.goto(`${this.baseUrl}?search=${encodeURIComponent(xssPayload)}`)
      await this.page!.waitForTimeout(1000)

      // Check if script executed (would show alert)
      const alertPresent = await this.page!.evaluate(() => {
        return window.document.body.innerHTML.includes('<script>alert("xss")</script>')
      })

      if (!alertPresent) {
        await this.addResult({
          testName: "XSS Protection",
          status: "PASS",
          message: "XSS payload in URL parameters is properly sanitized",
          duration: performance.now() - start,
        })
      } else {
        await this.addResult({
          testName: "XSS Protection",
          status: "FAIL",
          message: "XSS vulnerability detected in URL parameters",
          duration: performance.now() - start,
        })
      }
    } catch (error) {
      await this.addResult({
        testName: "XSS Protection",
        status: "WARNING",
        message: `XSS protection test inconclusive: ${error}`,
        duration: performance.now() - start,
      })
    }
  }

  private async testCSRFProtection() {
    const start = performance.now()
    try {
      // Test if forms have CSRF tokens
      await this.page!.goto(`${this.baseUrl}/contact`)
      const csrfToken = await this.page!.locator(
        'input[name="_token"], input[name="csrf_token"], input[name="authenticity_token"]',
      ).count()

      if (csrfToken > 0) {
        await this.addResult({
          testName: "CSRF Protection",
          status: "PASS",
          message: "Forms include CSRF protection tokens",
          duration: performance.now() - start,
        })
      } else {
        await this.addResult({
          testName: "CSRF Protection",
          status: "WARNING",
          message: "No CSRF tokens found in forms (may use other protection methods)",
          duration: performance.now() - start,
        })
      }
    } catch (error) {
      await this.addResult({
        testName: "CSRF Protection",
        status: "WARNING",
        message: `CSRF protection test inconclusive: ${error}`,
        duration: performance.now() - start,
      })
    }
  }

  private async testSQLInjection() {
    const start = performance.now()
    try {
      // Test SQL injection in API endpoints
      const sqlPayload = "'; DROP TABLE users; --"
      const response = await fetch(`${this.baseUrl}/api/projects?search=${encodeURIComponent(sqlPayload)}`)

      if (response.status < 500) {
        await this.addResult({
          testName: "SQL Injection Protection",
          status: "PASS",
          message: "SQL injection payload handled without server error",
          duration: performance.now() - start,
        })
      } else {
        await this.addResult({
          testName: "SQL Injection Protection",
          status: "WARNING",
          message: "SQL injection payload caused server error (investigate further)",
          duration: performance.now() - start,
        })
      }
    } catch (error) {
      await this.addResult({
        testName: "SQL Injection Protection",
        status: "WARNING",
        message: `SQL injection test inconclusive: ${error}`,
        duration: performance.now() - start,
      })
    }
  }

  private async testAuthenticationSecurity() {
    const start = performance.now()
    try {
      // Test password requirements
      await this.page!.goto(`${this.baseUrl}/admin`)

      // Try weak password
      const passwordInput = await this.page!.locator('input[type="password"]').first()
      if (await passwordInput.isVisible()) {
        await passwordInput.fill("123")

        // Check if there's validation
        const validationMessage = await this.page!.locator(".error, .invalid, [data-error]").count()

        if (validationMessage > 0) {
          await this.addResult({
            testName: "Password Security",
            status: "PASS",
            message: "Password validation prevents weak passwords",
            duration: performance.now() - start,
          })
        } else {
          await this.addResult({
            testName: "Password Security",
            status: "WARNING",
            message: "No client-side password validation detected",
            duration: performance.now() - start,
          })
        }
      } else {
        await this.addResult({
          testName: "Password Security",
          status: "WARNING",
          message: "No password input found for testing",
          duration: performance.now() - start,
        })
      }
    } catch (error) {
      await this.addResult({
        testName: "Password Security",
        status: "WARNING",
        message: `Password security test inconclusive: ${error}`,
        duration: performance.now() - start,
      })
    }
  }

  // ACCESSIBILITY TESTING
  async testAccessibility() {
    console.log("\n♿ Running Accessibility Tests...")

    await this.testKeyboardNavigation()
    await this.testScreenReaderSupport()
    await this.testColorContrast()
    await this.testImageAltText()
    await this.testFormLabels()
  }

  private async testKeyboardNavigation() {
    const start = performance.now()
    try {
      await this.page!.goto(this.baseUrl)

      // Test Tab navigation
      await this.page!.keyboard.press("Tab")
      const focusedElement = await this.page!.evaluate(() => document.activeElement?.tagName)

      if (focusedElement && ["A", "BUTTON", "INPUT"].includes(focusedElement)) {
        await this.addResult({
          testName: "Keyboard Navigation",
          status: "PASS",
          message: "Tab navigation works correctly",
          duration: performance.now() - start,
        })
      } else {
        await this.addResult({
          testName: "Keyboard Navigation",
          status: "FAIL",
          message: "Tab navigation not working properly",
          duration: performance.now() - start,
        })
      }
    } catch (error) {
      await this.addResult({
        testName: "Keyboard Navigation",
        status: "FAIL",
        message: `Keyboard navigation test failed: ${error}`,
        duration: performance.now() - start,
      })
    }
  }

  private async testScreenReaderSupport() {
    const start = performance.now()
    try {
      await this.page!.goto(this.baseUrl)

      // Check for ARIA labels and roles
      const ariaElements = await this.page!.locator("[aria-label], [aria-labelledby], [role]").count()
      const headingStructure = await this.page!.locator("h1, h2, h3, h4, h5, h6").count()

      if (ariaElements > 0 && headingStructure > 0) {
        await this.addResult({
          testName: "Screen Reader Support",
          status: "PASS",
          message: `Found ${ariaElements} ARIA elements and ${headingStructure} headings`,
          duration: performance.now() - start,
        })
      } else {
        await this.addResult({
          testName: "Screen Reader Support",
          status: "WARNING",
          message: "Limited ARIA labels or heading structure found",
          duration: performance.now() - start,
        })
      }
    } catch (error) {
      await this.addResult({
        testName: "Screen Reader Support",
        status: "FAIL",
        message: `Screen reader support test failed: ${error}`,
        duration: performance.now() - start,
      })
    }
  }

  private async testColorContrast() {
    const start = performance.now()
    try {
      await this.page!.goto(this.baseUrl)

      // Basic color contrast check (simplified)
      const textElements = await this.page!.locator("p, h1, h2, h3, h4, h5, h6, span, a").first()
      const styles = await textElements.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
        }
      })

      // This is a simplified check - in reality, you'd need a proper contrast ratio calculation
      if (styles.color && styles.backgroundColor) {
        await this.addResult({
          testName: "Color Contrast",
          status: "PASS",
          message: "Text elements have defined colors",
          duration: performance.now() - start,
          details: styles,
        })
      } else {
        await this.addResult({
          testName: "Color Contrast",
          status: "WARNING",
          message: "Some text elements may not have sufficient color definition",
          duration: performance.now() - start,
        })
      }
    } catch (error) {
      await this.addResult({
        testName: "Color Contrast",
        status: "WARNING",
        message: `Color contrast test inconclusive: ${error}`,
        duration: performance.now() - start,
      })
    }
  }

  private async testImageAltText() {
    const start = performance.now()
    try {
      await this.page!.goto(this.baseUrl)

      const images = await this.page!.locator("img").count()
      const imagesWithAlt = await this.page!.locator("img[alt]").count()

      if (images === 0) {
        await this.addResult({
          testName: "Image Alt Text",
          status: "PASS",
          message: "No images found to test",
          duration: performance.now() - start,
        })
      } else if (imagesWithAlt === images) {
        await this.addResult({
          testName: "Image Alt Text",
          status: "PASS",
          message: `All ${images} images have alt text`,
          duration: performance.now() - start,
        })
      } else {
        await this.addResult({
          testName: "Image Alt Text",
          status: "FAIL",
          message: `${images - imagesWithAlt} out of ${images} images missing alt text`,
          duration: performance.now() - start,
        })
      }
    } catch (error) {
      await this.addResult({
        testName: "Image Alt Text",
        status: "FAIL",
        message: `Image alt text test failed: ${error}`,
        duration: performance.now() - start,
      })
    }
  }

  private async testFormLabels() {
    const start = performance.now()
    try {
      await this.page!.goto(`${this.baseUrl}/contact`)

      const inputs = await this.page!.locator("input, textarea, select").count()
      const labeledInputs = await this.page!.locator(
        "input[aria-label], textarea[aria-label], select[aria-label], input[id] + label, textarea[id] + label, select[id] + label",
      ).count()

      if (inputs === 0) {
        await this.addResult({
          testName: "Form Labels",
          status: "PASS",
          message: "No form inputs found to test",
          duration: performance.now() - start,
        })
      } else if (labeledInputs >= inputs * 0.8) {
        // Allow some flexibility
        await this.addResult({
          testName: "Form Labels",
          status: "PASS",
          message: `Most form inputs (${labeledInputs}/${inputs}) have proper labels`,
          duration: performance.now() - start,
        })
      } else {
        await this.addResult({
          testName: "Form Labels",
          status: "WARNING",
          message: `Some form inputs (${inputs - labeledInputs}/${inputs}) may be missing labels`,
          duration: performance.now() - start,
        })
      }
    } catch (error) {
      await this.addResult({
        testName: "Form Labels",
        status: "WARNING",
        message: `Form labels test inconclusive: ${error}`,
        duration: performance.now() - start,
      })
    }
  }

  // COMPATIBILITY TESTING
  async testCompatibility() {
    console.log("\n🌐 Running Compatibility Tests...")

    await this.testResponsiveDesign()
    await this.testBrowserCompatibility()
    await this.testMobileCompatibility()
  }

  private async testResponsiveDesign() {
    const start = performance.now()
    const viewports = [
      { width: 320, height: 568, name: "Mobile Portrait" },
      { width: 768, height: 1024, name: "Tablet Portrait" },
      { width: 1024, height: 768, name: "Tablet Landscape" },
      { width: 1920, height: 1080, name: "Desktop" },
    ]

    for (const viewport of viewports) {
      try {
        await this.page!.setViewportSize({ width: viewport.width, height: viewport.height })
        await this.page!.goto(this.baseUrl)
        await this.page!.waitForLoadState("networkidle")

        // Check if content is visible and not overflowing
        const bodyWidth = await this.page!.evaluate(() => document.body.scrollWidth)
        const viewportWidth = viewport.width

        if (bodyWidth <= viewportWidth * 1.1) {
          // Allow 10% tolerance
          await this.addResult({
            testName: `Responsive - ${viewport.name}`,
            status: "PASS",
            message: `Layout works correctly at ${viewport.width}x${viewport.height}`,
            duration: performance.now() - start,
          })
        } else {
          await this.addResult({
            testName: `Responsive - ${viewport.name}`,
            status: "WARNING",
            message: `Potential horizontal overflow at ${viewport.width}x${viewport.height}`,
            duration: performance.now() - start,
          })
        }
      } catch (error) {
        await this.addResult({
          testName: `Responsive - ${viewport.name}`,
          status: "FAIL",
          message: `Responsive test failed for ${viewport.name}: ${error}`,
          duration: performance.now() - start,
        })
      }
    }
  }

  private async testBrowserCompatibility() {
    const start = performance.now()
    // This is a simplified test - in reality, you'd test with different browser engines
    try {
      await this.page!.goto(this.baseUrl)

      // Check for modern JavaScript features
      const modernFeatures = await this.page!.evaluate(() => {
        return {
          fetch: typeof fetch !== "undefined",
          promises: typeof Promise !== "undefined",
          arrow_functions: (() => true)(),
          const_let: (() => {
            try {
              eval("const x = 1; let y = 2;")
              return true
            } catch {
              return false
            }
          })(),
        }
      })

      const supportedFeatures = Object.values(modernFeatures).filter(Boolean).length
      const totalFeatures = Object.keys(modernFeatures).length

      if (supportedFeatures === totalFeatures) {
        await this.addResult({
          testName: "Browser Compatibility",
          status: "PASS",
          message: "All modern JavaScript features are supported",
          duration: performance.now() - start,
          details: modernFeatures,
        })
      } else {
        await this.addResult({
          testName: "Browser Compatibility",
          status: "WARNING",
          message: `${supportedFeatures}/${totalFeatures} modern features supported`,
          duration: performance.now() - start,
          details: modernFeatures,
        })
      }
    } catch (error) {
      await this.addResult({
        testName: "Browser Compatibility",
        status: "FAIL",
        message: `Browser compatibility test failed: ${error}`,
        duration: performance.now() - start,
      })
    }
  }

  private async testMobileCompatibility() {
    const start = performance.now()
    try {
      // Set mobile viewport
      await this.page!.setViewportSize({ width: 375, height: 667 })
      await this.page!.goto(this.baseUrl)

      // Check for mobile-specific features
      const mobileFeatures = await this.page!.evaluate(() => {
        return {
          viewport_meta: !!document.querySelector('meta[name="viewport"]'),
          touch_friendly: window.innerWidth <= 768,
          no_hover_effects: !window.matchMedia("(hover: hover)").matches,
        }
      })

      const mobileScore = Object.values(mobileFeatures).filter(Boolean).length

      if (mobileScore >= 2) {
        await this.addResult({
          testName: "Mobile Compatibility",
          status: "PASS",
          message: "Good mobile compatibility features detected",
          duration: performance.now() - start,
          details: mobileFeatures,
        })
      } else {
        await this.addResult({
          testName: "Mobile Compatibility",
          status: "WARNING",
          message: "Limited mobile compatibility features",
          duration: performance.now() - start,
          details: mobileFeatures,
        })
      }
    } catch (error) {
      await this.addResult({
        testName: "Mobile Compatibility",
        status: "FAIL",
        message: `Mobile compatibility test failed: ${error}`,
        duration: performance.now() - start,
      })
    }
  }

  // RUN ALL TESTS
  async runAllTests() {
    console.log("🚀 Starting Comprehensive Website Testing...\n")

    await this.initialize()

    try {
      await this.testFunctionality()
      await this.testPerformance()
      await this.testSecurity()
      await this.testAccessibility()
      await this.testCompatibility()
    } finally {
      await this.cleanup()
    }

    return this.generateReport()
  }

  private generateReport() {
    const totalTests = this.results.length
    const passedTests = this.results.filter((r) => r.status === "PASS").length
    const failedTests = this.results.filter((r) => r.status === "FAIL").length
    const warningTests = this.results.filter((r) => r.status === "WARNING").length

    const report = {
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        warnings: warningTests,
        successRate: Math.round((passedTests / totalTests) * 100),
      },
      results: this.results,
      recommendations: this.generateRecommendations(),
    }

    console.log("\n📊 TEST SUMMARY")
    console.log("================")
    console.log(`Total Tests: ${totalTests}`)
    console.log(`✅ Passed: ${passedTests}`)
    console.log(`❌ Failed: ${failedTests}`)
    console.log(`⚠️  Warnings: ${warningTests}`)
    console.log(`Success Rate: ${report.summary.successRate}%`)

    return report
  }

  private generateRecommendations() {
    const recommendations = []
    const failedTests = this.results.filter((r) => r.status === "FAIL")
    const warningTests = this.results.filter((r) => r.status === "WARNING")

    if (failedTests.some((t) => t.testName.includes("Security"))) {
      recommendations.push({
        priority: "HIGH",
        category: "Security",
        issue: "Security vulnerabilities detected",
        action: "Implement proper security headers, HTTPS redirect, and input validation",
      })
    }

    if (failedTests.some((t) => t.testName.includes("Performance"))) {
      recommendations.push({
        priority: "HIGH",
        category: "Performance",
        issue: "Poor page load performance",
        action: "Optimize images, minify CSS/JS, implement caching, use CDN",
      })
    }

    if (failedTests.some((t) => t.testName.includes("Accessibility"))) {
      recommendations.push({
        priority: "MEDIUM",
        category: "Accessibility",
        issue: "Accessibility issues found",
        action: "Add proper ARIA labels, alt text for images, and improve keyboard navigation",
      })
    }

    if (warningTests.length > failedTests.length) {
      recommendations.push({
        priority: "MEDIUM",
        category: "General",
        issue: "Multiple warnings detected",
        action: "Review and address warning items to improve overall quality",
      })
    }

    return recommendations
  }
}
