export const dynamic = "force-dynamic";

import chromium from "@sparticuz/chromium-min";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import validator from "validator";
import { existsSync } from "fs";

export const maxDuration = 45;

// Function to find local Chrome installation
function getLocalChromePath(): string | null {
  const possiblePaths = [
    // Windows paths
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
    // Common Windows Edge path as fallback
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ];

  for (const path of possiblePaths) {
    try {
      if (existsSync(path)) {
        return path;
      }
    } catch {
      // Continue to next path
    }
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    // Validate URL
    if (!url) {
      return new NextResponse(
        JSON.stringify({ error: "URL parameter is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!validator.isURL(url)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid URL provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;
    
    let executablePath: string;
    try {
      if (isLocal) {
        executablePath = process.env.CHROME_EXECUTABLE_PATH!;
      } else {
        // Try to find local Chrome first
        const localChromePath = getLocalChromePath();
        if (localChromePath) {
          executablePath = localChromePath;
        } else {
          // For cloud deployment, use the Chromium min package
          executablePath = await chromium.executablePath(
            `https://github.com/Sparticuz/chromium/releases/download/v130.0.0/chromium-v130.0.0-pack.tar`
          );
        }
      }
    } catch (chromiumError) {
      console.error("Failed to get Chromium executable path:", chromiumError);
      return new NextResponse(
        JSON.stringify({
          error: "Chromium setup failed",
          message: "Unable to initialize browser executable",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const browser = await puppeteer.launch({
      args: (isLocal || getLocalChromePath()) ? [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ] : chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });
    
    await page.goto(url, { waitUntil: "networkidle0" });

    await new Promise((resolve) => setTimeout(resolve, 700));
    const screenshot = await page.screenshot({ type: "png" });
    await browser.close();

    return new NextResponse(Buffer.from(screenshot), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=60",
      },
    });
    
  } catch (error) {
    console.error("Screenshot error:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal server error",
        message: "Failed to capture screenshot",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
