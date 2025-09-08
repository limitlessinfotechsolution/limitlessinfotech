import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { sendContactFormEmail } from "@/lib/email" // Assuming this utility exists
import { validateEmail, validateString } from "@/lib/validation" // Assuming this utility exists
import { rateLimit } from "@/lib/rate-limit" // Assuming this utility exists

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokens: 10, // Max 10 requests per IP per interval
})

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ||
               request.headers.get("x-real-ip") ||
               request.headers.get("cf-connecting-ip") ||
               "127.0.0.1"
    const limitReached = await limiter.check(ip)

    if (limitReached) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const { name, email, subject, message } = await request.json()

    // Basic validation
    if (!validateString(name, 2, 100)) {
      return NextResponse.json({ error: "Name is required and must be between 2-100 characters." }, { status: 400 })
    }
    if (!validateEmail(email)) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 })
    }
    if (!validateString(subject, 5, 200)) {
      return NextResponse.json({ error: "Subject is required and must be between 5-200 characters." }, { status: 400 })
    }
    if (!validateString(message, 10, 1000)) {
      return NextResponse.json(
        { error: "Message is required and must be between 10-1000 characters." },
        { status: 400 },
      )
    }

    // In a real application, you would save this to a database
    // and then send an email notification.

    console.log("Received contact form submission:", { name, email, subject, message })

    // Simulate sending an email
    await sendContactFormEmail({ name, email, subject, message })

    return NextResponse.json({ success: true, message: "Your message has been sent successfully!" }, { status: 200 })
  } catch (error) {
    console.error("Contact form submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
