import { ComprehensiveTestFramework } from "./test-framework"

async function runTests() {
  const baseUrl = process.argv[2] || "http://localhost:3000"

  console.log(`🔍 Testing website: ${baseUrl}`)
  console.log("=".repeat(50))

  const testFramework = new ComprehensiveTestFramework(baseUrl)

  try {
    const report = await testFramework.runAllTests()

    // Save report to file
    const fs = require("fs")
    const reportPath = `test-report-${new Date().toISOString().split("T")[0]}.json`
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

    console.log(`\n📄 Full report saved to: ${reportPath}`)

    // Exit with error code if tests failed
    if (report.summary.failed > 0) {
      process.exit(1)
    }
  } catch (error) {
    console.error("❌ Test execution failed:", error)
    process.exit(1)
  }
}

runTests()
