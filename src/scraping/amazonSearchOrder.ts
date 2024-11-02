import { Page } from "puppeteer-core";
import { LoginResponse } from "./amazon/amazonLogin";

export interface SearchProduct {
  name: string;
  price: string;
  productLink: string;
  rating: string;
  globalRating: string;
}

export interface SearchProductResponse extends LoginResponse {
  products?: { [searchString: string]: SearchProduct[] };
}

export const scrapeAmazon = async (
  page: Page,
  searchStrings: string[]
): Promise<SearchProductResponse> => {
  console.log("Starting Amazon scraping process...");

  if (!page) {
    console.log("Error: Browser not initialized");
    return {
      success: false,
      message: "Browser not initialized",
      error: "BROWSER_NOT_INITIALIZED",
    };
  }

  const results: Record<string, SearchProduct[]> = {};

  for (const searchString of searchStrings) {
    if (Object.keys(results).length > 0) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    console.log(`Processing search string: "${searchString}"`);

    const url = `https://www.amazon.in/s?k=${encodeURIComponent(searchString)}`;

    await page.goto(url);
    await page.bringToFront();

    console.log("Extracting item details...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await page.waitForSelector(".s-search-results");
    console.log("result loaded");
    const items = await page.evaluate(() => {
      const itemElements = Array.from(
        document.querySelectorAll(".s-main-slot .s-result-item")
      );
      const filteredElements = itemElements
        .filter((item) => {
          const link = item.querySelector("h2 a") as HTMLAnchorElement;
          return link && link.href;
        })
        .slice(0, 10);
      return filteredElements.map((item) => ({
        name: item.querySelector("h2 a span")?.textContent || "No name",
        price:
          item.querySelector(".a-price .a-offscreen")?.textContent ||
          "Price unavailable",
        productLink:
          (item.querySelector("h2 a") as HTMLAnchorElement)?.href || "",
        rating:
          item
            .querySelector(".a-icon-alt")
            ?.textContent?.replace(" out of 5 stars", "") || "",
        globalRating:
          item
            .querySelector(".a-size-base.s-underline-text")
            ?.textContent?.trim() || "",
      }));
    });

    console.log(`Found ${items.length} items for "${searchString}"`);
    results[searchString] = items;
  }

  console.log(
    `Scraping complete. Total items found: ${
      Object.values(results).flatMap((products) => products).length
    }`
  );
  return {
    success: true,
    message: "Scraping completed successfully",
    products: results,
  };
};
