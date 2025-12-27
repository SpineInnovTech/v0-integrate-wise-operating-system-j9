"use client"

/**
 * Tasks Page - With API Integration
 *
 * Client-only task management with API data fetching and mutations
 * Shows overdue and upcoming tasks with server dependencies
 */

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { useFetch } from "@/hooks/use-fetch"
import { LoadingState } from "@/components/ui/loading-state"
import { ErrorState } from "@/components/ui/error-state"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api-client"

interface Task {
  id: string
  title: string
  due: string
  status: "overdue" | "pending" | "completed"
  priority?: "high" | "medium" | "low"
}

export default function TasksPage() {
  const [filter, setFilter] = useState<"all" | "overdue" | "pending">("all")

  const { data: tasks = [], loading, error, refetch } = useFetch<Task[]>("/api/tasks")

  const overdueTasks = tasks.filter((t) => t.status === "overdue")
  const pendingTasks = tasks.filter((t) => t.status === "pending")
  const completedTasks = tasks.filter((t) => t.status === "completed")
  const displayTasks = filter === "all" ? tasks : filter === "overdue" ? overdueTasks : pendingTasks

  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    const newStatus = task.status === "completed" ? "pending" : "completed"
    await api.put(`/api/tasks/${id}`, { status: newStatus })
    refetch()
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 dark:bg-red-950"
      case "medium":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950"
      case "low":
        return "text-green-600 bg-green-50 dark:bg-green-950"
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-950"
    }
  }

  return (
    <AppShell>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-7xl mx-auto">
        <div className="border-b pb-4 md:pb-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 -m-4 md:-m-6 mb-4 md:mb-6 p-4 md:p-6 rounded-t-lg">
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Tasks
          </h1>
          <p className="text-muted-foreground mt-2 md:mt-3 text-sm md:text-base">
            {loading ? "Loading tasks..." : "Manage your tasks and track deadlines."}
          </p>
        </div>

        {loading && <LoadingState message="Loading tasks..." size="sm" />}
        {error && <ErrorState message={error.message} onRetry={refetch} />}

        {!loading && !error && (
          <>
            <div className="grid gap-3 md:gap-4 grid-cols-3">
              <div className="border rounded-lg md:rounded-xl p-3 md:p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-950/50 shadow-sm hover:shadow-md transition-all hover:scale-105">
                <div className="text-xl md:text-3xl font-bold text-red-600 dark:text-red-400">
                  {overdueTasks.length}
                </div>
                <div className="text-xs md:text-sm font-medium text-red-700 dark:text-red-300 mt-1">Overdue</div>
              </div>
              <div className="border rounded-lg md:rounded-xl p-3 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-950/50 shadow-sm hover:shadow-md transition-all hover:scale-105">
                <div className="text-xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {pendingTasks.length}
                </div>
                <div className="text-xs md:text-sm font-medium text-blue-700 dark:text-blue-300 mt-1">Pending</div>
              </div>
              <div className="border rounded-lg md:rounded-xl p-3 md:p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-950/50 shadow-sm hover:shadow-md transition-all hover:scale-105">
                <div className="text-xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                  {completedTasks.length}
                </div>
                <div className="text-xs md:text-sm font-medium text-green-700 dark:text-green-300 mt-1">Completed</div>
              </div>
            </div>

            <div className="flex gap-1 md:gap-2 border-b overflow-x-auto">
              {["all", "overdue", "pending"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={cn(
                    "px-3 md:px-4 py-2 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap capitalize",
                    filter === f
                      ? "border-black dark:border-white text-black dark:text-white"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f} ({f === "all" ? tasks.length : f === "overdue" ? overdueTasks.length : pendingTasks.length})
                </button>
              ))}
            </div>

            {overdueTasks.length > 0 && (
              <section className="border-l-4 border-red-600 rounded-r-lg bg-red-50 dark:bg-red-950/20 p-4">
                <h2 className="text-lg font-semibold text-red-600 mb-3">Overdue Tasks</h2>
                <ul className="space-y-2">
                  {overdueTasks.map((task) => (
                    <li key={task.id} className="flex items-center gap-3 p-2 bg-white dark:bg-background rounded">
                      <input
                        type="checkbox"
                        checked={task.status === "completed"}
                        onChange={() => toggleTaskStatus(task.id)}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-xs text-muted-foreground">Due: {task.due}</div>
                      </div>
                      {task.priority && (
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="border rounded-lg p-4 bg-card">
              <h2 className="text-lg font-semibold mb-3">
                {filter === "all" ? "All Tasks" : filter === "pending" ? "Pending Tasks" : "Filtered Tasks"}
              </h2>
              {displayTasks.length === 0 ? (
                <p className="text-muted-foreground text-sm">No tasks to display.</p>
              ) : (
                <ul className="space-y-2">
                  {displayTasks.map((task) => (
                    <li key={task.id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded">
                      <input
                        type="checkbox"
                        checked={task.status === "completed"}
                        onChange={() => toggleTaskStatus(task.id)}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div
                          className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                        >
                          {task.title}
                        </div>
                        <div className="text-xs text-muted-foreground">Due: {task.due}</div>
                      </div>
                      {task.priority && (
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="border-l-4 border-blue-600 rounded-r-lg bg-blue-50 dark:bg-blue-950/20 p-4">
              <h3 className="font-semibold text-sm mb-1">Enable Calendar Integration</h3>
              <p className="text-sm text-muted-foreground">
                Connect your calendar to automatically sync tasks from meetings and events.
              </p>
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}
