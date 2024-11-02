"use server";
import puppeteer, {
  Browser,
  Page,
  PuppeteerLaunchOptions,
} from "puppeteer-core";
import { getOrderHistory, OrderDetails } from "./orderScraping";
import chromium from "@sparticuz/chromium-min";
// https://oceanjar-new.s3.ap-south-1.amazonaws.com/images/reliance/flights/chromium-v130.0.0-pack.tar
interface LoginCredentials {
  username: string;
  password: string;
}

let amazonBrowser: Browser | null = null;
let amazonPage: Page | null = null;

export const getAmazonInstance = async (): Promise<{
  page: Page | null;
  browser: Browser | null;
}> => {
  return { page: amazonPage, browser: amazonBrowser };
};

// since its launched in the browser, I use chrome-aws-lambda
export const getOptions = async () => {
  if (process.env.NODE_ENV === "production") {
    return {
      args: [
        ...chromium.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--incognito",
        "--hide-scrollbars",
        "--font-render-hinting=none",
        "--disable-font-subpixel-positioning",
      ],
      executablePath: await chromium.executablePath(
        "https://oceanjar-new.s3.ap-south-1.amazonaws.com/images/reliance/flights/chromium-v130.0.0-pack.tar"
      ),
      // headless: chromium.headless,
      headless: false,
      defaultViewport: chromium.defaultViewport,
      ignoreHTTPSErrors: true,
    };
  } else {
    let executablePath = "";
    // check for platform
    if (process.platform === "darwin") {
      // Mac OS
      executablePath = process.env.CHROME_EXECUTABLE_PATH_MAC ?? "";
    } else if (process.platform === "win32") {
      // Windows
      executablePath = process.env.CHROME_EXECUTABLE_PATH_WIN ?? "";
    }

    return {
      headless: false,
      defaultViewport: { width: 1280, height: 800 },
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
      ],
      executablePath: executablePath,
    };
  }
};
export const initialize = async () => {
  const options = await getOptions();
  amazonBrowser = await puppeteer.launch(options as PuppeteerLaunchOptions);

  amazonPage = await amazonBrowser.newPage();

  amazonPage.setDefaultNavigationTimeout(30000);

  await amazonPage.setJavaScriptEnabled(true);

  await amazonPage.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );
  console.log("Browser launched successfully");

  return { page: amazonPage, browser: amazonBrowser };
};

export const navigateToLoginPage = async (page: Page, url: string) => {
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

async function checkAmazonLoginStatus(page: Page): Promise<boolean> {
  try {
    const loginStatus = await page.evaluate(() => {
      const signInButton = document.querySelector(
        "#nav-link-accountList-nav-line-1"
      );
      // text includes Hello, sign in which is not signed in
      if (signInButton?.textContent?.includes("Hello, sign in")) {
        return false;
      }

      // Check for account name (user logged in)
      const accountName = document.querySelector(
        "#nav-link-accountList-nav-line-1"
      );
      return accountName?.textContent?.includes("Hello,") ?? false;
    });

    return loginStatus;
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
}

export interface LoginResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface LoginResponseWithOrders extends LoginResponse {
  orders?: OrderDetails[];
}

export const login = async (
  page: Page,
  url: string,
  credentials: LoginCredentials
): Promise<LoginResponseWithOrders> => {
  if (!page) {
    return {
      success: false,
      message: "Browser not initialized",
      error: "BROWSER_NOT_INITIALIZED",
    };
  }

  try {
    console.log("Step 1: Starting login process");
    await navigateToLoginPage(page, url);
    console.log("Step 2: Completed initial page load");

    console.log("Step 3: Waiting for mobile number input");
    await page.waitForSelector(`#ap_email`);

    console.log("Step 4: Entering mobile number");
    await page.type(`#ap_email`, credentials.username, { delay: 100 });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await page.waitForSelector("#continue");
    const button = await page.$("#continue");
    await button?.click();
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check if there was an error with email input
    const handleEmailError = async (page: Page) => {
      const errorSelector = "#auth-error-message-box";
      const continueButtonSelector = "#continue";
      try {
        await page.waitForSelector(errorSelector, { timeout: 2000 });
        console.log(
          "Error detected in email input. Waiting for manual correction..."
        );

        // Wait for manual email input and button click
        let buttonClicked = false;
        while (!buttonClicked) {
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Check if continue button was clicked
          buttonClicked = await page.evaluate((selector) => {
            const button = document.querySelector(selector);
            if (!button) return false;

            // Check if button was recently clicked using a click timestamp
            const lastClickTime = button.getAttribute("data-last-click");
            const currentTime = Date.now();

            if (lastClickTime && currentTime - parseInt(lastClickTime) < 2000) {
              return true;
            }

            return false;
          }, continueButtonSelector);

          // Add click listener to track button clicks
          await page.evaluate((selector) => {
            const button = document.querySelector(selector);
            if (button && !button.getAttribute("click-listener")) {
              button.setAttribute("click-listener", "true");
              button.addEventListener("click", () => {
                button.setAttribute("data-last-click", Date.now().toString());
              });
            }
          }, continueButtonSelector);
        }

        console.log("Manual email entry completed and continue button clicked");
      } catch (error) {
        console.log("🚀 ~ handleEmailError ~ error:", error);
        // No error found, continue normally
        console.log("Email input accepted, proceeding with next steps...");
      }
    };

    const checkHasError = async (page: Page) => {
      return await page.evaluate(() => {
        const element = document.querySelector("#auth-error-message-box");
        if (!element) return false;
        const style = window.getComputedStyle(element);
        return style.display === "block";
      });
    };

    if (await checkHasError(page)) {
      await handleEmailError(page);
    }
    console.log("Step 5: Waiting for password input");
    await page.waitForSelector(`#auth-email-claim`);

    console.log("Step 6: Waiting for password input");
    await page.waitForSelector(`#ap_password`);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await page.type(`#ap_password`, credentials.password, { delay: 100 }); // Type slower to seem more human-like

    console.log("Step 7: Waiting for sign in button");
    await page.waitForSelector("#signInSubmit");
    const signInButton = await page.$("#signInSubmit");
    await signInButton?.click();
    console.log("Step 8: Sign in button clicked");
    // await new Promise((resolve) => setTimeout(resolve, 800));

    await page.waitForNavigation();

    // Check if redirected to verification page
    const currentUrl = page.url();
    if (currentUrl.includes("/ap/cvf")) {
      console.log(
        "Verification page detected, waiting for user interaction..."
      );
      // Wait for navigation away from verification page
      await Promise.race([
        page.waitForNavigation({ timeout: 300000 }), // 5 minute timeout
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Verification timeout")), 300000)
        ),
      ]);
      console.log("User completed verification, continuing...");
    }
    const loginStatus = await checkAmazonLoginStatus(page);

    if (loginStatus) {
      // Fetch orders immediately after successful login
      const orderResult = await getOrderHistory(page);

      return {
        success: true,
        message: "Successfully logged in to Amazon",
        orders: orderResult.success ? orderResult.orders : [],
      };
    }

    return {
      success: false,
      message: "Login failed - Invalid credentials or captcha required",
      error: "LOGIN_FAILED",
    };
  } catch (error) {
    console.error("Login failed:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      error: "LOGIN_ERROR",
    };
  }
};

export const close = async () => {
  if (amazonBrowser) {
    await amazonBrowser.close();
    amazonBrowser = null;
    amazonPage = null;
  }
};
