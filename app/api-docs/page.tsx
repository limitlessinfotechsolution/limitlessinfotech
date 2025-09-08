"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Database, Mail, Shield, ArrowLeft, Copy, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface APIEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE"
  path: string
  description: string
  parameters?: { name: string; type: string; required: boolean; description: string }[]
  response: string
  example: string
}

const apiEndpoints: APIEndpoint[] = [
  {
    method: "POST",
    path: "/api/contact",
    description: "Submit a contact form inquiry",
    parameters: [
      { name: "firstName", type: "string", required: true, description: "First name of the contact" },
      { name: "lastName", type: "string", required: true, description: "Last name of the contact" },
      { name: "email", type: "string", required: true, description: "Email address" },
      { name: "subject", type: "string", required: true, description: "Subject of the inquiry" },
      { name: "message", type: "string", required: true, description: "Message content" },
    ],
    response: "{ success: boolean, message: string, adminEmailId?: string, clientEmailId?: string }",
    example: `{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'm interested in your web development services."
}`,
  },
  {
    method: "POST",
    path: "/api/auth/login",
    description: "Authenticate user and receive JWT token",
    parameters: [
      { name: "email", type: "string", required: true, description: "User email address" },
      { name: "password", type: "string", required: true, description: "User password" },
    ],
    response: "{ success: boolean, token?: string, error?: string }",
    example: `{
  "email": "admin@example.com",
  "password": "admin123"
}`,
  },
  {
    method: "GET",
    path: "/api/cpanel/files",
    description: "Retrieve files and folders from cPanel file manager",
    parameters: [
      { name: "path", type: "string", required: false, description: "Directory path (default: /)" },
      { name: "Authorization", type: "header", required: true, description: "Bearer token" },
    ],
    response: "{ success: boolean, files: FileItem[], currentPath: string }",
    example: `GET /api/cpanel/files?path=/public_html
Authorization: Bearer <token>`,
  },
  {
    method: "POST",
    path: "/api/cpanel/files",
    description: "Create files/folders or upload files",
    parameters: [
      { name: "action", type: "string", required: true, description: "Action: create, delete, or upload" },
      { name: "name", type: "string", required: true, description: "File or folder name" },
      { name: "path", type: "string", required: true, description: "Target path" },
      { name: "type", type: "string", required: true, description: "Type: file or directory" },
      { name: "Authorization", type: "header", required: true, description: "Bearer token" },
    ],
    response: "{ success: boolean, message: string, file?: FileItem }",
    example: `{
  "action": "create",
  "name": "new-folder",
  "path": "/public_html",
  "type": "directory"
}`,
  },
  {
    method: "GET",
    path: "/api/health",
    description: "Health check endpoint for monitoring",
    response: "{ status: string, timestamp: string, uptime: number }",
    example: "GET /api/health",
  },
]

