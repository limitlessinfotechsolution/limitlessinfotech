import { NextResponse } from "next/server"

const UPSTREAM = "https://open.er-api.com/v6/latest/USD" // fast, CORS-free JSON API

// Cache for 1 hour on the server and allow the client to cache for 10 minutes.
const ONE_HOUR = 60 * 60
const TEN_MINUTES = 60 * 10

export async function GET() {
  try {
    const res = await fetch(UPSTREAM, {
      // Revalidate on the server only once per hour
      next: { revalidate: ONE_HOUR },
    })

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch upstream rates" }, { status: 502 })
    }

    // The upstream payload shape is `{ base_code: "USD", rates: {...} }`
    const { rates } = (await res.json()) as { rates: Record<string, number> }

    return new NextResponse(JSON.stringify({ rates }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${TEN_MINUTES}`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Currency service unreachable" }, { status: 500 })
  }
}
