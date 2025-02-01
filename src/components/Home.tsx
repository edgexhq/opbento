"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Block from "./ui/Block";
import Navbar from "./Navbar";
import SocialsBlock from "./SocialBlock";
import { Highlight } from "./ui/highlight";
import BentoGrid from "./Bento1";
import BioBlock from "./BioBlock";
import { Graph, StreakStats, UserStats } from "@/types";

export interface ProjectType {
  title: string;
  description: string;
  imageUrl: string;
}

export default function HomePage() {
  const [name, setName] = useState("");
  const [githubURL, setGithubURL] = useState("");
  const [linkedinURL, setLinkedinURL] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [twitterURL, setTwitterURL] = useState("");
  const [portfolioURL, setPortfolioURL] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const [stats, setStats] = useState<UserStats | undefined>(undefined);
  const [streak, setStreak] = useState<StreakStats | undefined>(undefined);
  const [graph, setGraph] = useState<Graph[] | undefined>(undefined);

  return (
    <div className="w-full">
      <div className="min-h-svh p-4 max-w-7xl mx-auto w-full">
        <Navbar />
        <motion.div
          initial="initial"
          animate="animate"
          transition={{
            staggerChildren: 0.08,
          }}
          className="grid max-w-7xl mx-auto grid-flow-dense grid-cols-12 gap-4 w-full"
        >
          <HeaderBlock />

          <SocialsBlock
            setName={setName}
            setGithubURL={setGithubURL}
            setTwitterURL={setTwitterURL}
            setImageUrl={setImageUrl}
            setStats={setStats}
            setStreak={setStreak}
            setGraph={setGraph}
            setSkills={setSkills}
          />

          <BioBlock
            setLinkedinURL={setLinkedinURL}
            setPortfolioURL={setPortfolioURL}
          />
          
        </motion.div>

        <BentoGrid
          name={name}
          githubURL={githubURL}
          twitterURL={twitterURL}
          linkedinURL={linkedinURL}
          imageUrl={imageUrl}
          stats={stats}
          streak={streak}
          graph={graph}
          portfolioUrl={portfolioURL}
          skills={skills}
        />
      </div>
    </div>
  );
}


const HeaderBlock = () => (

  // Header block, as the component name suggests

  <Block className="col-span-12 row-span-2 md:col-span-6 relative">
    <h1 className="mb-4 text-3xl sm:text-4xl font-bold sm:leading-normal">
      Make your Github Profile <Highlight>modern and trendy !</Highlight>
    </h1>
    <p className="flex items-center mt-10 gap-1 text-muted-foreground">
      Build your own bento grid, copy the HTML or Markdown code and paste it on
      to the top of your GitHub Profile readme to make your Github profile look
      cool. ✨
    </p>
    <div className="mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-5">
      <div className="flex -space-x-4">
        <img
          className="inline-block h-10 w-10 rounded-full ring-2 ring-blue-50 dark:ring-gray-800"
          src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=300&amp;h=300&amp;q=80"
          alt="Image Description"
        />
        <img
          className="inline-block h-10 w-10 rounded-full ring-2 ring-blue-50 dark:ring-gray-800"
          src="https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=300&amp;h=300&amp;q=80"
          alt="Image Description"
        />
        <img
          className="inline-block h-10 w-10 rounded-full ring-2 ring-blue-50 dark:ring-gray-800"
          src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=300&amp;h=300&amp;q=80"
          alt="Image Description"
        />
        <img
          className="inline-block h-10 w-10 rounded-full ring-2 ring-blue-50 dark:ring-gray-800"
          src="/other-random-dude.jpg"
          alt="Image Description"
        />
        <img
          className="inline-block object-cover h-10 w-10 rounded-full ring-2 ring-blue-50 dark:ring-gray-800"
          src="/random-stock-photo.jpg"
          alt="Image Description"
        />
      </div>
      <div className="flex flex-col justify-between items-center sm:items-start">
        <div className="flex gap-0.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-star h-4 w-4 text-amber-400 fill-amber-400"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-star h-4 w-4 text-amber-400 fill-amber-400"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-star h-4 w-4 text-amber-400 fill-amber-400"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-star h-4 w-4 text-amber-400 fill-amber-400"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-star h-4 w-4 text-amber-400 fill-amber-400"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
        <p className="">
          <span className="font-semibold">100+ </span> Github users
        </p>
      </div>
    </div>
  </Block>
);
