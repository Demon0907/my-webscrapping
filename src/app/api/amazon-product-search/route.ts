import { close, initialize } from "@/scraping/amazon/amazonLogin";
import { scrapeAmazon } from "@/scraping/amazonSearchOrder";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { searchStrings } = body;

    // Initialize browser and get page
    const { page } = await initialize();

    // Perform login
    const loginResult = await scrapeAmazon(page, searchStrings);

    return NextResponse.json({
      success: loginResult.success,
      message: loginResult.message,
      error: loginResult.error,
      products: loginResult.products,
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
  } finally {
    close();
  }
}
