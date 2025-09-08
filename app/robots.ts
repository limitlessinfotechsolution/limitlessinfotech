import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/cpanel/", "/webmail/", "/api/"], // Disallow sensitive areas and APIs
    },
    sitemap: "https://limitlessinfotech.com/sitemap.xml", // Replace with your actual domain
  }
}
