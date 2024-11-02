"use server";
import puppeteer, {
  Browser,
  Page,
  PuppeteerLaunchOptions,
} from "puppeteer-core";
import {
  getOptions,
  LoginResponseWithOrders,
  navigateToLoginPage,
} from "../amazon/amazonLogin";

let ajioBrowser: Browser | null = null;
let ajioPage: Page | null = null;

export const getAjioInstance = async (): Promise<{
  page: Page | null;
  browser: Browser | null;
}> => {
  return { page: ajioPage, browser: ajioBrowser };
};

export const initialize = async () => {
  const options = await getOptions();
  ajioBrowser = await puppeteer.launch(options as PuppeteerLaunchOptions);

  ajioPage = await ajioBrowser.newPage();

  ajioPage.setDefaultNavigationTimeout(30000);

  await ajioPage.setJavaScriptEnabled(true);

  await ajioPage.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );
  console.log("Browser launched successfully");

  return { page: ajioPage, browser: ajioBrowser };
};

export const login = async (
  page: Page,
  url: string,
  credentials: {
    username: string;
  }
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
    await navigateToLoginPage(page, url).catch(() => {
      throw new Error("Failed to navigate to login page");
    });
    console.log("Step 2: Completed initial page load");

    const modalId = "modalId";
    try {
      // Check if modal exists
      const modalExists = await page.evaluate((id) => {
        return !!document.getElementById(id);
      }, modalId);
      console.log("Modal exists:", modalExists);

      if (!modalExists) {
        console.log("No modal found - proceeding with login");
        await proceedWithLogin(page, credentials.username);
      }
      await closeModalAutomatically(page);
      return await proceedWithLogin(page, credentials.username);
    } catch (error) {
      console.error("Error handling modal:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Modal handling error",
        error: "MODAL_ERROR",
      };
    }
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

async function closeModalAutomatically(page: Page) {
  console.log("Attempting to close modal automatically");
  const closeButton = await page.$("#closeBtn");
  if (closeButton) {
    await closeButton.click();
    console.log("Modal closed automatically");
  } else {
    console.log("Close button not found");
  }
}

async function proceedWithLogin(page: Page, mobile: string) {
  try {
    console.log("Starting login process");

    // Wait for login button with timeout
    const loginButton = await page
      .waitForSelector(`#loginAjio`, { timeout: 5000 })
      .catch(() => {
        throw new Error("Login button not found");
      });

    if (!loginButton) {
      throw new Error("Login button not available");
    }

    await loginButton.click().catch(() => {
      throw new Error("Failed to click login button");
    });

    // Wait for modal with timeout
    await page
      .waitForSelector(`.modal-login-container`, { timeout: 5000 })
      .catch(() => {
        throw new Error("Login modal failed to open");
      });

    // Wait for username input with timeout
    const usernameInput = await page
      .waitForSelector('input[name="username"]', { timeout: 5000 })
      .catch(() => {
        throw new Error("Username input not found");
      });

    if (!usernameInput) {
      throw new Error("Username input not available");
    }

    await usernameInput.type(mobile, { delay: 100 }).catch(() => {
      throw new Error("Failed to enter username");
    });

    // Add submit button click
    const submitButton = await page.waitForSelector('input[type="submit"]');
    if (!submitButton) throw new Error("Could not find submit button");
    await submitButton.click();
    console.log("Waiting for OTP section");

    // Add network response listener before OTP submission
    const otpValidationPromise = new Promise<{
      profileResponse?: unknown;
    }>((resolve, reject) => {
      page.on("response", async (response) => {
        if (response.url().includes("/api/auth/login")) {
          try {
            const data = await response.json();
            resolve(data);
          } catch (e) {
            reject(e);
            console.error("Failed to parse response:", e);
          }
        }
      });
    });

    const checkLoginStatus = async (): Promise<boolean> => {
      // Check for sign out link
      const signOutLink = await page.$(
        '.guest-header a[aria-label="Sign Out"]'
      );
      return !!signOutLink;
    };

    // Wait for OTP input and submission (your existing code)
    await page.waitForSelector('input[name="otp"]', { timeout: 60000 });
    console.log("OTP input field detected");

    // Wait for both OTP submission and API response
    try {
      const [apiResponse] = await Promise.all([
        otpValidationPromise,
        Promise.race([
          page.waitForNavigation({ timeout: 300000 }),
          page.waitForFunction(
            () => !document.querySelector(".modal-login-container"),
            { timeout: 300000 }
          ),
        ]),
      ]);

      // Check API response
      if (!apiResponse.profileResponse) {
        throw new Error("Invalid OTP entered");
      }

      await page.waitForNavigation({ timeout: 300000 });

      const loginStatus = await checkLoginStatus().catch(() => false);
      if (!loginStatus) {
        throw new Error("Login verification failed");
      }

      return {
        success: true,
        message: `Successfully logged in to Ajio with OTP(${mobile}) with Manual Factor Authentication`,
      };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        error: "LOGIN_PROCESS_ERROR",
      };
    }
  } catch (error) {
    console.error("Login process failed:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      error: "LOGIN_PROCESS_ERROR",
    };
  }
}

export const close = async () => {
  if (ajioBrowser) {
    await ajioBrowser.close();
    ajioBrowser = null;
    ajioPage = null;
  }
};
