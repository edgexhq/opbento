"use server";

import { GitHubResponse, UserStats } from "@/types";
import getUserStats from "./getUserStats";
import { githubGraphql } from "./githubGraphql";
import { defaultUserStats } from "./userStatsConstants";

const userStatsQuery = `
  following {
    totalCount
  }
  followers {
    totalCount
  }
  gists {
    totalCount
  }
  contributionsCollection {
    totalCommitContributions
  }
  repositoriesContributedTo(
    first: 1
    contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]
  ) {
    totalCount
  }
  pullRequests(first: 1) {
    totalCount
  }
  issues(first: 1) {
    totalCount
  }
  organizations(first: 1) {
    totalCount
  }
  sponsoring(first: 1) {
    totalCount
  }
  sponsors{
    totalCount
  }
  createdAt
  updatedAt
  repositoriesWithStargazerCount: repositories(
    first: 100
    privacy: PUBLIC
    ownerAffiliations: OWNER
    orderBy: {field: STARGAZERS, direction: DESC}
  ) {
    totalCount
    nodes {
      stargazerCount
    }
  }
`;


const fetchUserData = async (
  login: string,
): Promise<{ userStats: UserStats }> => {
  const query = `
    query ($username: String!) {
      user(login: $username) {
        ${userStatsQuery}
      }
    }
    `;

  const response: GitHubResponse | null = await githubGraphql({
    query,
    variables: { username: login },
  });

  if (!response?.user) {
    return { userStats: defaultUserStats };
  }

  const { user } = response;

  const userStats: UserStats = getUserStats(user);

  return {
    userStats,
  };
};

export default fetchUserData;
