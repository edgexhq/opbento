import React from 'react'
import { Calendar, Flame, Trophy } from 'lucide-react'

interface GitHubStreak {
  totalContributions: number
  currentStreak: number
  longestStreak: number
  startDate: string
  endDate: string
}

export default function GitHubStreakCard({ streak }: { streak: GitHubStreak }) {
  const { totalContributions, currentStreak, longestStreak, startDate, endDate } = streak

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="max-w-xl bg-secondary rounded-xl p-4 text-white shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-4">
          <div className="bg-[#1c1c1f] rounded-lg p-4 flex flex-col items-center justify-center">
            <Calendar className="w-8 h-8 mb-2 text-blue-400" />
            <h3 className="text-sm font-medium text-gray-400">Total Contributions</h3>
            <p className="text-3xl font-bold text-blue-400">{totalContributions.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">{formatDate(startDate)} - Present</p>
          </div>
          <div className="bg-[#1c1c1f] rounded-lg p-4 flex flex-col items-center justify-center">
            <Trophy className="w-8 h-8 mb-2 text-yellow-400" />
            <h3 className="text-sm font-medium text-gray-400">Longest Streak</h3>
            <p className="text-3xl font-bold text-yellow-400">{longestStreak}</p>
            <p className="text-xs text-gray-500 mt-2">{formatDate(startDate)} - {formatDate(endDate)}</p>
          </div>
        </div>

        <div className="bg-[#1c1c1f] rounded-lg p-6 flex flex-col items-center justify-center relative">
          <Flame className="w-28 h-28 mb-4 text-pink-500 glow-pink rounded-full p-4" />
          <h3 className="text-lg font-medium text-gray-400">Current Streak</h3>
          <p className="text-6xl font-bold text-pink-500 my-4">{currentStreak}</p>
          <p className="text-sm text-gray-500">{formatDate(startDate)} - {formatDate(endDate)}</p>
        </div>
      </div>
    </div>
  )
}