export default function APIDocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const { toast } = useToast()

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(id)
      toast({ title: "Copied!", description: "Code copied to clipboard" })
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (error) {
      toast({ title: "Error", description: "Failed to copy to clipboard", variant: "destructive" })
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-accent-green/20 text-accent-green"
      case "POST":
        return "bg-accent-blue/20 text-accent-blue"
      case "PUT":
        return "bg-accent-orange/20 text-accent-orange"
      case "DELETE":
        return "bg-destructive/20 text-destructive"
      default:
        return "bg-muted/20 text-muted-foreground"
    }
  }

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
              <h1 className="text-2xl font-bold text-foreground">API Documentation</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Introduction */}
        <Card className="custom-card mb-8">
          <CardHeader>
            <CardTitle className="text-foreground">Limitless Infotech API Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Welcome to the Limitless Infotech Solutions API documentation. Our RESTful API provides programmatic
              access to our platform's core functionality, including contact management, authentication, file
              operations, and system monitoring.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-muted/20 rounded-lg border border-border">
                <Shield className="w-8 h-8 text-accent-blue" />
                <div>
                  <h3 className="font-semibold text-foreground">Secure</h3>
                  <p className="text-sm text-muted-foreground">JWT-based authentication</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-muted/20 rounded-lg border border-border">
                <Code className="w-8 h-8 text-accent-green" />
                <div>
                  <h3 className="font-semibold text-foreground">RESTful</h3>
                  <p className="text-sm text-muted-foreground">Standard HTTP methods</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-muted/20 rounded-lg border border-border">
                <Database className="w-8 h-8 text-accent-orange" />
                <div>
                  <h3 className="font-semibold text-foreground">JSON</h3>
                  <p className="text-sm text-muted-foreground">JSON request/response format</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="endpoints" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card border-border rounded-lg p-1 mb-6">
            <TabsTrigger
              value="endpoints"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
            >
              API Endpoints
            </TabsTrigger>
            <TabsTrigger
              value="authentication"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
            >
              Authentication
            </TabsTrigger>
            <TabsTrigger
              value="examples"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
            >
              Code Examples
            </TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints" className="space-y-6">
            {apiEndpoints.map((endpoint, index) => (
              <Card
                key={index}
                className="custom-card animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge className={getMethodColor(endpoint.method)}>{endpoint.method}</Badge>
                      <code className="text-lg font-mono text-foreground">{endpoint.path}</code>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(endpoint.path, `path-${index}`)}
                      className="hover:bg-muted/10"
                    >
                      {copiedCode === `path-${index}` ? (
                        <CheckCircle className="w-4 h-4 text-accent-green" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-muted-foreground">{endpoint.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {endpoint.parameters && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Parameters</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="border-b border-border/50">
                            <tr className="text-left">
                              <th className="p-2 font-medium table-header">Name</th>
                              <th className="p-2 font-medium table-header">Type</th>
                              <th className="p-2 font-medium table-header">Required</th>
                              <th className="p-2 font-medium table-header">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {endpoint.parameters.map((param, paramIndex) => (
                              <tr key={paramIndex} className="border-b border-border/30">
                                <td className="p-2 font-mono text-accent-blue">{param.name}</td>
                                <td className="p-2 text-muted-foreground">{param.type}</td>
                                <td className="p-2">
                                  <Badge
                                    className={
                                      param.required
                                        ? "bg-destructive/20 text-destructive"
                                        : "bg-muted/20 text-muted-foreground"
                                    }
                                  >
                                    {param.required ? "Required" : "Optional"}
                                  </Badge>
                                </td>
                                <td className="p-2 text-muted-foreground">{param.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Response</h4>
                    <div className="relative">
                      <pre className="bg-muted/20 p-4 rounded-lg border border-border overflow-x-auto">
                        <code className="text-sm text-foreground">{endpoint.response}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(endpoint.response, `response-${index}`)}
                        className="absolute top-2 right-2 hover:bg-muted/10"
                      >
                        {copiedCode === `response-${index}` ? (
                          <CheckCircle className="w-4 h-4 text-accent-green" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Example Request</h4>
                    <div className="relative">
                      <pre className="bg-muted/20 p-4 rounded-lg border border-border overflow-x-auto">
                        <code className="text-sm text-foreground">{endpoint.example}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(endpoint.example, `example-${index}`)}
                        className="absolute top-2 right-2 hover:bg-muted/10"
                      >
                        {copiedCode === `example-${index}` ? (
                          <CheckCircle className="w-4 h-4 text-accent-green" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="authentication" className="space-y-6">
            <Card className="custom-card">
              <CardHeader>
                <CardTitle className="text-foreground">Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Our API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints, you must include
                  a valid JWT token in the Authorization header.
                </p>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Getting a Token</h4>
                  <div className="relative">
                    <pre className="bg-muted/20 p-4 rounded-lg border border-border overflow-x-auto">
                      <code className="text-sm text-foreground">{`POST /api/auth/login
Content-Type: application/json

{
  "email": "your-email@example.com",
  "password": "your-password"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        copyToClipboard(
                          `POST /api/auth/login
Content-Type: application/json

{
  "email": "your-email@example.com",
  "password": "your-password"
}`,
                          "auth-example",
                        )
                      }
                      className="absolute top-2 right-2 hover:bg-muted/10"
                    >
                      {copiedCode === "auth-example" ? (
                        <CheckCircle className="w-4 h-4 text-accent-green" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Using the Token</h4>
                  <div className="relative">
                    <pre className="bg-muted/20 p-4 rounded-lg border border-border overflow-x-auto">
                      <code className="text-sm text-foreground">{`GET /api/cpanel/files
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        copyToClipboard(
                          `GET /api/cpanel/files
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`,
                          "token-example",
                        )
                      }
                      className="absolute top-2 right-2 hover:bg-muted/10"
                    >
                      {copiedCode === "token-example" ? (
                        <CheckCircle className="w-4 h-4 text-accent-green" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-accent-orange/10 rounded-lg border border-accent-orange/20">
                  <h4 className="font-semibold text-accent-orange mb-2">Important Notes</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Tokens expire after 7 days by default</li>
                    <li>• Always use HTTPS in production</li>
                    <li>• Store tokens securely (never in localStorage for sensitive apps)</li>
                    <li>• Include the "Bearer " prefix in the Authorization header</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <Card className="custom-card">
              <CardHeader>
                <CardTitle className="text-foreground">JavaScript/TypeScript Examples</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Contact Form Submission</h4>
                  <div className="relative">
                    <pre className="bg-muted/20 p-4 rounded-lg border border-border overflow-x-auto">
                      <code className="text-sm text-foreground">{`async function submitContactForm(formData) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Form submitted successfully!');
      return data;
    } else {
      throw new Error(data.error || 'Submission failed');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        copyToClipboard(
                          `async function submitContactForm(formData) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Form submitted successfully!');
      return data;
    } else {
      throw new Error(data.error || 'Submission failed');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
}`,
                          "js-contact",
                        )
                      }
                      className="absolute top-2 right-2 hover:bg-muted/10"
                    >
                      {copiedCode === "js-contact" ? (
                        <CheckCircle className="w-4 h-4 text-accent-green" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Authenticated File Operations</h4>
                  <div className="relative">
                    <pre className="bg-muted/20 p-4 rounded-lg border border-border overflow-x-auto">
                      <code className="text-sm text-foreground">{`class LimitlessAPI {
  constructor(token) {
    this.token = token;
    this.baseURL = '/api';
  }

  async getFiles(path = '/') {
    const response = await fetch(\`\${this.baseURL}/cpanel/files?path=\${encodeURIComponent(path)}\`, {
      headers: {
        'Authorization': \`Bearer \${this.token}\`,
      },
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    return await response.json();
  }

  async createFolder(name, path) {
    const response = await fetch(\`\${this.baseURL}/cpanel/files\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${this.token}\`,
      },
      body: JSON.stringify({
        action: 'create',
        name,
        path,
        type: 'directory',
      }),
    });

    return await response.json();
  }
}

// Usage
const api = new LimitlessAPI('your-jwt-token');
const files = await api.getFiles('/public_html');
console.log(files);`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        copyToClipboard(
                          `class LimitlessAPI {
  constructor(token) {
    this.token = token;
    this.baseURL = '/api';
  }

  async getFiles(path = '/') {
    const response = await fetch(\`\${this.baseURL}/cpanel/files?path=\${encodeURIComponent(path)}\`, {
      headers: {
        'Authorization': \`Bearer \${this.token}\`,
      },
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    return await response.json();
  }

  async createFolder(name, path) {
    const response = await fetch(\`\${this.baseURL}/cpanel/files\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${this.token}\`,
      },
      body: JSON.stringify({
        action: 'create',
        name,
        path,
        type: 'directory',
      }),
    });

    return await response.json();
  }
}

// Usage
const api = new LimitlessAPI('your-jwt-token');
const files = await api.getFiles('/public_html');
console.log(files);`,
                          "js-files",
                        )
                      }
                      className="absolute top-2 right-2 hover:bg-muted/10"
                    >
                      {copiedCode === "js-files" ? (
                        <CheckCircle className="w-4 h-4 text-accent-green" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="custom-card">
              <CardHeader>
                <CardTitle className="text-foreground">Python Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-muted/20 p-4 rounded-lg border border-border overflow-x-auto">
                    <code className="text-sm text-foreground">{`import requests
import json

class LimitlessAPI:
    def __init__(self, token, base_url="https://your-domain.com/api"):
        self.token = token
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

    def submit_contact_form(self, form_data):
        """Submit a contact form"""
        url = f"{self.base_url}/contact"
        response = requests.post(url, json=form_data)
        return response.json()

    def get_files(self, path="/"):
        """Get files from cPanel file manager"""
        url = f"{self.base_url}/cpanel/files"
        params = {"path": path}
        response = requests.get(url, headers=self.headers, params=params)
        return response.json()

    def create_folder(self, name, path):
        """Create a new folder"""
        url = f"{self.base_url}/cpanel/files"
        data = {
            "action": "create",
            "name": name,
            "path": path,
            "type": "directory"
        }
        response = requests.post(url, headers=self.headers, json=data)
        return response.json()

# Usage example
api = LimitlessAPI("your-jwt-token")

# Submit contact form
contact_data = {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "subject": "API Inquiry",
    "message": "I'm interested in your API services."
}
result = api.submit_contact_form(contact_data)
print(result)`}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      copyToClipboard(
                        `import requests
import json

class LimitlessAPI:
    def __init__(self, token, base_url="https://your-domain.com/api"):
        self.token = token
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

    def submit_contact_form(self, form_data):
        """Submit a contact form"""
        url = f"{self.base_url}/contact"
        response = requests.post(url, json=form_data)
        return response.json()

    def get_files(self, path="/"):
        """Get files from cPanel file manager"""
        url = f"{self.base_url}/cpanel/files"
        params = {"path": path}
        response = requests.get(url, headers=self.headers, params=params)
        return response.json()

    def create_folder(self, name, path):
        """Create a new folder"""
        url = f"{self.base_url}/cpanel/files"
        data = {
            "action": "create",
            "name": name,
            "path": path,
            "type": "directory"
        }
        response = requests.post(url, headers=self.headers, json=data)
        return response.json()

# Usage example
api = LimitlessAPI("your-jwt-token")

# Submit contact form
contact_data = {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "subject": "API Inquiry",
    "message": "I'm interested in your API services."
}
result = api.submit_contact_form(contact_data)
print(result)`,
                        "python-example",
                      )
                    }
                    className="absolute top-2 right-2 hover:bg-muted/10"
                  >
                    {copiedCode === "python-example" ? (
                      <CheckCircle className="w-4 h-4 text-accent-green" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Support Section */}
        <Card className="custom-card mt-8">
          <CardHeader>
            <CardTitle className="text-foreground">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have questions about our API or need assistance with integration, our team is here to help.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="btn-gradient">
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button asChild variant="outline" className="btn-outline-primary bg-transparent">
                <Link href="mailto:api-support@limitless.com">
                  <Mail className="w-4 h-4 mr-2" />
                  Email API Support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
