import fetch from "node-fetch" // Use node-fetch for server-side fetch in Node.js scripts
import { URL } from "url"

interface HealthCheckResult {
  endpoint: string
  status: "PASS" | "FAIL"
  statusCode?: number
  message: string
  responseTimeMs?: number
  error?: string
}

async function runHealthCheck(baseUrl: string): Promise<HealthCheckResult[]> {
  const results: HealthCheckResult[] = []

  const endpointsToTest = [
    "/", // Homepage
    "/api/health", // Backend health endpoint
    "/api/auth/me", // Authentication check (should return unauthenticated if no token)
    "/api/contact", // Contact form API (POST, but can check GET availability)
    "/cpanel", // CPanel page
    "/about", // A static marketing page
    "/public/placeholder.svg", // Static asset check
  ]

  for (const endpoint of endpointsToTest) {
    const fullUrl = new URL(endpoint, baseUrl).toString()
    const startTime = process.hrtime.bigint()
    try {
      const response = await fetch(fullUrl, { method: "GET", timeout: 5000 }) // 5-second timeout
      const endTime = process.hrtime.bigint()
      const responseTimeMs = Number(endTime - startTime) / 1_000_000

      if (response.ok) {
        results.push({
          endpoint: fullUrl,
          status: "PASS",
          statusCode: response.status,
          message: "Successfully reached endpoint.",
          responseTimeMs,
        })
      } else {
        results.push({
          endpoint: fullUrl,
          status: "FAIL",
          statusCode: response.status,
          message: `Endpoint returned non-OK status: ${response.status} ${response.statusText}`,
          responseTimeMs,
        })
      }
    } catch (error: any) {
      const endTime = process.hrtime.bigint()
      const responseTimeMs = Number(endTime - startTime) / 1_000_000
      results.push({
        endpoint: fullUrl,
        status: "FAIL",
        message: `Failed to connect or request timed out: ${error.message}`,
        responseTimeMs,
        error: error.message,
      })
    }
  }

  return results
}

async function main() {
  const baseUrl = process.argv[2] || "http://localhost:3000" // Default to localhost if no argument

  if (!baseUrl) {
    console.error("Usage: ts-node health-check.ts <your_app_url>")
    process.exit(1)
  }

  console.log(`Running health checks for: ${baseUrl}`)
  const checkResults = await runHealthCheck(baseUrl)

  let allPassed = true
  console.log("\n--- Health Check Report ---")
  checkResults.forEach((result) => {
    const statusIcon = result.status === "PASS" ? "✅" : "❌"
    console.log(`${statusIcon} ${result.endpoint}`)
    console.log(`   Status: ${result.status}`)
    if (result.statusCode) {
      console.log(`   HTTP Status Code: ${result.statusCode}`)
    }
    console.log(`   Message: ${result.message}`)
    if (result.responseTimeMs) {
      console.log(`   Response Time: ${result.responseTimeMs.toFixed(2)} ms`)
    }
    if (result.error) {
      console.log(`   Error Details: ${result.error}`)
    }
    console.log("-------------------------")

    if (result.status === "FAIL") {
      allPassed = false
    }
  })

  if (allPassed) {
    console.log("\n🎉 All health checks passed successfully!")
    process.exit(0)
  } else {
    console.error("\n🚨 Some health checks failed. Please investigate.")
    process.exit(1)
  }
}

// Only run main if executed directly
if (require.main === module) {
  main().catch(console.error)
}
