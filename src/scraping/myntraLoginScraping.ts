"use server";
import puppeteer, {
  Browser,
  Page,
  PuppeteerLaunchOptions,
} from "puppeteer-core";
import { getOptions } from "./amazon/amazonLogin";

interface LoginCredentials {
  username: string;
  password: string;
}

let browser: Browser | null = null;
let page: Page | null = null;

export const initialize = async () => {
  const options = await getOptions();
  browser = await puppeteer.launch(options as PuppeteerLaunchOptions);

  page = await browser.newPage();

  page.setDefaultNavigationTimeout(30000);

  await page.setJavaScriptEnabled(true);

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );
  console.log("Browser launched successfully");
};

const navigateToLoginPage = async (page: Page, url: string) => {
  try {
    await page.goto(url, { waitUntil: "networkidle0" });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes("ERR_NAME_NOT_RESOLVED")
    ) {
      console.error(
        "URL could not be resolved. Please check if the URL is valid."
      );
      throw new Error("Invalid URL: Domain could not be resolved");
    }
    // Re-throw other errors
    throw error;
  }
};

export const login = async (url: string, credentials: LoginCredentials) => {
  if (!page) throw new Error("Browser not initialized");

  try {
    console.log("Step 1: Starting login process");
    await navigateToLoginPage(page, url);
    console.log("Step 2: Completed initial page load");

    console.log("Step 3: Waiting for mobile number input");
    await page.waitForSelector(`.mobileNumberInput`);

    console.log("Step 4: Entering mobile number");
    await page.type(`.mobileNumberInput`, credentials.username);

    // Additional wait to ensure any UI validations are complete
    console.log("Step 4.1: Waiting for UI validation");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await page.waitForSelector(".submitBottomOption");
    const button = await page.$(".submitBottomOption");
    await button?.click();
    console.log("Step 5: Clicking submit button");

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const element = document.querySelector("#sec-container");
    const checkSecContainerVisibility = async () => {
      return await page?.evaluate(() => {
        // const element = document.querySelector("#sec-container");
        if (!element) return false;
        const style = window.getComputedStyle(element);
        console.log("🚀 ~ returnawaitpage?.evaluate ~ style:", style);
        return style.display === "block";
      });
    };

    // Add timeout and max attempts to prevent infinite loop
    let isVisible = true;
    let attempts = 0;
    const maxAttempts = 20; // Maximum 20 seconds of waiting

    while (isVisible && attempts < maxAttempts) {
      isVisible = (await checkSecContainerVisibility()) ?? true;
      console.log("🚀 ~ login ~ isVisible:", isVisible, attempts);
      if (isVisible) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        attempts++;
      }
    }
    if (!isVisible) {
      throw new Error("Timed out waiting for sec-container visibility change");
    }
    console.log("🚀 ~ login ~ pageElement:", { isVisible });

    // if (!pageElement) {
    //   console.log("Page element not found");
    //   throw new Error("Page element not found");
    // }
    // console.log("Page element found successfully");
    // await page.waitForSelector("sec-container");

    console.log("Step 11: Waiting for navigation");
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    const currentUrl = page.url();
    console.log("Step 12: Navigation complete. Current URL:", currentUrl);
    return true;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};

export const close = async () => {
  if (browser) {
    await browser.close();
    browser = null;
    page = null;
  }
};
