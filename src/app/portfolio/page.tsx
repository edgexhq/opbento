"use client"

import BentoGrid from "@/components/Bento1";

export default function BentoFolio() {
  // Search Params
  const { searchParams } = new URL(window.location.href);
  const n = searchParams.get("n");
  const g = searchParams.get("g");
  const i = searchParams.get("i");
  const x = searchParams.get("x");

  if (!n || !g || !i || !x) {
    return <div>Invalid URL</div>;
  }

  return (
    <BentoGrid
      name={n}
      githubURL={g}
      twitterURL={x}
      linkedinURL={""}
      imageUrl={i}
      stats={undefined}
      showStats={false}
      streak={undefined}
      showGraph={false}
    />
  );
}
