import { initialize, login } from "@/scraping/amazon/login";
import { NextResponse } from "next/server";

const AMAZON_LOGIN_URL =
  "https://www.amazon.in/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.in%2Fref%3Dnav_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=inflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Initialize browser and get page
    // const { page } = await initializeAmazon();
    const { page } = await initialize();

    // Perform login
    const loginResult = await login(page, AMAZON_LOGIN_URL, {
      username,
      password,
    });

    return NextResponse.json({
      success: loginResult.success,
      message: loginResult.message,
      error: loginResult.error,
      orders: loginResult.orders,
    });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        error: "LOGIN_ERROR",
      },
      { status: 500 }
    );
  }
}
