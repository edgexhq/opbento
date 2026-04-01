import fetchUserData, { defaultUserStats } from "@/actions/fetchUserData";
import { fetchContributions } from "@/actions/githubGraphql";
import chromium from "@sparticuz/chromium-min";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import {
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "@/lib/firebase";
import { generateContributionGraph } from "@/utils/generate-graph";
import { fetchYearContributions } from "@/actions/fetchYearContribution";
import type { UserStats } from "@/types";

export const maxDuration = 45;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const n = decodeURIComponent(searchParams.get("n") || "");
  const g = decodeURIComponent(searchParams.get("g") || "");
  const i = decodeURIComponent(searchParams.get("i") || "");
  const x = decodeURIComponent(searchParams.get("x") || "");
  const l = decodeURIComponent(searchParams.get("l") || "");
  const p = decodeURIComponent(searchParams.get("p") || "");

  const uniqueId = decodeURIComponent(searchParams.get("z") || "");

  if (!g) {
    return new NextResponse("Github username is required", { status: 400 });
  }

  const storagePath = `opbento/${g}${uniqueId}.png`;

  try {
    const previousImageRef = ref(storage, storagePath);
    await deleteObject(previousImageRef).catch((error) => {
      console.error("Error deleting previous image:", error);
    });
  } catch (error) {
    console.error("Error deleting previous image:", error);
  }

  let htmlofGithubStats = ``;
  let graphSVG = "";
  if (g) {
    const currentYear = new Date().getFullYear();
    let contributionDays: { date: string; contributionCount: number }[] = [];
    try {
      contributionDays = await fetchYearContributions(g, currentYear);
    } catch (error) {
      console.error("Failed to fetch year contributions:", error);
    }
    graphSVG = generateContributionGraph(contributionDays);
    let userStats: UserStats = { ...defaultUserStats };
    try {
      ({ userStats } = await fetchUserData(g));
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
    let contributionStats = {
      totalContributions: 0,
      firstDateofContribution: null as string | null,
      longestStreak: 0,
      longestStreakStartDate: null as string | null,
      longestStreakEndDate: null as string | null,
      currentStreak: 0,
      currentStreakStartDate: null as string | null,
      currentStreakEndDate: null as string | null,
    };
    try {
      contributionStats = await fetchContributions(g);
    } catch (error) {
      console.error("Failed to fetch contributions:", error);
    }

    htmlofGithubStats = `
<div class="grid gap-4 grid-cols-4 col-span-4 row-span-2">
          <div class="col-span-2 row-span-2">
            <div
              class="grid grid-cols-4 grid-rows-3 gap-4 auto-rows-fr rounded-xl overflow-hidden w-full h-full"
            >
              <div
                class="bg-gradient-to-br from-amber-500/40 via-amber-500/10 to-transparent rounded-xl p-4 flex flex-col justify-between col-span-2 relative row-span-2"
              >
                <div
                  class="flex absolute top-2 px-3 left-0 items-center justify-between w-full opacity-70"
                >
                  <i
                    data-lucide="star"
                    class="w-10 h-10 text-yellow-400 fill-current"
                  ></i>
                  <i
                    data-lucide="star"
                    class="w-10 h-10 text-yellow-400 fill-current"
                  ></i>
                  <i
                    data-lucide="star"
                    class="w-10 h-10 text-yellow-400 fill-current"
                  ></i>
                  <i
                    data-lucide="star"
                    class="w-10 h-10 text-yellow-400 fill-current"
                  ></i>
                  <i
                    data-lucide="star"
                    class="w-10 h-10 text-yellow-400 fill-current"
                  ></i>
                </div>
                <h3
                  class="text-2xl mt-16 text-end text-muted-foreground font-medium"
                >
                  Total Stars
                </h3>
                <div class="text-end text-yellow-400 text-7xl font-bold">
                  ${userStats["Star Earned"]}
                </div>
              </div>

              <!-- PRs Card -->
              <div
                class="bg-gradient-to-b from-pink-900/20 to-neutral-900/50 rounded-xl relative p-4 flex flex-col justify-between col-span-1 row-span-1"
              >
                <i
                  data-lucide="git-pull-request"
                  class="text-pink-400 absolute top-2 w-5 h-5"
                ></i>
                <span class="text-gray-300 text-sm pt-4 font-medium">PRs</span>
                <div class="text-pink-400 text-3xl font-bold mt-2">${userStats["Pull Requests"]}</div>
              </div>

              <!-- Followers Card -->
              <div
                class="bg-gradient-to-tl from-rose-950/20 to-stone-900/50 relative rounded-xl p-4 flex flex-col justify-between col-span-1 row-span-1"
              >
                <i
                  data-lucide="users"
                  class="text-red-500 absolute top-2 w-5 h-5"
                ></i>
                <span class="text-gray-300 text-sm pt-4 font-medium"
                  >Followers</span
                >
                <div class="text-red-500 text-4xl font-bold mt-2">${userStats.Followers}</div>
              </div>

              <!-- Commits Card -->
              <div
                class="bg-gradient-to-t from-black to-slate-800/50 overflow-hidden relative rounded-xl p-4 flex flex-col justify-between col-span-2 row-span-2"
              >

                 <svg class="absolute inset-0 object-cover rotate-180" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" viewBox="0 0 800 800"><defs><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="oooscillate-grad"><stop stop-color="hsl(105, 69%, 40%)" stop-opacity="1" offset="0%"></stop><stop stop-color="hsl(105, 69%, 60%)" stop-opacity="1" offset="100%"></stop></linearGradient></defs><g strokeWidth="2" stroke="url(#oooscillate-grad)" fill="none" strokeLinecap="round"><path d="M 0 500 Q 200 35 400 400 Q 600 765 800 500" opacity="1.00"></path><path d="M 0 475 Q 200 35 400 400 Q 600 765 800 475" opacity="0.95"></path><path d="M 0 450 Q 200 35 400 400 Q 600 765 800 450" opacity="0.90"></path><path d="M 0 425 Q 200 35 400 400 Q 600 765 800 425" opacity="0.85"></path><path d="M 0 400 Q 200 35 400 400 Q 600 765 800 400" opacity="0.80"></path><path d="M 0 375 Q 200 35 400 400 Q 600 765 800 375" opacity="0.75"></path><path d="M 0 350 Q 200 35 400 400 Q 600 765 800 350" opacity="0.70"></path><path d="M 0 325 Q 200 35 400 400 Q 600 765 800 325" opacity="0.65"></path><path d="M 0 300 Q 200 35 400 400 Q 600 765 800 300" opacity="0.60"></path><path d="M 0 275 Q 200 35 400 400 Q 600 765 800 275" opacity="0.55"></path><path d="M 0 250 Q 200 35 400 400 Q 600 765 800 250" opacity="0.50"></path><path d="M 0 225 Q 200 35 400 400 Q 600 765 800 225" opacity="0.45"></path><path d="M 0 200 Q 200 35 400 400 Q 600 765 800 200" opacity="0.40"></path><path d="M 0 175 Q 200 35 400 400 Q 600 765 800 175" opacity="0.35"></path><path d="M 0 150 Q 200 35 400 400 Q 600 765 800 150" opacity="0.30"></path><path d="M 0 125 Q 200 35 400 400 Q 600 765 800 125" opacity="0.25"></path><path d="M 0 100 Q 200 35 400 400 Q 600 765 800 100" opacity="0.20"></path><path d="M 0 75 Q 200 35 400 400 Q 600 765 800 75" opacity="0.15"></path><path d="M 0 50 Q 200 35 400 400 Q 600 765 800 50" opacity="0.10"></path></g></svg>

                <div class="flex items-center w-full">
                  <i
                    data-lucide="activity"
                    class="text-green-400 w-11 h-11"
                  ></i>
                  <span
                    class="text-muted-foreground w-full text-end text-2xl font-medium"
                    >Commits</span
                  >
                </div>
                <div class="text-green-400 text-6xl text-end font-bold">
                  ${userStats.Commits}
                </div>
              </div>

              <!-- Contributed To Card -->
              <div
                class="bg-muted/30 relative overflow-hidden rounded-xl p-4 flex flex-col justify-between col-span-2 row-span-1"
              >
                <svg  class="absolute -z-10 inset-0 object-cover brightness-150" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" viewBox="0 0 800 800" id="qqquad"><g shape-rendering="crispEdges" strokeLinejoin="round" fill="none" strokeWidth="1" stroke="hsl(220, 64%, 12%)"><polygon points="800,0 600,200 800,200"></polygon><polygon points="600,0 400,0 600,200"></polygon><polygon points="600,300 600,200 500,200"></polygon><polygon points="400,300 500,200 500,300"></polygon><polygon points="400,300 500,300 500,400"></polygon><polygon points="600,400 500,400 500,300"></polygon><polygon points="800,200 800,400 600,200"></polygon><polygon points="400,0 200,0 200,200"></polygon><polygon points="0,0 200,0 200,200"></polygon><polygon points="0,200 200,400 0,400"></polygon><polygon points="300,200 400,200 300,300"></polygon><polygon points="200,300 200,200 300,200"></polygon><polygon points="300,400 200,400 300,300"></polygon><polygon points="300,300 400,400 300,400"></polygon><polygon points="300,500 300,400 400,500"></polygon><polygon points="200,500 300,500 300,400"></polygon><polygon points="300,600 200,600 200,500"></polygon><polygon points="400,500 400,600 300,500"></polygon><polygon points="200,500 200,400 100,500"></polygon><polygon points="100,400 100,500 0,400"></polygon><polygon points="0,500 100,500 0,600"></polygon><polygon points="200,600 200,500 100,600"></polygon><polygon points="0,800 200,800 200,600"></polygon><polygon points="400,800 200,800 200,600"></polygon><polygon points="800,400 600,600 800,600"></polygon><polygon points="600,500 600,400 500,500"></polygon><polygon points="500,500 400,500 400,400"></polygon><polygon points="500,600 400,500 400,600"></polygon><polygon points="500,600 600,600 500,500"></polygon><polygon points="600,700 500,700 600,600"></polygon><polygon points="500,600 500,700 400,600"></polygon><polygon points="500,800 500,700 400,800"></polygon><polygon points="600,700 600,800 500,800"></polygon><polygon points="800,600 800,800 600,800"></polygon></g><g fill="hsl(220, 62%, 45%)" strokeWidth="3" stroke="hsl(220, 43%, 13%)"></g></svg>

                <i
                  data-lucide="git-branch"
                  class="text-blue-400 absolute left-12 bottom-4 w-10 h-10"
                ></i>
                <span
                  class="text-muted-foreground text-center w-full text-sm font-medium"
                  >Contributed To</span
                >
                <div class="text-blue-400 text-4xl text-center font-bold mt-2">
${userStats["Contributed To"]}
                </div>
              </div>
            </div>
          </div>

          <!-- Contribution Stats -->
          <div class="w-full h-full col-span-2 row-span-2">
            <div class="max-w-xl w-full h-full rounded-xl">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
                <div class="flex w-full h-full flex-col space-y-4">
                  <!-- Total Contributions Card -->
                  <div
                    class="bg-gradient-to-tr from-slate-900 to-secondary/20 rounded-lg p-4 h-full flex flex-col items-center justify-center"
                  >
                    <i
                      data-lucide="calendar"
                      class="w-8 h-8 mb-2 text-blue-400"
                    ></i>
                    <h3 class="text-sm font-medium text-gray-400">
                      Total Contributions
                    </h3>
                    <p class="text-3xl font-bold text-blue-400">${contributionStats.totalContributions}</p>
                    <p class="text-xs text-gray-500 mt-2">
${contributionStats.firstDateofContribution} - Present
                    </p>
                  </div>
                  <!-- Longest Streak Card -->
                  <div
                    class="rounded-lg bg-gradient-to-b from-yellow-500/15 via-transparent to-yellow-500/10 p-4 h-full flex flex-col items-center justify-center"
                  >
                    <i
                      data-lucide="trophy"
                      class="w-8 h-8 mb-2 text-yellow-400"
                    ></i>
                    <h3 class="text-sm font-medium text-gray-400">
                      Longest Streak
                    </h3>
                    <p class="text-3xl font-bold text-yellow-400">${contributionStats.longestStreak}</p>
                    <p class="text-xs text-gray-500 mt-2">
${contributionStats.longestStreakStartDate} - ${contributionStats.longestStreakEndDate}
                    </p>
                  </div>
                </div>
                <!-- Current Streak Card -->
                <div
                  class="bg-gradient-to-r to-orange-800/10 from-orange-800/10 via-muted/10 rounded-lg p-6 flex flex-col items-center justify-center relative"
                >
                  <i
                    data-lucide="flame"
                    class="w-28 h-28 mb-4 text-orange-600 rounded-full p-4"
                  ></i>
                  <h3 class="text-lg font-medium text-gray-400">
                    Current Streak
                  </h3>
                  <p class="text-6xl font-bold text-orange-600 my-4">
                    ${contributionStats.currentStreak}
                  </p>
                  <p class="text-sm text-gray-500">
                    ${contributionStats.currentStreakStartDate} - Present
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
               
        `;
  } else {
    htmlofGithubStats = ``;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Bento Grid</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link
      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>

  <body class="bg-neutral-950 text-white font-['Space_Grotesk']">
    <div class="max-w-5xl mx-auto">
      <div
        class="p-1 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mt-4 w-full mx-auto relative"
      >
        <!-- Name Card -->
        <div class="text-white py-6 px-8 rounded-lg bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 col-span-1 row-span-1 min-h-32">
          <p class="text-xl">Hey I'm</p>
          <h2 class="text-4xl font-bold mb-2 capitalize">${n}</h2>
        </div>

        <!-- Image Card -->
        <div class="bg-muted h-80 overflow-hidden rounded-lg col-span-2 row-span-2 flex items-center justify-center">
          <img
            src="${i}"
            alt="${n}"
            class="w-full h-full hover:scale-110 duration-500 transition-all ease object-cover"
          />
        </div>

        <!-- Twitter Card -->
        <a
          href="https://x.com/${x}"
          class="bg-gradient-to-br from-black to-blue-500 p-4 relative rounded-lg overflow-hidden col-span-1 row-span-1 min-h-[150px]"
        >
          <i
            data-lucide="twitter"
            class="absolute glow -top-3 -left-4 w-24 h-24 text-[#29BEF0]"
            strokeWidth="1"
          ></i>
          <p class="z-20 absolute bottom-6 text-xl text-center w-full">@${x}</p>
        </a>

        <!-- GitHub Card -->
        <div class="bg-muted relative overflow-hidden rounded-lg col-span-1 row-span-2">
          <img
            src="https://i.postimg.cc/NGK80VQ1/cf954b8923fbafc5cfc0c66344b6a6f9.jpg"
            alt=""
            class="absolute saturate-150 w-full h-full object-cover inset-0"
          />
          <div class="absolute inset-0 bg-gradient-to-b to-black/80 from-transparent"></div>
          <p class="z-20 absolute bottom-6 text-center w-full">
            <a
              href="https://github.com/${g}"
              class="text-white font-semibold hover:underline p-2 px-4 bg-pink-600 opacity-80 rounded-md backdrop-blur"
            >@${g}</a>
          </p>
        </div>

        <!-- LinkedIn Card -->
        <a
          href="https://www.linkedin.com/in/${l}"
          class="bg-gradient-to-tl from-black to-blue-600 p-4 relative rounded-lg overflow-hidden col-span-1 columns-3 row-span-1 min-h-[150px]"
        >
          <i
            data-lucide="linkedin"
            class="absolute glow -bottom-1 -right-2 w-20 h-20 text-[#56d2ff]"
            strokeWidth="1"
          ></i>
          <p class="text-center text-lg w-full">@${l}</p>
        </a>

        <!-- GitHub Activity Graph -->
        <div class="bg-muted overflow-hidden border border-red-600/40 rounded-lg col-span-2 row-span-1">
          <img
            src="https://github-readme-activity-graph.vercel.app/graph?username=${g}&bg_color=030312&color=ff8080&line=e00a60&point=ff7171&area=true&hide_border=true"
            alt="graph"
            class="w-full object-cover h-[150px]"
          />
        </div>

        <!-- Portfolio URL Card -->
        <div class="p-4 bg-gradient-to-br from-gray-100 via-gray-300 to-gray-600/80 rounded-lg col-span-1 row-span-1 flex relative flex-col items-center justify-center min-h-32 overflow-hidden">
          <h1 class="font-semibold text-xl bg-gradient-to-b from-[#797979] to-[#040e1f] bg-clip-text absolute top-6 break-all left-4 text-transparent leading-[100%] tracking-tighter">
            ${p?.startsWith("https://") ? p.replace("https://", "") : p}
          </h1>
          <img
            src="https://i.postimg.cc/cJnD7cGL/earth.png"
            width="200"
            height="200"
            alt=""
            class="absolute -bottom-24 -right-24"
          />
        </div>

        ${htmlofGithubStats}

        <div class="bg-gradient-to-br from-green-950/80 p-4 col-span-4 row-span-2 rounded-lg w-full h-full">
          <div class="flex items-center justify-between"><h1 class="text-2xl font-bold">${g}'s Contribution Graph</h1><div class="flex items-center justify-end text-sm"><span>Less</span><div class="flex gap-2 mx-3"><div class="w-4 h-4 rounded-sm" title="Contribution level 0" style="background-color: rgb(25, 25, 25);"></div><div class="w-4 h-4 rounded-sm" title="Contribution level 1" style="background-color: rgb(20, 83, 45);"></div><div class="w-4 h-4 rounded-sm" title="Contribution level 2" style="background-color: rgb(30, 122, 30);"></div><div class="w-4 h-4 rounded-sm" title="Contribution level 3" style="background-color: rgb(40, 167, 69);"></div><div class="w-4 h-4 rounded-sm" title="Contribution level 4" style="background-color: rgb(0, 239, 87);"></div></div><span>More</span></div></div>

          <div class="flex justify-center pb-4 items-center w-full h-full">
            ${graphSVG}
          </div>
        </div>
      </div>
      <div
      class="bg-zinc-900/40 shadow-md rounded-xl absolute py-2 px-4 text-xs text-foreground/70 -rotate-6 backdrop-blur-md bottom-2 right-1">
      made by <span class="uppercase ml-1 text-rose-500">opbento</span>
    </div>
    </div>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <script>
      lucide.createIcons();
    </script>
  </body>
</html>`;
  try {
    const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;

    const browser = await puppeteer.launch({
      args: isLocal ? puppeteer.defaultArgs() : chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH ||
        (await chromium.executablePath(
          `https://github.com/Sparticuz/chromium/releases/download/v130.0.0/chromium-v130.0.0-pack.tar`,
        )),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1100,
      height: 1160,
      deviceScaleFactor: 1.4,
    });
    // Use a 15-second timeout so slow/unavailable external resources (e.g.,
    // Tailwind CDN, Lucide JS, external images) don't hang the serverless
    // function indefinitely and trigger a 500 error.
    page.setDefaultNavigationTimeout(15000);
    try {
      await page.setContent(html, { waitUntil: "networkidle2" });
    } catch (timeoutError) {
      // networkidle2 timed out — core scripts (Tailwind, Lucide) load quickly,
      // so the screenshot will still be correct even if a slow external resource
      // never finished. Log and continue rather than returning 500.
      console.warn("Page networkidle2 timed out, proceeding with screenshot:", timeoutError);
    }
    await new Promise((resolve) => setTimeout(resolve, 700));
    const screenshot = await page.screenshot({ type: "png" });
    await browser.close();

    const blob = new Blob([screenshot], { type: "image/png" });
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, blob, { cacheControl: "public, max-age=60" });
    const downloadUrl = await getDownloadURL(storageRef);
    const url = new URL(downloadUrl);
    url.searchParams.delete("token");
    const newUrl = url.toString();
    return new NextResponse(JSON.stringify({ url: newUrl }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Error generating image", { status: 500 });
  }
}
