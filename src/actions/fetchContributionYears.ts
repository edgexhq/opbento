"use server";

import { fetchGitHubData } from "./fetchGithubData";

export async function fetchContributionYears(
  username: string,
): Promise<number[]> {
  const query = `
    query ($user: String!) {
      user(login: $user) {
        contributionsCollection {
          contributionYears
        }
      }
    }
  `;

  const data = await fetchGitHubData(query, { user: username });
  if (!data?.data?.user?.contributionsCollection?.contributionYears) {
    return [];
  }
  return data.data.user.contributionsCollection.contributionYears;
}
