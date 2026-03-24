import type { FetchedPage } from "@/lib/medical-schools/types/medical-schools";

export async function fetchPage(url: string): Promise<FetchedPage> {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",

      headers: {
        "user-agent":
          "AussieMedGuideBot/1.0 (+https://www.aussiemedguide.com)",
        accept: "text/html,application/xhtml+xml",
      },

      cache: "no-store",
    });

    const contentType = res.headers.get("content-type");

    /*
      Some pages return PDFs or other formats.
      We only want HTML pages.
    */
    if (!contentType?.includes("text/html")) {
      return {
        url,
        finalUrl: res.url,
        status: res.status,
        contentType,
        html: "",
      };
    }

    const html = await res.text();

    return {
      url,
      finalUrl: res.url,
      status: res.status,
      contentType,
      html,
    };
  } catch (error) {
    console.error("fetchPage failed:", url, error);

    return {
      url,
      finalUrl: url,
      status: 0,
      contentType: null,
      html: "",
    };
  }
}