"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  TrendingUp,
  BarChart3,
  Globe,
  Eye,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SEOAnalysis {
  url: string
  title: string
  description: string
  keywords: string[]
  score: number
  issues: SEOIssue[]
  lastAnalyzed: string
}

interface SEOIssue {
  type: "error" | "warning" | "info"
  category: string
  message: string
  impact: "high" | "medium" | "low"
}

interface Keyword {
  id: string
  keyword: string
  position: number
  searchVolume: number
  difficulty: number
  trend: "up" | "down" | "stable"
}

interface Competitor {
  id: string
  domain: string
  score: number
  keywords: number
  backlinks: number
  traffic: string
}

const mockSEOAnalysis: SEOAnalysis = {
  url: "https://limitless.com",
  title: "Limitless Infotech Solutions - Where Innovation Meets Execution",
  description:
    "Empowering Businesses with Technology that is Secure, Unique, and Limitless. Custom software, web development, and CRM solutions.",
  keywords: ["web development", "custom software", "CRM solutions", "limitless infotech"],
  score: 85,
  issues: [
    {
      type: "warning",
      category: "Meta Tags",
      message: "Meta description is slightly too long (165 characters)",
      impact: "medium",
    },
    {
      type: "error",
      category: "Images",
      message: "3 images missing alt text",
      impact: "high",
    },
    {
      type: "info",
      category: "Performance",
      message: "Page load time could be improved",
      impact: "low",
    },
  ],
  lastAnalyzed: "2024-01-15 14:30:22",
}

const mockKeywords: Keyword[] = [
  {
    id: "1",
    keyword: "web development services",
    position: 3,
    searchVolume: 12000,
    difficulty: 65,
    trend: "up",
  },
  {
    id: "2",
    keyword: "custom software development",
    position: 7,
    searchVolume: 8500,
    difficulty: 72,
    trend: "stable",
  },
  {
    id: "3",
    keyword: "CRM solutions",
    position: 12,
    searchVolume: 5400,
    difficulty: 58,
    trend: "down",
  },
  {
    id: "4",
    keyword: "limitless infotech",
    position: 1,
    searchVolume: 320,
    difficulty: 15,
    trend: "up",
  },
]

const mockCompetitors: Competitor[] = [
  {
    id: "1",
    domain: "techsolutions.com",
    score: 78,
    keywords: 1247,
    backlinks: 3420,
    traffic: "45K",
  },
  {
    id: "2",
    domain: "webdevpro.com",
    score: 82,
    keywords: 892,
    backlinks: 2180,
    traffic: "32K",
  },
  {
    id: "3",
    domain: "customcode.io",
    score: 71,
    keywords: 654,
    backlinks: 1890,
    traffic: "28K",
  },
]

