"use client"

import { AppShell } from "@/components/app-shell"
import { useFetch } from "@/hooks/use-fetch"
import { LoadingState } from "@/components/ui/loading-state"
import { ErrorState } from "@/components/ui/error-state"

interface DashboardStats {
  meetings: number
  tasks: number
  aiStatus: "active" | "disabled"
}

export default function OverviewPage() {
  const { data: stats, loading, error, refetch } = useFetch<DashboardStats>("/api/dashboard/stats")

  return (
    <AppShell>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b pb-4 md:pb-6 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/20 dark:to-blue-950/20 -m-4 md:-m-6 mb-4 md:mb-6 p-4 md:p-6 rounded-t-lg">
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            IntegrateWise Overview
          </h1>
          <p className="text-muted-foreground mt-2 md:mt-3 text-sm md:text-base">
            {loading
              ? "Loading your workspace..."
              : "Lightweight view—no external APIs. Enable calendar/memory for richer insights."}
          </p>
        </div>

        {loading && <LoadingState message="Loading dashboard..." />}
        {error && <ErrorState message={error.message} onRetry={refetch} />}

        {stats && (
          <>
            {/* Stats Cards */}
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <div className="border rounded-xl p-4 md:p-6 bg-gradient-to-br from-white to-teal-50 dark:from-card dark:to-teal-950/20 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 text-teal-600 dark:text-teal-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg md:text-xl font-semibold">Today</h2>
                </div>
                <ul className="space-y-2 md:space-y-3 text-sm">
                  <li className="flex items-center justify-between p-2 rounded bg-white/50 dark:bg-black/20">
                    <span className="text-muted-foreground">Meetings:</span>
                    <span className="font-semibold text-base md:text-lg">{stats.meetings}</span>
                  </li>
                  <li className="flex items-center justify-between p-2 rounded bg-white/50 dark:bg-black/20">
                    <span className="text-muted-foreground">Tasks:</span>
                    <span className="font-semibold text-base md:text-lg">{stats.tasks}</span>
                  </li>
                  <li className="flex items-center justify-between p-2 rounded bg-white/50 dark:bg-black/20">
                    <span className="text-muted-foreground">AI Status:</span>
                    <span
                      className={`font-semibold text-base md:text-lg ${stats.aiStatus === "active" ? "text-green-600" : "text-amber-600"}`}
                    >
                      {stats.aiStatus === "active" ? "Active" : "Disabled"}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="border rounded-xl p-4 md:p-6 bg-gradient-to-br from-white to-blue-50 dark:from-card dark:to-blue-950/20 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold">Quick Actions</h2>
                </div>
                <ul className="space-y-3 text-sm">
                  <li>
                    <button className="w-full text-left p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium transition-colors">
                      📅 Enable Calendar Integration
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left p-3 rounded-lg bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-medium transition-colors">
                      🧠 Enable Memory Insights
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left p-3 rounded-lg bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-medium transition-colors">
                      🎯 Pick a Template
                    </button>
                  </li>
                </ul>
              </div>

              <div className="border rounded-xl p-4 md:p-6 bg-gradient-to-br from-white to-purple-50 dark:from-card dark:to-purple-950/20 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold">Next Steps</h3>
                    <p className="text-sm md:text-base text-muted-foreground mt-1">
                      Choose a template to unfold domain pages and configure your workspace.
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs md:text-sm font-medium bg-gray-200 dark:bg-gray-800 rounded">
                    Optional
                  </span>
                </div>
                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg px-4 py-3 text-sm font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">
                  Browse Templates →
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <div className="border rounded-lg p-4 md:p-6 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold">Calendar Integration</h3>
                    <p className="text-sm md:text-base text-muted-foreground mt-1">
                      Connect Google, Microsoft, or Apple Calendar
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs md:text-sm font-medium bg-gray-200 dark:bg-gray-800 rounded">
                    Optional
                  </span>
                </div>
                <ul className="space-y-2 md:space-y-3 text-sm mb-4">
                  <li className="flex items-center gap-2 md:gap-3">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>See today's meetings</span>
                  </li>
                  <li className="flex items-center gap-2 md:gap-3">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Auto-populate tasks from events</span>
                  </li>
                  <li className="flex items-center gap-2 md:gap-3">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Client-side only, no server keys</span>
                  </li>
                </ul>
                <button className="w-full border border-blue-600 text-blue-600 rounded-md px-4 py-2 text-sm md:text-base font-semibold hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
                  Enable Calendar
                </button>
              </div>

              <div className="border rounded-lg p-4 md:p-6 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-background">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold">Memory Insights</h3>
                    <p className="text-sm md:text-base text-muted-foreground mt-1">
                      AI-powered task and insight extraction
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs md:text-sm font-medium bg-gray-200 dark:bg-gray-800 rounded">
                    Optional
                  </span>
                </div>
                <ul className="space-y-2 md:space-y-3 text-sm mb-4">
                  <li className="flex items-center gap-2 md:gap-3">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Track overdue items</span>
                  </li>
                  <li className="flex items-center gap-2 md:gap-3">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Generate action items</span>
                  </li>
                  <li className="flex items-center gap-2 md:gap-3">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Consent-based, on-demand</span>
                  </li>
                </ul>
                <button className="w-full border border-purple-600 text-purple-600 rounded-md px-4 py-2 text-sm md:text-base font-semibold hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors">
                  Enable Memory
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}
