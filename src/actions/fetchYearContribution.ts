"use server";

import { fetchGitHubData } from "./fetchGithubData";

export async function fetchYearContributions(
  username: string,
  year: number,
): Promise<{ date: string; contributionCount: number }[]> {
  const query = `
    query ($user: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $user) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const start = `${year}-01-01T00:00:00Z`;
  const end = `${year}-12-31T23:59:59Z`;

  const data = await fetchGitHubData(query, {
    user: username,
    from: start,
    to: end,
  });
  if (!data?.data?.user?.contributionsCollection?.contributionCalendar?.weeks) {
    return [];
  }
  const weeks =
    data.data.user.contributionsCollection.contributionCalendar.weeks;

  // Aggregate all the contribution days from the year
  let contributionDays: { date: string; contributionCount: number }[] = [];
  weeks.forEach((week: any) => {
    week.contributionDays.forEach((day: any) => {
      contributionDays.push({
        date: day.date,
        contributionCount: day.contributionCount,
      });
    });
  });

  return contributionDays;
}
