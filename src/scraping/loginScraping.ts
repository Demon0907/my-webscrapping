"use server";
import puppeteer, { Browser, Page } from "puppeteer-core";
import chromium from "chrome-aws-lambda";

interface LoginCredentials {
  username: string;
  password: string;
}

let browser: Browser | null = null;
let page: Page | null = null;

export const initialize = async () => {
  browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  page = await browser.newPage();

  page.setDefaultNavigationTimeout(30000);

  await page.setJavaScriptEnabled(true);

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );
  console.log("Browser launched successfully");
};

const waitForManualVerification = async (page: Page): Promise<void> => {
  console.log(
    "Bot detection page detected. Waiting for manual verification..."
  );
  // Wait for URL to change (indicating manual verification is complete)
  const currentUrl = page.url();
  await page.waitForFunction(
    (botUrl) => window.location.href !== botUrl,
    { timeout: 300000 }, // 5 minute timeout
    currentUrl
  );
};
// className=target-icaptcha-slot
const checkAndHandleBotDetection = async (page: Page) => {
  console.log("Bot Detection: Checking current URL");
  const currentUrl = page.url();
  console.log("Bot Detection: Current URL:", currentUrl);
  // Keywords to check in iframe title
  const captchaTitleKeywords = [
    "Widget",
    "checkbox",
    "hCaptcha",
    "security",
    "challenge",
  ];

  const hasCaptcha = await Promise.all([
    currentUrl.includes("captcha"),
    page
      .$(".target-icaptcha-slot")
      .then((el) => !!el)
      .catch(() => false),
    page
      .$("#s0-71-captcha-ui")
      .then((el) => !!el)
      .catch(() => false),
    // Check for any keyword in iframe title
    page
      .$$eval(
        "iframe",
        (iframes, keywords) =>
          iframes.some((iframe) =>
            keywords.some((keyword) =>
              iframe.title?.toLowerCase().includes(keyword.toLowerCase())
            )
          ),
        captchaTitleKeywords
      )
      .catch(() => false),
  ]).then((results) => results.some((result) => result));
  console.log("🚀 ~ checkAndHandleBotDetection ~ hasCaptcha:", hasCaptcha);

  if (currentUrl.includes("captcha")) {
    console.log(
      "Bot Detection: Captcha detected, waiting for manual verification"
    );
    await waitForManualVerification(page);
    console.log("Bot Detection: Manual verification completed");
  } else {
    console.log("Bot Detection: No captcha detected, proceeding");
  }
};

const navigateToLoginPage = async (page: Page, url: string) => {
  try {
    await page.goto(url, { waitUntil: "networkidle0" });
    const currentUrl = page.url();
    console.log("Current login page URL:", currentUrl);
    await checkAndHandleBotDetection(page);
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

    const spanElement = await page
      .waitForSelector("#user-info", { timeout: 5000 })
      .catch(() => {
        console.log("Step 3: No user-info span found, proceeding with login");
        return null;
      });

    if (!spanElement) {
      console.log("Step 4: Looking for username input");
      await page.waitForSelector('input[name="userid"]');
      console.log("Step 5: Entering username");
      await page.type('input[name="userid"]', credentials.username);
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Step 6: Checking for bot detection");
      await checkAndHandleBotDetection(page);

      console.log("Step 7: Looking for continue button");
      await page.waitForSelector('button[name="signin-continue-btn"]');
      await page.click('button[name="signin-continue-btn"]');
    }

    console.info("submit clicked");
    await checkAndHandleBotDetection(page);
    console.log("Redirected to password page");
    await new Promise((resolve) => setTimeout(resolve, 500));
    await page.waitForSelector('input[name="pass"]');
    await page.type('input[name="pass"]', credentials.password);
    // await checkAndHandleBotDetection(page);
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
