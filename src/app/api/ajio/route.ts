import { initialize, login } from "@/scraping/ajio/ajioLogin";
import { NextResponse } from "next/server";

const AJIO_LOGIN_URL = "https://www.ajio.com/";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username } = body;

    // Initialize browser and get page
    // const { page } = await initializeAmazon();
    const { page } = await initialize();

    // Perform login
    const loginResult = await login(page, AJIO_LOGIN_URL, {
      username,
    });
    console.log("🚀 ~ POST ~ loginResult:", loginResult);

    return NextResponse.json({
      success: loginResult.success,
      message: loginResult.message,
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
