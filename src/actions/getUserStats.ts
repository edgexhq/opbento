interface UserData {
  followers: { totalCount: number };
  repositoriesWithStargazerCount: {
    totalCount: number;
    nodes: { stargazerCount: number }[];
  };
  organizations: { totalCount: number };
  gists: { totalCount: number };
  pullRequests: { totalCount: number };
  issues: { totalCount: number };
  contributionsCollection: { totalCommitContributions: number };
  sponsors: { totalCount: number };
  repositoriesContributedTo: { totalCount: number };
}

interface UserStats {
  Followers: number;
  Repositories: number;
  Organizations: number;
  Gists: number;
  "Pull Requests": number;
  Issues: number;
  Commits: number;
  Sponsors: number;
  "Contributed To": number;
  "Star Earned": number;
}

const getUserStats = (userData: UserData): UserStats => {
  const stats: UserStats = {
    Followers: userData.followers.totalCount,
    Repositories: userData.repositoriesWithStargazerCount.totalCount,
    Organizations: userData.organizations.totalCount,
    Gists: userData.gists.totalCount,
    "Pull Requests": userData.pullRequests.totalCount,
    Issues: userData.issues.totalCount,
    Commits: userData.contributionsCollection.totalCommitContributions,
    Sponsors: userData.sponsors.totalCount,
    "Contributed To": userData.repositoriesContributedTo.totalCount,
    "Star Earned": 0,
  };

  stats["Star Earned"] = userData.repositoriesWithStargazerCount.nodes.reduce(
    (acc, repo) => acc + repo.stargazerCount,
    0,
  );

  return stats;
};

export default getUserStats;
