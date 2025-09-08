import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AuthService } from "@/lib/auth"

interface KeywordRanking {
  id: string
  keyword: string
  rank: number
  previousRank: number
  url: string
  lastChecked: string
}

interface SiteAuditIssue {
  id: string
  type: "error" | "warning" | "info"
  category: string
  description: string
  pagesAffected: number
  status: "open" | "resolved"
}

// Mock data for SEO tools
const mockKeywordRankings: KeywordRanking[] = [
  {
    id: "kw_1",
    keyword: "web development services",
    rank: 3,
    previousRank: 5,
    url: "https://limitlessinfotech.com/services/web-development",
    lastChecked: "2024-07-10T10:00:00Z",
  },
  {
    id: "kw_2",
    keyword: "custom software solutions",
    rank: 7,
    previousRank: 6,
    url: "https://limitlessinfotech.com/services/custom-software",
    lastChecked: "2024-07-10T10:00:00Z",
  },
  {
    id: "kw_3",
    keyword: "crm management app",
    rank: 1,
    previousRank: 1,
    url: "https://limitlessinfotech.com/services/crm-solutions",
    lastChecked: "2024-07-10T10:00:00Z",
  },
  {
    id: "kw_4",
    keyword: "mobile app development company",
    rank: 12,
    previousRank: 10,
    url: "https://limitlessinfotech.com/services/mobile-app-development",
    lastChecked: "2024-07-10T10:00:00Z",
  },
]

const mockSiteAuditIssues: SiteAuditIssue[] = [
  {
    id: "audit_1",
    type: "error",
    category: "Broken Links",
    description: "404 error on internal link to /old-page",
    pagesAffected: 1,
    status: "open",
  },
  {
    id: "audit_2",
    type: "warning",
    category: "Missing Meta Descriptions",
    description: "Pages without meta descriptions may have lower CTR.",
    pagesAffected: 5,
    status: "open",
  },
  {
    id: "audit_3",
    type: "info",
    category: "Image Optimization",
    description: "Some images are not optimized for web, impacting load time.",
    pagesAffected: 15,
    status: "open",
  },
  {
    id: "audit_4",
    type: "error",
    category: "Duplicate Content",
    description: "Identical content found on /page-a and /page-b.",
    pagesAffected: 2,
    status: "resolved",
  },
]

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const user = await AuthService.verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    if (type === "rankings") {
      return NextResponse.json({
        success: true,
        rankings: mockKeywordRankings,
        total: mockKeywordRankings.length,
      })
    }

    if (type === "audit") {
      return NextResponse.json({
        success: true,
        issues: mockSiteAuditIssues,
        total: mockSiteAuditIssues.length,
      })
    }

    return NextResponse.json({
      success: true,
      overview: {
        totalKeywordsTracked: mockKeywordRankings.length,
        totalAuditIssues: mockSiteAuditIssues.filter((issue) => issue.status === "open").length,
        lastAuditRun: "2024-07-10T11:00:00Z",
        overallScore: 85, // Mock score
      },
    })
  } catch (error) {
    console.error("Get SEO data error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const user = await AuthService.verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const { action, id, keyword, url, type: issueType, category, description, pagesAffected, status } = body

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    if (action === "add_keyword") {
      if (!keyword || !url) {
        return NextResponse.json({ error: "Keyword and URL are required" }, { status: 400 })
      }
      const newKeyword: KeywordRanking = {
        id: `kw_${Date.now()}`,
        keyword,
        rank: Math.floor(Math.random() * 50) + 1, // Mock initial rank
        previousRank: 0,
        url,
        lastChecked: new Date().toISOString(),
      }
      mockKeywordRankings.unshift(newKeyword)
      return NextResponse.json(
        {
          success: true,
          keyword: newKeyword,
          message: "Keyword added for tracking.",
        },
        { status: 201 },
      )
    }

    if (action === "delete_keyword") {
      if (!id) {
        return NextResponse.json({ error: "Keyword ID is required" }, { status: 400 })
      }
      const initialLength = mockKeywordRankings.length
      const keywordIndex = mockKeywordRankings.findIndex((kw) => kw.id === id)
      if (keywordIndex === -1) {
        return NextResponse.json({ error: "Keyword not found" }, { status: 404 })
      }
      mockKeywordRankings.splice(keywordIndex, 1)
      return NextResponse.json({ success: true, message: "Keyword deleted." })
    }

    if (action === "run_site_audit") {
      // Simulate running a site audit
      console.log("Simulating site audit...")
      // In a real app, this would trigger a background job
      return NextResponse.json({ success: true, message: "Site audit initiated. Results will be available shortly." })
    }

    if (action === "update_audit_issue_status") {
      if (!id || !status) {
        return NextResponse.json({ error: "Issue ID and status are required" }, { status: 400 })
      }
      const issueIndex = mockSiteAuditIssues.findIndex((issue) => issue.id === id)
      if (issueIndex === -1) {
        return NextResponse.json({ error: "Audit issue not found" }, { status: 404 })
      }
      mockSiteAuditIssues[issueIndex].status = status
      return NextResponse.json({ success: true, message: `Audit issue status updated to ${status}.` })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("SEO API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
