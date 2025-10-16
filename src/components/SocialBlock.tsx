import {
  Github,
  Twitter,
  CircleUser,
  Save,
  Loader2,
  Image,
  X,
} from "lucide-react";
import Block from "./ui/Block";
import { Input } from "./ui/input";
import { Graph, StreakStats, UserStats } from "@/types";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { skillOptions } from "@/constant/skills";

export default function SocialsBlock({
  setName,
  setGithubURL,
  setTwitterURL,
  setImageUrl,
  setStats,
  setStreak,
  setGraph,
  setSkills,
}: {
  setName: (name: string) => void;
  setGithubURL: (url: string) => void;
  setTwitterURL: (url: string) => void;
  setImageUrl: (url: string) => void;
  setStats: (stats: UserStats | undefined) => void;
  setStreak: (streak: StreakStats | undefined) => void;
  setGraph: (graph: Graph[] | undefined) => void;
  setSkills: (skills: string[]) => void;
}) {
  const [tUrl, setTUrl] = useState("");
  const [gUrl, setGUrl] = useState("");
  const [iUrl, setIUrl] = useState("");
  const [nameText, setNameText] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // handle skill selection
  const handleSkillToggle = (skill: string) => {
    const updatedSkills = [...selectedSkills, skill];
    setSelectedSkills(updatedSkills);
    setSkills(updatedSkills); // Update parent state
  };

  const handleRemoveSkill = (skill: string) => {
    const updatedSkills = selectedSkills.filter((s) => s !== skill);
    setSelectedSkills(updatedSkills);
    setSkills(updatedSkills); // Update parent state
  };

  const handleSaveSkills = async () => {
    setLoading(true);
    setSkills(selectedSkills);
    toast.success("Skills saved successfully!");
    setLoading(false);
  };

  const handleStats = async () => {
    setLoading(true);
    setGraph(undefined);
    setStats(undefined);
    setStreak(undefined);
    if (!gUrl) {
      toast.error("Github Username is required");
      setLoading(false);
      return;
    }

    const res1 = await fetch("/api/stats?&username=" + gUrl);
    const data = await res1.json();
    if (data.error) {
      toast.error("Username not found");
      setLoading(false);
      return;
    }
    setStats(data.stats);
    const res2 = await fetch("/api/streak?&username=" + gUrl);
    const streak = await res2.json();
    setStreak(streak.stats);

    const res3 = await fetch("/api/graph?username=" + gUrl);
    const graph = await res3.json();
    setGraph(graph);

    setGithubURL(gUrl);
    toast.success("Github Username saved");
    setLoading(false);
  };

  return (
    <>
      <Block className="col-span-12 sm:col-span-6 bg-red-500 md:col-span-3">
        <div className="grid h-full text-3xl text-white py-4">
          <CircleUser size={18} className="w-6 h-6 absolute top-2 left-2" />
          <h1 className="text-2xl font-bold mx-auto mb-2 text-rose-200">
            Your Name
          </h1>
          <div className="relative mt-2">
            <Input
              className="w-full placeholder:text-gray-200 bg-transparent border border-red-200/50 pr-10 text-white ring-offset-red-500"
              placeholder="Enter your first Name"
              value={nameText}
              onChange={(e) => setNameText(e.target.value)}
            />
            <Button
              className="absolute top-0 right-0 p-2 px-2.5 bg-red-600 hover:bg-red-700"
              onClick={() => {
                setName(nameText);
                toast.success("Name saved");
              }}
            >
              <Save className="text-white" size={20} />
            </Button>
          </div>
        </div>
      </Block>

      <Block className="col-span-12 sm:col-span-6 bg-gradient-to-br from-yellow-500 to-rose-400 md:col-span-3">
        <div className="grid h-full text-3xl text-white py-4">
          <Image size={18} className="w-5 h-5 absolute top-2 left-2" />
          <h1 className="text-2xl font-bold mx-auto mb-2 text-yellow-200">
            Image URL
          </h1>
          <div className="relative mt-2">
            <Input
              className="w-full focus-visible:ring-orange-600 placeholder:text-gray-200 bg-transparent pr-10 text-white border-yellow-200/50 ring-offset-amber-500"
              placeholder="Enter your image url"
              type="url"
              value={iUrl}
              onChange={(e) => setIUrl(e.target.value)}
            />
            <Button
              className="absolute top-0 right-0 p-2 px-2.5 bg-orange-500 hover:bg-orange-600"
              onClick={() => {
                setImageUrl(iUrl);
                toast.success("Image URL saved");
              }}
            >
              <Save className="text-white" size={20} />
            </Button>
          </div>
        </div>
      </Block>

      <Block className="col-span-12 sm:col-span-6 bg-green-600 md:col-span-3">
        <div className="grid h-full text-3xl text-white py-4">
          <Github size={18} className="w-5 h-5 absolute top-2 left-2" />
          <h1 className="text-2xl font-bold mx-auto mb-2 text-green-200">
            Github Username
          </h1>
          <div className="relative mt-2">
            <Input
              className="w-full pr-10 focus-visible:ring-green-700 placeholder:text-gray-200 bg-transparent border border-green-200/50 text-white ring-offset-green-600"
              placeholder="Enter your username"
              value={gUrl}
              onChange={(e) => setGUrl(e.target.value)}
            />
            <Button
              className="absolute top-0 right-0 p-2 px-2.5 bg-emerald-500 hover:bg-green-500"
              onClick={async () => {
                await handleStats();
              }}
            >
              {loading ? (
                <Loader2 className="text-white animate-spin" size={20} />
              ) : (
                <Save className="text-white" size={20} />
              )}
            </Button>
          </div>
        </div>
      </Block>

      <Block className="col-span-12 sm:col-span-6 bg-blue-500 md:col-span-3">
        <div className="grid h-full text-3xl text-white py-4">
          <Twitter
            size={18}
            className="w-5 h-5 absolute top-2 left-2 text-white"
          />
          <h1 className="text-2xl font-bold mx-auto mb-2 text-blue-200">
            Twitter Username
          </h1>
          <div className="relative mt-2">
            <Input
              className="w-full focus-visible:ring-blue-700 placeholder:text-gray-200 bg-transparent pr-10 border border-blue-200/50 ring-offset-blue-500"
              placeholder="Enter your username"
              value={tUrl}
              onChange={(e) => setTUrl(e.target.value)}
            />
            <Button
              className="absolute top-0 right-0 p-2 px-2.5 bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setTwitterURL(tUrl);
                toast.success("Twitter Username saved");
              }}
            >
              <Save className="text-white" size={20} />
            </Button>
          </div>
        </div>
      </Block>

      {/* skills selections section */}
      <Block className="col-span-12 row-span-2 md:col-span-6 p-4 bg-gradient-to-br from-green-400 to-green-900">
        <h2 className="text-xl font-bold text-gray-900">Choose Your Skills</h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {skillOptions
            .filter((skill) => !selectedSkills.includes(skill.name)) // Hide selected skills
            .map((skill) => (
              <button
                key={skill.name}
                onClick={() => handleSkillToggle(skill.name)}
                className="flex items-center gap-2 px-3 py-1 rounded-lg border bg-transparent text-black border-gray-600 hover:bg-blue-400 hover:border-blue-600 transition"
              >
                <img src={skill.logo} alt={skill.name} className="w-5 h-5" />
                {skill.name}
              </button>
            ))}
        </div>

        {selectedSkills.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-black">Selected Skills:</h3>
            <div className="flex flex-wrap mt-2 gap-2">
              {selectedSkills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-lg"
                >
                  <img
                    src={
                      skillOptions.find((s) => s.name === skill)?.logo ||
                      "/logos/default.png"
                    }
                    alt={skill}
                    className="w-5 h-5"
                  />
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 p-1 rounded-full bg-white text-blue-500 hover:bg-red-600 hover:text-white transition"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0">
          <div className="flex items-center justify-end p-6">
            <Button
              className="top-0 right-0 px-2.5 size-14 bg-green-500 hover:bg-green-900"
              onClick={async () => {
                await handleSaveSkills();
              }}
            >
              {loading ? (
                <Loader2 className="text-white animate-spin" size={30} />
              ) : (
                <Save className="text-white" size={30} />
              )}
            </Button>
          </div>
        </div>
      </Block>
    </>
  );
}
