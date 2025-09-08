import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"

interface FileItem {
  id: string
  name: string
  path: string
  size: string
  type: "file" | "directory"
  lastModified: string
}

// Mock file system data
const mockFileSystem: { [key: string]: FileItem[] } = {
  "/": [
    {
      id: "root_1",
      name: "public_html",
      path: "/public_html",
      size: "N/A",
      type: "directory",
      lastModified: "2024-07-10T10:00:00Z",
    },
    { id: "root_2", name: "logs", path: "/logs", size: "N/A", type: "directory", lastModified: "2024-07-11T08:00:00Z" },
    { id: "root_3", name: "mail", path: "/mail", size: "N/A", type: "directory", lastModified: "2024-06-20T14:00:00Z" },
    {
      id: "root_4",
      name: "backup",
      path: "/backup",
      size: "N/A",
      type: "directory",
      lastModified: "2024-07-09T03:00:00Z",
    },
    {
      id: "root_5",
      name: "README.txt",
      path: "/README.txt",
      size: "2 KB",
      type: "file",
      lastModified: "2024-01-01T12:00:00Z",
    },
  ],
  "/public_html": [
    { id: "html_1", name: "..", path: "/", size: "N/A", type: "directory", lastModified: "" }, // Parent directory
    {
      id: "html_2",
      name: "index.html",
      path: "/public_html/index.html",
      size: "10 KB",
      type: "file",
      lastModified: "2024-07-05T11:30:00Z",
    },
    {
      id: "html_3",
      name: "css",
      path: "/public_html/css",
      size: "N/A",
      type: "directory",
      lastModified: "2024-07-01T09:00:00Z",
    },
    {
      id: "html_4",
      name: "js",
      path: "/public_html/js",
      size: "N/A",
      type: "directory",
      lastModified: "2024-07-01T09:00:00Z",
    },
    {
      id: "html_5",
      name: "images",
      path: "/public_html/images",
      size: "N/A",
      type: "directory",
      lastModified: "2024-07-08T16:00:00Z",
    },
    {
      id: "html_6",
      name: ".htaccess",
      path: "/public_html/.htaccess",
      size: "1 KB",
      type: "file",
      lastModified: "2024-06-15T10:00:00Z",
    },
  ],
  "/public_html/css": [
    { id: "css_1", name: "..", path: "/public_html", size: "N/A", type: "directory", lastModified: "" },
    {
      id: "css_2",
      name: "style.css",
      path: "/public_html/css/style.css",
      size: "50 KB",
      type: "file",
      lastModified: "2024-07-01T09:00:00Z",
    },
  ],
  "/public_html/js": [
    { id: "js_1", name: "..", path: "/public_html", size: "N/A", type: "directory", lastModified: "" },
    {
      id: "js_2",
      name: "main.js",
      path: "/public_html/js/main.js",
      size: "20 KB",
      type: "file",
      lastModified: "2024-07-01T09:00:00Z",
    },
  ],
  "/public_html/images": [
    { id: "img_1", name: "..", path: "/public_html", size: "N/A", type: "directory", lastModified: "" },
    {
      id: "img_2",
      name: "logo.png",
      path: "/public_html/images/logo.png",
      size: "150 KB",
      type: "file",
      lastModified: "2024-07-08T16:00:00Z",
    },
    {
      id: "img_3",
      name: "hero.jpg",
      path: "/public_html/images/hero.jpg",
      size: "1.2 MB",
      type: "file",
      lastModified: "2024-07-08T16:00:00Z",
    },
  ],
  "/logs": [
    { id: "logs_1", name: "..", path: "/", size: "N/A", type: "directory", lastModified: "" },
    {
      id: "logs_2",
      name: "access.log",
      path: "/logs/access.log",
      size: "500 MB",
      type: "file",
      lastModified: "2024-07-11T08:00:00Z",
    },
    {
      id: "logs_3",
      name: "error.log",
      path: "/logs/error.log",
      size: "120 MB",
      type: "file",
      lastModified: "2024-07-11T07:50:00Z",
    },
  ],
  "/mail": [
    { id: "mail_1", name: "..", path: "/", size: "N/A", type: "directory", lastModified: "" },
    {
      id: "mail_2",
      name: "inbox",
      path: "/mail/inbox",
      size: "N/A",
      type: "directory",
      lastModified: "2024-07-11T09:00:00Z",
    },
  ],
  "/backup": [
    { id: "backup_dir_1", name: "..", path: "/", size: "N/A", type: "directory", lastModified: "" },
    {
      id: "backup_dir_2",
      name: "2024-07-09_full_backup.zip",
      path: "/backup/2024-07-09_full_backup.zip",
      size: "2.5 GB",
      type: "file",
      lastModified: "2024-07-09T03:00:00Z",
    },
  ],
}

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
    const path = decodeURIComponent(searchParams.get("path") || "/")

    if (!mockFileSystem[path]) {
      return NextResponse.json({ success: false, error: "Directory not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      files: mockFileSystem[path],
      currentPath: path,
    })
  } catch (error) {
    console.error("Get files error:", error)
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

    const contentType = request.headers.get("content-type")

    if (contentType?.includes("application/json")) {
      const body = await request.json()
      const { action, name, path, type, id } = body

      if (!action) {
        return NextResponse.json({ error: "Action is required" }, { status: 400 })
      }

      if (action === "create") {
        if (!name || !path || !type) {
          return NextResponse.json({ error: "Name, path, and type are required" }, { status: 400 })
        }
        if (!mockFileSystem[path]) {
          return NextResponse.json({ error: "Parent directory not found" }, { status: 404 })
        }

        const newPath = `${path === "/" ? "" : path}/${name}`
        const newItem: FileItem = {
          id: `item_${Date.now()}`,
          name,
          path: newPath,
          size: type === "directory" ? "N/A" : "0 KB",
          type,
          lastModified: new Date().toISOString(),
        }

        // Add to parent directory's list
        mockFileSystem[path].push(newItem)
        if (type === "directory") {
          mockFileSystem[newPath] = [
            { id: `parent_${Date.now()}`, name: "..", path: path, size: "N/A", type: "directory", lastModified: "" },
          ]
        }

        return NextResponse.json(
          {
            success: true,
            item: newItem,
            message: `${type === "directory" ? "Folder" : "File"} created successfully.`,
          },
          { status: 201 },
        )
      }

      if (action === "delete") {
        if (!id) {
          return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
        }

        let found = false
        for (const dirPath in mockFileSystem) {
          const initialLength = mockFileSystem[dirPath].length
          mockFileSystem[dirPath] = mockFileSystem[dirPath].filter((item) => item.id !== id)
          if (mockFileSystem[dirPath].length < initialLength) {
            found = true
            // If it was a directory, also remove its entry from mockFileSystem
            const deletedItem = Object.values(mockFileSystem)
              .flat()
              .find((item) => item.id === id)
            if (deletedItem && deletedItem.type === "directory" && mockFileSystem[deletedItem.path]) {
              delete mockFileSystem[deletedItem.path]
            }
            break
          }
        }

        if (!found) {
          return NextResponse.json({ error: "Item not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: "Item deleted successfully." })
      }

      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    } else if (contentType?.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await request.formData()
      const file = formData.get("file") as File | null
      const uploadPath = formData.get("path") as string

      if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
      }
      if (!uploadPath || !mockFileSystem[uploadPath]) {
        return NextResponse.json({ error: "Invalid upload path" }, { status: 400 })
      }

      const newItem: FileItem = {
        id: `file_${Date.now()}`,
        name: file.name,
        path: `${uploadPath === "/" ? "" : uploadPath}/${file.name}`,
        size: `${(file.size / 1024).toFixed(2)} KB`, // Mock size
        type: "file",
        lastModified: new Date().toISOString(),
      }

      mockFileSystem[uploadPath].push(newItem)

      return NextResponse.json(
        { success: true, message: "File uploaded successfully.", file: newItem },
        { status: 201 },
      )
    }

    return NextResponse.json({ error: "Unsupported content type" }, { status: 415 })
  } catch (error) {
    console.error("File manager API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
