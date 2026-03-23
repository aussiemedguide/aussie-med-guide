import type { FetchedPage } from "@/types/medical-schools";

export async function fetchPage(url: string): Promise<FetchedPage> {
  const res = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: {
      "user-agent": "AussieMedGuideBot/1.0 (+https://www.aussiemedguide.com)",
      accept: "text/html,application/xhtml+xml",
    },
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type");
  const html = await res.text();

  return {
    url,
    finalUrl: res.url,
    status: res.status,
    contentType,
    html,
  };
}