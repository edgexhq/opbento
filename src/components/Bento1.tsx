import { useState } from "react";
import { Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";
import { skillOptions } from "@/constant/skills";
import confetti from "canvas-confetti";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Activity,
  AlertTriangle,
  Calendar,
  Clipboard,
  Download,
  FileText,
  Flame,
  GitBranch,
  GitPullRequest,
  Link2,
  Linkedin,
  Loader2,
  Star,
  Trophy,
  TwitterIcon,
  Users,
  X,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Graph, StreakStats, UserStats } from "@/types";
import { generateContributionGraph } from "@/utils/generate-graph";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { generateRandomString } from "@/utils/calculations";
import { TextShimmer } from "./ui/text-shimmer";

const randomId = generateRandomString(5);

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "300", "600", "700", "500"],
});

const BentoGrid = ({
  name,
  githubURL,
  twitterURL,
  linkedinURL,
  imageUrl,
  stats,
  streak,
  graph,
  portfolioUrl,
  skills,
}: {
  name: string;
  githubURL: string;
  twitterURL: string;
  linkedinURL: string;
  imageUrl: string;
  stats: UserStats | undefined;
  streak: StreakStats | undefined;
  graph: Graph[] | undefined;
  portfolioUrl: string;
  skills: string[];
}) => {
  const [bentoLink, setBentoLink] = useState<string>("");

  const getColor = (value: number) => {
    switch (value) {
      case 0:
        return "#191919";
      case 1:
        return "#14532D";
      case 2:
        return "#1E7A1E";
      case 3:
        return "#28A745";
      case 4:
        return "#00ef57";
      default:
        return "#27272A";
    }
  };

  const [loading, setLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = async () => {
    try {
      const yamlLink = document.createElement("a");
      yamlLink.href = "/update-bento.yml";
      yamlLink.download = "update-bento.yml";
      document.body.appendChild(yamlLink);
      yamlLink.click();
      document.body.removeChild(yamlLink);
      window.URL.revokeObjectURL(yamlLink.href);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const response = await fetch("/getNewBento.ts.template");
      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.statusText}`);
      }

      let fileContent = await response.text();

      const apiUrl = `https://opbento.edgexhq.tech/api/bento?n=${encodeURIComponent(
        name,
      )}&g=${encodeURIComponent(githubURL)}&x=${encodeURIComponent(
        twitterURL,
      )}&l=${encodeURIComponent(linkedinURL)}&i=${encodeURIComponent(
        imageUrl,
      )}&p=${encodeURIComponent(portfolioUrl)}&z=${encodeURIComponent(
        randomId,
      )}`;

      fileContent = `const apiUrl = "${apiUrl}";\n` + fileContent;

      const blob = new Blob([fileContent], { type: "text/typescript" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "getNewBento.ts";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Files downloaded successfully");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Error downloading file");
    }
  };

  const handleGenerateLink = async () => {
    if (isGenerated) {
      setIsOpen(true);
      return;
    }
    setLoading(true);
    setIsGenerated(false);
    const apiURL = `/api/bento?n=${encodeURIComponent(
      name,
    )}&i=${encodeURIComponent(imageUrl)}&g=${encodeURIComponent(
      githubURL,
    )}&x=${encodeURIComponent(twitterURL)}&l=${encodeURIComponent(
      linkedinURL,
    )}&p=${encodeURIComponent(portfolioUrl)}&z=${encodeURIComponent(
      randomId
    )}&s=${encodeURIComponent(JSON.stringify(skills))}`;
    try {
      const res = await fetch(apiURL);
      const data = await res.json();
      setBentoLink(data.url);
    } catch (error) {
      console.error("Error generating or uploading the image:", error);
    }
    setLoading(false);
    setIsGenerated(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setIsOpen(true);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(`![OpBento](${bentoLink})`);
    toast.success("Copied to clipboard");
  };

  return (

    // Bento output section

    <div className={cn("max-w-5xl mx-auto", space.className)}>
      <div className="sm:p-4 grid relative grid-cols-1 md:grid-cols-4 gap-y-4 sm:gap-4 max-w-5xl mt-32 mb-8 w-full mx-auto">
        <div className="text-white py-6 px-8 rounded-lg bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 to col-span-1 row-span-1 min-h-32">
          <p className="text-xl">Hey Im</p>
          <h2 className="text-4xl font-bold mb-2 capitalize">
            {name || "User"}
          </h2>
        </div>

        <div className="bg-muted h-80 overflow-hidden rounded-lg col-span-2 row-span-2 flex items-center justify-center">
          <Image
            src={
              imageUrl ||
              "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt={name}
            width={500}
            height={500}
            className="size-full hover:scale-110 duration-500 transition-all ease object-cover"
          />
        </div>

        <a
          href={"https://x.com/" + twitterURL}
          className="bg-gradient-to-br from-black to-blue-500 p-4 relative rounded-lg overflow-hidden col-span-1 row-span-1 min-h-[150px]"
        >
          <TwitterIcon
            className="absolute glow -top-3 -left-4"
            size={100}
            color="#29BEF0"
            strokeWidth={1}
          />
          <p className="z-20 absolute bottom-6 text-xl text-center w-full">
            @{twitterURL}
          </p>
        </a>

        <div className="bg-muted relative overflow-hidden rounded-lg col-span-1 row-span-2">
          <img
            src="https://i.postimg.cc/NGK80VQ1/cf954b8923fbafc5cfc0c66344b6a6f9.jpg"
            alt=""
            className="absolute saturate-150 size-full object-cover inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-b to-black/80 from-transparent"></div>
          <p className="z-20 absolute bottom-6 text-center w-full">
            <a
              href={"https://github.com/" + githubURL}
              className="text-white font-semibold hover:underline p-2 px-4 bg-pink-600 opacity-80 rounded-md backdrop-blur"
            >
              @{githubURL}
            </a>
          </p>
        </div>

        <a
          href={"https://www.linkedin.com/in/" + linkedinURL}
          className="bg-gradient-to-tl from-black to-blue-600 p-4 relative rounded-lg overflow-hidden col-span-1 columns-3 row-span-1 min-h-[150px]"
        >
          <Linkedin
            className="absolute glow -bottom-1 -right-2"
            size={80}
            color="#56d2ff"
            strokeWidth={1}
          />
          <p className="text-center text-lg w-full">@{linkedinURL}</p>
        </a>

        <div className="bg-muted overflow-hidden border border-red-600/40 rounded-lg col-span-2 row-span-1">
          <img
            src={`https://github-readme-activity-graph.vercel.app/graph?username=${githubURL}&bg_color=030312&color=ff8080&line=e00a60&point=ff7171&area=true&hide_border=true`}
            alt="graph"
            className="size-full object-cover h-[150px]"
          />
        </div>

        <div className="p-4 bg-gradient-to-br from-gray-100 via-gray-300 to-gray-600/80 rounded-lg col-span-1 row-span-1 flex relative flex-col items-center justify-center min-h-32 overflow-hidden">
          <h1 className="font-semibold text-xl bg-gradient-to-b from-[#797979] to-[#040e1f] bg-clip-text absolute top-6 break-all left-4 text-transparent leading-[100%] tracking-tighter">
            {portfolioUrl.startsWith("https://")
              ? portfolioUrl.replace("https://", "")
              : portfolioUrl}
          </h1>
          <img
            src="/earth.png"
            width={200}
            height={200}
            alt=""
            className="absolute -bottom-28 -right-28"
          />
        </div>

        {skills.length > 0 && (
          <div className="bg-muted p-4 rounded-lg col-span-4 row-span-1">
            <h3 className="text-xl font-bold text-center text-gray-200 mb-3">
              Skills
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill) => {
                // Find the skill data from the skillOptions array
                const skillData = skillOptions.find((s) => s.name === skill);
                return (
                  <div
                    key={skill}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-lg shadow-md hover:scale-105 transition"
                  >
                    {skillData && (
                      <img
                        src={skillData.logo}
                        alt={skill}
                        className="w-6 h-6 rounded-md"
                      />
                    )}
                    <span className="font-medium">{skill}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {stats && (
          <div className="grid gap-4 grid-cols-4 col-span-4 row-span-2">
            <div className="col-span-2 row-span-2">
              <div className="grid grid-cols-4 grid-rows-3 gap-4 auto-rows-fr rounded-xl overflow-hidden size-full">
                <div className="bg-gradient-to-br from-amber-500/40 via-amber-500/10 to-transparent rounded-xl p-4 flex flex-col justify-between col-span-2 relative row-span-2">
                  <div className="flex absolute top-2 px-3 left-0 items-center justify-between w-full opacity-70">
                    <Star size={40} fill="gold" color="gold" />
                    <Star size={40} fill="gold" color="gold" />
                    <Star size={40} fill="gold" color="gold" />
                    <Star size={40} fill="gold" color="gold" />
                    <Star size={40} fill="gold" color="gold" />
                  </div>
                  <h3 className="text-2xl mt-16 text-end text-muted-foreground font-medium">
                    Total Stars
                  </h3>
                  <div className="text-end text-yellow-400 text-7xl font-bold">
                    {stats["Star Earned"]}
                  </div>
                </div>

                <div className="bg-gradient-to-b from-pink-900/20 to-neutral-900/50 rounded-xl relative p-4 flex flex-col justify-between col-span-1 row-span-1">
                  <GitPullRequest
                    className="text-pink-400 absolute top-2"
                    size={20}
                  />
                  <span className="text-gray-300 text-sm pt-4 font-medium">
                    PRs
                  </span>

                  <div className="text-pink-400 text-3xl font-bold mt-2">
                    {stats["Pull Requests"]}
                  </div>
                </div>
                <div className="bg-gradient-to-tl from-rose-950/20 to-stone-900/50 relative rounded-xl p-4 flex flex-col justify-between col-span-1 row-span-1">
                  <Users className="text-red-500 absolute top-2" size={20} />
                  <span className="text-gray-300 text-sm pt-4 font-medium">
                    Followers
                  </span>

                  <div className="text-red-500 text-4xl font-bold mt-2">
                    {stats.Followers}
                  </div>
                </div>
                <div className="bg-gradient-to-t from-black to-slate-800/50 overflow-hidden relative rounded-xl p-4 flex flex-col justify-between col-span-2 row-span-2">
                  <img
                    src={"/surf.svg"}
                    alt=""
                    width={450}
                    height={400}
                    className="absolute inset-0 object-cover rotate-180"
                  />
                  <div className="flex items-center w-full">
                    <Activity className="text-green-400" size={45} />
                    <span className="text-muted-foreground w-full text-end text-2xl font-medium">
                      Commits
                    </span>
                  </div>
                  <div className="text-green-400 text-6xl text-end font-bold ">
                    {stats.Commits}
                  </div>
                </div>
                <div className="bg-muted/30 relative overflow-hidden rounded-xl p-4 flex flex-col justify-between col-span-2 row-span-1">
                  <img
                    src={"/blocks.svg"}
                    alt=""
                    width={400}
                    height={400}
                    className="absolute -z-10 inset-0 object-cover brightness-150"
                  />
                  <GitBranch
                    className="text-blue-400 glow absolute left-12 bottom-4"
                    size={40}
                  />
                  <span className="text-muted-foreground text-center w-full text-sm font-medium">
                    Contributed To
                  </span>
                  <div className="text-blue-400 text-4xl text-center font-bold mt-2">
                    {stats["Contributed To"]}
                  </div>
                </div>
              </div>
            </div>
            <div className="size-full col-span-2 row-span-2">
              <div className="max-w-xl size-full rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 size-full">
                  <div className="flex size-full flex-col space-y-4">
                    <div className="bg-gradient-to-tr from-slate-900 to-secondary/20 rounded-lg p-4 h-full flex flex-col items-center justify-center">
                      <Calendar className="w-8 h-8 mb-2 text-blue-400" />
                      <h3 className="text-sm font-medium text-gray-400">
                        Total Contributions
                      </h3>
                      <p className="text-3xl font-bold text-blue-400">
                        {streak?.totalContributions}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {streak?.firstDateofContribution
                          ? streak?.firstDateofContribution + "- Present"
                          : "No contributions yet"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gradient-to-b from-yellow-500/15 via-transparent to-yellow-500/10 p-4 h-full flex flex-col items-center justify-center">
                      <Trophy className="w-8 h-8 mb-2 text-yellow-400" />
                      <h3 className="text-sm font-medium text-gray-400">
                        Longest Streak
                      </h3>
                      <p className="text-3xl font-bold text-yellow-400">
                        {streak?.longestStreak}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {streak?.longestStreakStartDate &&
                          streak?.longestStreakEndDate
                          ? streak?.longestStreakStartDate +
                          " - " +
                          streak?.longestStreakEndDate
                          : "No streak yet"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r to-orange-800/10 from-orange-800/10 via-muted/10 rounded-lg p-6 flex flex-col items-center justify-center relative">
                    <Flame className="w-28 h-28 mb-4 text-orange-600 glow-orange rounded-full p-4" />
                    <h3 className="text-lg font-medium text-gray-400">
                      Current Streak
                    </h3>
                    <p className="text-6xl font-bold text-orange-600 my-4">
                      {streak?.currentStreak}
                    </p>
                    <p className="text-sm text-gray-500">
                      {streak?.currentStreakStartDate &&
                        streak?.currentStreakEndDate
                        ? streak?.currentStreakStartDate +
                        " - " +
                        streak?.currentStreakEndDate
                        : new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {graph && (
          <div className="bg-gradient-to-br from-green-950/80 p-4 col-span-4 row-span-2 rounded-lg w-full h-full">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                {githubURL}&apos;s Contribution Graph
              </h1>
              <div className="flex items-center justify-end text-sm">
                <span>Less</span>
                <div className="flex gap-2 mx-3">
                  {[0, 1, 2, 3, 4].map((value) => (
                    <div
                      key={value}
                      className="w-4 h-4 rounded-sm"
                      title={`Contribution level ${value}`}
                      style={{ backgroundColor: getColor(value) }}
                    />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>
            <div
              className="flex justify-center pb-4 items-center w-full h-full"
              dangerouslySetInnerHTML={{
                __html: generateContributionGraph(graph),
              }}
            />
          </div>
        )}
        <div className="bg-zinc-900/50 hover:animate-pulse cursor-pointer hover:scale-110 hover:rotate-0 hover:-translate-y-2 duration-500 transition-all hover:brightness-125 shadow-md rounded-xl absolute py-2 px-4 text-xs text-foreground/70 -rotate-6 backdrop-blur-md -bottom-1 right-0">
          made by <span className="uppercase ml-1 text-rose-500">opbento</span>
        </div>
      </div>
      {githubURL && (
        <div className="flex flex-col items-center justify-center gap-2 mb-6 w-full">
          <Button className="w-fit mx-auto" onClick={handleGenerateLink}>
            Generate Bento
            {loading && <Loader2 className="ml-2 size-4 animate-spin" />}
          </Button>
          {loading && (
            <TextShimmer className="text-sm tracking-wide">
              Generating , wait for 10secs...
            </TextShimmer>
          )}
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className="max-w-2xl bg-gradient-to-b from-[#1A1A1A] to-[#121212] border-gray-800 shadow-2xl rounded-xl overflow-hidden">
              <AlertDialogHeader className="relative">
                <AlertDialogTitle className="text-2xl font-bold text-white mb-2">
                  Your OP Bento is ready
                </AlertDialogTitle>
                <Button
                  variant="ghost"
                  className="absolute right-0 top-0 text-gray-400 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </AlertDialogHeader>

              {/* Warning Note */}
              <div className="bg-yellow-900/20 border border-red-700/50 rounded-lg px-4 py-3 mb-4">
                <div className="flex items-center gap-2 text-red-500">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-xs font-medium">
                    Do not change the existing files else setup won&apos;t work
                  </p>
                </div>
              </div>

              {/* Embed Link Section */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Link2 className="w-4 h-4" />
                  <h3 className="flex flex-wrap items-center gap-3 text-base">
                    Embed Link
                    <p className="text-gray-500 text-xs">
                      Paste this in your README.md
                    </p>
                  </h3>
                </div>
                <div className="flex gap-2 relative ">
                  <Input
                    value={`[![OpBento](${bentoLink})](https://opbento.edgexhq.tech)`}
                    readOnly
                    className="focus:ring-offset-secondary pr-16"
                  />
                  <Button
                    className="absolute top-0 right-0"
                    onClick={copyToClipboard}
                  >
                    <Clipboard />
                  </Button>
                </div>
              </div>

              {/* Download Files Section */}
              <div className="space-y-2 mb-4">
                {bentoLink && (
                  <Button onClick={handleDownload} variant={"secondary"}>
                    Download Files <Download size={16} className="ml-2" />
                  </Button>
                )}
              </div>

              {/* Files Section */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button className="group bg-[#1E1E1E] hover:bg-[#252525] transition-all duration-300 rounded-xl p-2 flex items-center justify-between border border-gray-800 hover:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500/10 rounded-lg aspect-square w-8 h-8 p-1.5">
                      <span className="font-mono text-blue-400 text-xs">
                        TS
                      </span>
                    </div>
                    <span className="text-gray-300 font-medium text-sm">
                      getNewBento.ts
                    </span>
                  </div>
                  <div className="bg-[#1A1A1A] group-hover:bg-[#2A2A2A] p-1.5 rounded-lg transition-colors">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 12L3 7L4.4 5.55L8 9.15L11.6 5.55L13 7L8 12Z"
                        fill="#4ADE80"
                      />
                    </svg>
                  </div>
                </button>

                <button className="group bg-[#1E1E1E] hover:bg-[#252525] transition-all duration-300 rounded-xl p-2 flex items-center justify-between border border-gray-800 hover:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="bg-red-500/10 rounded-lg p-1.5">
                      <FileText className="w-5 h-5 text-red-400" />
                    </div>
                    <span className="text-gray-300 font-medium text-sm">
                      update-bento.yml
                    </span>
                  </div>
                  <div className="bg-[#1A1A1A] group-hover:bg-[#2A2A2A] p-1.5 rounded-lg transition-colors">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 12L3 7L4.4 5.55L8 9.15L11.6 5.55L13 7L8 12Z"
                        fill="#4ADE80"
                      />
                    </svg>
                  </div>
                </button>
              </div>

              {/* Guide Button */}
              <div className="flex justify-between items-center">
                <Link
                  href="/guide"
                  className="text-gray-400 inline-flex items-center gap-2 hover:text-white transition-colors text-sm py-2 h-auto"
                >
                  Guide <Link2 className="text-red-500" />
                </Link>

                <Button
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors text-sm py-2 h-auto"
                >
                  Close
                </Button>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};

export default BentoGrid;
