"use client"

import { TabsContent } from "@/components/ui/tabs"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LayoutDashboard,
  Database,
  Mail,
  Globe,
  Shield,
  BarChart3,
  Terminal,
  Cloud,
  ExternalLink,
  ArrowLeft,
  Folder,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import AdvancedEmailTools from "./components/advanced-email-tools"
import AdvancedServerMonitor from "./components/advanced-server-monitor"
import APIManager from "./components/api-manager"
import BackendTools from "./components/backend-tools"
import BackupManager from "./components/backup-manager"
import CDNManager from "./components/cdn-manager"
import DatabaseManager from "./components/database-manager"
import DomainManager from "./components/domain-manager"
import EmailManager from "./components/email-manager"
import FileManager from "./components/file-manager"
import SecurityCenter from "./components/security-center"
import SEOTools from "./components/seo-tools"
import SSLCertificateManager from "./components/ssl-certificate-manager"
import Statistics from "./components/statistics"
import SubdomainManager from "./components/subdomain-manager"
import { cn } from "@/lib/utils"

interface CPanelFeature {
  id: string
  name: string
  icon: React.ElementType
  component: React.ComponentType
  description: string
}

const cpanelFeatures: CPanelFeature[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
    component: () => (
      <div className="space-y-6">
        <Card className="custom-card">
          <CardHeader>
            <CardTitle className="text-foreground">Welcome to your cPanel!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is your central hub for managing all aspects of your website and hosting. Use the tabs above to
              navigate through various tools.
            </p>
          </CardContent>
        </Card>
        <Statistics />
      </div>
    ),
    description: "Overview of your hosting account and website statistics.",
  },
  {
    id: "file-manager",
    name: "File Manager",
    icon: Folder,
    component: FileManager,
    description: "Manage your website files, folders, and permissions.",
  },
  {
    id: "database-manager",
    name: "Database Manager",
    icon: Database,
    component: DatabaseManager,
    description: "Create and manage MySQL databases and users.",
  },
  {
    id: "email-manager",
    name: "Email Manager",
    icon: Mail,
    component: EmailManager,
    description: "Create email accounts, forwarders, and mailing lists.",
  },
  {
    id: "domain-manager",
    name: "Domain Manager",
    icon: Globe,
    component: DomainManager,
    description: "Manage your domains, subdomains, and DNS records.",
  },
  {
    id: "ssl-manager",
    name: "SSL Certificates",
    icon: Shield,
    component: SSLCertificateManager,
    description: "Install and manage SSL certificates for secure connections.",
  },
  {
    id: "seo-tools",
    name: "SEO Tools",
    icon: BarChart3,
    component: SEOTools,
    description: "Optimize your website for search engines and track rankings.",
  },
  {
    id: "backend-tools",
    name: "Backend Tools",
    icon: Terminal,
    component: BackendTools,
    description: "Access server terminal, manage cron jobs and services.",
  },
  {
    id: "cdn-manager",
    name: "CDN Manager",
    icon: Cloud,
    component: CDNManager,
    description: "Configure and manage your Content Delivery Network.",
  },
  {
    id: "api-manager",
    name: "API Manager",
    icon: ExternalLink,
    component: APIManager,
    description: "Manage API keys, endpoints, and monitor API usage.",
  },
  {
    id: "security-center",
    name: "Security Center",
    icon: Shield,
    component: SecurityCenter,
    description: "Monitor security events, manage firewall, and malware scans.",
  },
  {
    id: "server-monitor",
    name: "Server Monitor",
    icon: LayoutDashboard,
    component: AdvancedServerMonitor,
    description: "Real-time monitoring of server resources and performance.",
  },
  {
    id: "advanced-email-tools",
    name: "Advanced Email",
    icon: Mail,
    component: AdvancedEmailTools,
    description: "Advanced email filtering, autoresponders, and security.",
  },
  {
    id: "subdomain-manager",
    name: "Subdomain Manager",
    icon: ExternalLink,
    component: SubdomainManager,
    description: "Create and manage subdomains for your primary domains.",
  },
  {
    id: "backup-manager",
    name: "Backup Manager",
    icon: Database,
    component: BackupManager,
    description: "Manage website backups and restoration points.",
  },
  {
    id: "statistics",
    name: "Statistics",
    icon: BarChart3,
    component: Statistics,
    description: "View detailed website traffic and visitor statistics.",
  },
]

export default function CPanelPage() {
  const [activeFeature, setActiveFeature] = useState("dashboard")

  const CurrentComponent = cpanelFeatures.find((feature) => feature.id === activeFeature)?.component

  return (
    <div className="min-h-screen bg-dark-blue-900 text-foreground">
      {/* Header */}
      <header className="border-b border-dark-blue-700 p-4 bg-dark-blue-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-3">
              <Image src="/images/logo.png" alt="Limitless" width={32} height={32} />
              <h1 className="text-2xl font-bold text-foreground">Limitless cPanel</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="btn-outline-primary bg-transparent">
              Account Settings
            </Button>
            <Button variant="outline" size="sm" className="btn-outline-primary bg-transparent">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="dashboard" value={activeFeature} onValueChange={setActiveFeature}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 bg-card border-border rounded-lg p-2 mb-6">
            {cpanelFeatures.map((feature) => (
              <TabsTrigger
                key={feature.id}
                value={feature.id}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200",
                  "data-[state=active]:bg-primary/20 data-[state=active]:text-primary",
                  "hover:bg-muted/50",
                )}
              >
                <feature.icon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium text-center">{feature.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {cpanelFeatures.map((feature) => (
            <TabsContent key={feature.id} value={feature.id} className="animate-fade-in-up">
              {CurrentComponent && <CurrentComponent />}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
