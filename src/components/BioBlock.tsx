import { Linkedin, Globe, Save, Zap, FileQuestion } from "lucide-react";
import Block from "./ui/Block";
import homeimg from "@/home.png";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

export default function BioBlock({
  setLinkedinURL,
  setPortfolioURL,
}: {
  setLinkedinURL: (url: string) => void;
  setPortfolioURL: (url: string) => void;
}) {
  const [lUrl, setLUrl] = useState("");
  const [pUrl, setPUrl] = useState("");
  return (

    <>
      <div className="col-span-12 sm:col-span-6 grid-rows-4 md:col-span-3 space-y-4">
        <Block className="bg-gradient-to-br from-blue-500 to-purple-600 h-[230px]">
          <div className="grid h-full place-content-center text-3xl text-white">
            <Linkedin size={18} className="w-6 h-6 absolute top-2 left-2" />
            <h1 className="text-2xl font-bold mx-auto mb-2 text-blue-200">
              LinkedIn Username
            </h1>
            <div className="relative mt-2">
              <Input
                className="w-full focus-visible:ring-purple-700 placeholder:text-gray-200 bg-transparent pr-10 text-white border-yellow-200/50 ring-offset-indigo-500"
                placeholder="Enter your username"
                type="url"
                value={lUrl}
                onChange={(e) => setLUrl(e.target.value)}
              />
              <Button
                className="absolute top-0 right-0 p-2 px-2.5 bg-purple-500 hover:bg-purple-600"
                onClick={() => {
                  setLinkedinURL(lUrl);
                  toast.success("LinkedIn URL saved");
                }}
              >
                <Save className="text-white" size={20} />
              </Button>
            </div>
          </div>
        </Block>

        <Block className="bg-gradient-to-br from-gray-50 to-gray-600 h-[230px]">
          <div className="grid h-full place-content-center text-3xl text-white py-4">
            <Globe
              size={18}
              className="w-5 h-5 absolute top-2 left-2 text-gray-500"
            />
            <h1 className="text-2xl font-bold mx-auto mb-2 text-gray-800">
              Your Website URL
            </h1>
            <div className="relative mt-2">
              <Input
                className="w-full focus-visible:ring-gray-600 placeholder:text-gray-200 bg-transparent pr-10 text-secondary border-yellow-200/50 ring-offset-gray-400"
                placeholder="Enter your portfolio url"
                type="url"
                value={pUrl}
                onChange={(e) => setPUrl(e.target.value)}
              />
              <Button
                className="absolute top-0 right-0 p-2 px-2.5 bg-gray-500 hover:bg-gray-600"
                onClick={() => {
                  setPortfolioURL(pUrl);
                  toast.success("Portfolio URL saved");
                }}
              >
                <Save className="text-white" size={20} />
              </Button>
            </div>
          </div>
        </Block>
      </div>
      <Block className="col-span-12 p-0 md:col-span-6 grid-rows-1 overflow-hidden h-full relative bg-transparent">
        <Image
          src={homeimg}
          placeholder="blur"
          width={450}
          height={400}
          alt="grid"
          className="mx-auto w-full relative hover:saturate-150 transition-all hover:scale-105 duration-500 h-full object-cover rounded-xl"
        />
      </Block>
      <div className="col-span-12 sm:col-span-6 grid-rows-4 md:col-span-3 space-y-4">
        <Block className="bg-gradient-to-br from-green-500 to-cyan-500 h-[230px]">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FileQuestion className="mr-2" />
            Documentation
          </h2>
          <p className="mb-4 text-sm">
            We have a guide for you get started with the project. It includes
            installation, usage and customization
          </p>
          <Link
            href="/guide"
            className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
          >
            Read Guide
          </Link>
        </Block>

        <Block className="bg-gradient-to-br from-purple-400 to-indigo-600 h-[230px]">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Zap className="mr-2" />
            Open Source
          </h2>
          <p className="mb-4 text-sm">
            Its fully open source and you can contribute to it. If you got any
            ideas or suggestions, feel free to open an issue or a pull request.
          </p>
          <Link
            href="https://github.com/edgexhq/opbento"
            className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
          >
            Begin Your Journey
          </Link>
        </Block>
      </div>
    </>
  );
}
