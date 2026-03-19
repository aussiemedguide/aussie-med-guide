import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aussiemedguide.com";

  const routes = [
    "",
    "/",
    "/train",
    "/interview",
    "/compare",
    "/profile",
    "/tools/command",
    "/opportunities",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "/" || route === "" ? 1 : 0.8,
  }));
}