export default function SEOTools() {
  const [seoAnalysis, setSEOAnalysis] = useState<SEOAnalysis>(mockSEOAnalysis)
  const [keywords, setKeywords] = useState<Keyword[]>(mockKeywords)
  const [competitors, setCompetitors] = useState<Competitor[]>(mockCompetitors)
  const [urlToAnalyze, setUrlToAnalyze] = useState("")
  const [newKeyword, setNewKeyword] = useState("")

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error":
        return <XCircle className="w-4 h-4 text-destructive" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-accent-orange" />
      case "info":
        return <CheckCircle className="w-4 h-4 text-accent-blue" />
      default:
        return <CheckCircle className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getIssueColor = (type: string) => {
    switch (type) {
      case "error":
        return "bg-destructive/20 text-destructive"
      case "warning":
        return "bg-accent-orange/20 text-accent-orange"
      case "info":
        return "bg-accent-blue/20 text-accent-blue"
      default:
        return "bg-muted/20 text-muted-foreground"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-accent-green" />
      case "down":
        return <TrendingUp className="w-4 h-4 text-destructive rotate-180" />
      case "stable":
        return <BarChart3 className="w-4 h-4 text-muted-foreground" />
      default:
        return <BarChart3 className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent-green"
    if (score >= 60) return "text-accent-orange"
    return "text-destructive"
  }

  const analyzePage = () => {
    if (urlToAnalyze.trim()) {
      // Simulate analysis
      console.log("Analyzing:", urlToAnalyze)
      setUrlToAnalyze("")
    }
  }

  const addKeyword = () => {
    if (newKeyword.trim()) {
      const keyword: Keyword = {
        id: Date.now().toString(),
        keyword: newKeyword,
        position: 0,
        searchVolume: 0,
        difficulty: 0,
        trend: "stable",
      }
      setKeywords([...keywords, keyword])
      setNewKeyword("")
    }
  }

  return (
    <div className="space-y-6">
      {/* SEO Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="custom-card">
          <CardContent className="p-6 text-center">
            <Search className="w-8 h-8 text-accent-blue mx-auto mb-2" />
            <h3 className={cn("text-2xl font-bold", getScoreColor(seoAnalysis.score))}>{seoAnalysis.score}</h3>
            <p className="text-muted-foreground text-sm">SEO Score</p>
          </CardContent>
        </Card>

        <Card className="custom-card">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-accent-green mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-accent-green">{keywords.length}</h3>
            <p className="text-muted-foreground text-sm">Tracked Keywords</p>
          </CardContent>
        </Card>

        <Card className="custom-card">
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-8 h-8 text-accent-orange mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-accent-orange">{seoAnalysis.issues.length}</h3>
            <p className="text-muted-foreground text-sm">Issues Found</p>
          </CardContent>
        </Card>

        <Card className="custom-card">
          <CardContent className="p-6 text-center">
            <Globe className="w-8 h-8 text-accent-purple mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-accent-purple">{competitors.length}</h3>
            <p className="text-muted-foreground text-sm">Competitors</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 bg-card border-border rounded-lg p-1 mb-6">
          <TabsTrigger
            value="analysis"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            Page Analysis
          </TabsTrigger>
          <TabsTrigger
            value="keywords"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            Keywords
          </TabsTrigger>
          <TabsTrigger
            value="competitors"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            Competitors
          </TabsTrigger>
          <TabsTrigger
            value="meta"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            Meta Tags
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          {/* URL Analysis */}
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Page Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter URL to analyze..."
                  value={urlToAnalyze}
                  onChange={(e) => setUrlToAnalyze(e.target.value)}
                  className="input-field flex-1"
                />
                <Button onClick={analyzePage} className="btn-gradient">
                  <Search className="w-4 h-4 mr-2" />
                  Analyze
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Analysis */}
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Current Analysis: {seoAnalysis.url}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Page Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-muted-foreground">Title:</span>
                      <p className="text-foreground">{seoAnalysis.title}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Description:</span>
                      <p className="text-foreground">{seoAnalysis.description}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Keywords:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {seoAnalysis.keywords.map((keyword, index) => (
                          <Badge key={index} className="bg-accent-blue/20 text-accent-blue text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">SEO Score</h3>
                  <div className="text-center">
                    <div className={cn("text-4xl font-bold mb-2", getScoreColor(seoAnalysis.score))}>
                      {seoAnalysis.score}/100
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className={cn(
                          "h-3 rounded-full",
                          seoAnalysis.score >= 80
                            ? "bg-accent-green"
                            : seoAnalysis.score >= 60
                              ? "bg-accent-orange"
                              : "bg-destructive",
                        )}
                        style={{ width: `${seoAnalysis.score}%` }}
                      />
                    </div>
                    <p className="text-muted-foreground text-sm mt-2">Last analyzed: {seoAnalysis.lastAnalyzed}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-4">Issues & Recommendations</h3>
                <div className="space-y-3">
                  {seoAnalysis.issues.map((issue, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-4 bg-muted/20 rounded-lg border border-border"
                    >
                      {getIssueIcon(issue.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={getIssueColor(issue.type)}>{issue.type}</Badge>
                          <Badge className="bg-muted/20 text-muted-foreground text-xs">{issue.category}</Badge>
                          <Badge
                            className={cn(
                              issue.impact === "high"
                                ? "bg-destructive/20 text-destructive"
                                : issue.impact === "medium"
                                  ? "bg-accent-orange/20 text-accent-orange"
                                  : "bg-accent-green/20 text-accent-green",
                            )}
                          >
                            {issue.impact} impact
                          </Badge>
                        </div>
                        <p className="text-foreground">{issue.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-6">
          {/* Add Keyword */}
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Track New Keyword</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter keyword to track..."
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  className="input-field flex-1"
                />
                <Button onClick={addKeyword} className="btn-gradient">
                  Add Keyword
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Keywords List */}
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Keyword Rankings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/50">
                    <tr className="text-left">
                      <th className="p-4 font-medium table-header">Keyword</th>
                      <th className="p-4 font-medium table-header">Position</th>
                      <th className="p-4 font-medium table-header">Search Volume</th>
                      <th className="p-4 font-medium table-header">Difficulty</th>
                      <th className="p-4 font-medium table-header">Trend</th>
                      <th className="p-4 font-medium table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.map((keyword, index) => (
                      <tr
                        key={keyword.id}
                        className="table-row animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="p-4 font-medium text-foreground">{keyword.keyword}</td>
                        <td className="p-4">
                          <Badge
                            className={cn(
                              keyword.position <= 3
                                ? "bg-accent-green/20 text-accent-green"
                                : keyword.position <= 10
                                  ? "bg-accent-orange/20 text-accent-orange"
                                  : "bg-destructive/20 text-destructive",
                            )}
                          >
                            #{keyword.position || "Not ranked"}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">{keyword.searchVolume.toLocaleString()}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div
                                className={cn(
                                  "h-2 rounded-full",
                                  keyword.difficulty <= 30
                                    ? "bg-accent-green"
                                    : keyword.difficulty <= 70
                                      ? "bg-accent-orange"
                                      : "bg-destructive",
                                )}
                                style={{ width: `${keyword.difficulty}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{keyword.difficulty}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(keyword.trend)}
                            <span className="text-sm text-muted-foreground capitalize">{keyword.trend}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="hover:bg-muted/10">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-muted/10">
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Competitor Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/50">
                    <tr className="text-left">
                      <th className="p-4 font-medium table-header">Domain</th>
                      <th className="p-4 font-medium table-header">SEO Score</th>
                      <th className="p-4 font-medium table-header">Keywords</th>
                      <th className="p-4 font-medium table-header">Backlinks</th>
                      <th className="p-4 font-medium table-header">Traffic</th>
                      <th className="p-4 font-medium table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitors.map((competitor, index) => (
                      <tr
                        key={competitor.id}
                        className="table-row animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="p-4 font-medium text-foreground">{competitor.domain}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <span className={cn("font-bold", getScoreColor(competitor.score))}>{competitor.score}</span>
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div
                                className={cn(
                                  "h-2 rounded-full",
                                  competitor.score >= 80
                                    ? "bg-accent-green"
                                    : competitor.score >= 60
                                      ? "bg-accent-orange"
                                      : "bg-destructive",
                                )}
                                style={{ width: `${competitor.score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{competitor.keywords.toLocaleString()}</td>
                        <td className="p-4 text-muted-foreground">{competitor.backlinks.toLocaleString()}</td>
                        <td className="p-4 text-muted-foreground">{competitor.traffic}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="hover:bg-muted/10">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="hover:bg-muted/10">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meta" className="space-y-6">
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">Meta Tags Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Page Title</label>
                <Input defaultValue={seoAnalysis.title} className="input-field" placeholder="Enter page title..." />
                <p className="text-xs text-muted-foreground mt-1">Recommended: 50-60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Meta Description</label>
                <Textarea
                  defaultValue={seoAnalysis.description}
                  className="input-field"
                  placeholder="Enter meta description..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">Recommended: 150-160 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Keywords</label>
                <Input
                  defaultValue={seoAnalysis.keywords.join(", ")}
                  className="input-field"
                  placeholder="Enter keywords separated by commas..."
                />
                <p className="text-xs text-muted-foreground mt-1">Separate keywords with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Canonical URL</label>
                <Input defaultValue={seoAnalysis.url} className="input-field" placeholder="Enter canonical URL..." />
              </div>

              <Button className="btn-gradient">Update Meta Tags</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="custom-card">
            <CardHeader>
              <CardTitle className="text-foreground">SEO Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/20 rounded-lg border border-border">
                  <h3 className="font-medium text-foreground mb-2">Weekly Report</h3>
                  <p className="text-sm text-muted-foreground mb-4">Comprehensive SEO analysis for the past week</p>
                  <Button size="sm" className="btn-outline-primary">
                    Generate Report
                  </Button>
                </div>

                <div className="p-4 bg-muted/20 rounded-lg border border-border">
                  <h3 className="font-medium text-foreground mb-2">Monthly Report</h3>
                  <p className="text-sm text-muted-foreground mb-4">Detailed monthly SEO performance report</p>
                  <Button size="sm" className="btn-outline-primary">
                    Generate Report
                  </Button>
                </div>

                <div className="p-4 bg-muted/20 rounded-lg border border-border">
                  <h3 className="font-medium text-foreground mb-2">Competitor Report</h3>
                  <p className="text-sm text-muted-foreground mb-4">Compare your SEO performance with competitors</p>
                  <Button size="sm" className="btn-outline-primary">
                    Generate Report
                  </Button>
                </div>

                <div className="p-4 bg-muted/20 rounded-lg border border-border">
                  <h3 className="font-medium text-foreground mb-2">Keyword Report</h3>
                  <p className="text-sm text-muted-foreground mb-4">Track keyword rankings and opportunities</p>
                  <Button size="sm" className="btn-outline-primary">
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
