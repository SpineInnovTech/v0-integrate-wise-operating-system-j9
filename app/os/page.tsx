"use client"

/**
 * OS Pages - Zero Dependency View
 *
 * Static dashboard showing pipeline, metrics, and templates
 * Template selection will unfold domain pages in future phases
 */

import Link from "next/link"
import { AppShell } from "@/components/app-shell"

export default function OSPage() {
  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <div className="border-b pb-6 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 -m-6 mb-6 p-6 rounded-t-lg">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            OS Pages (Static)
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Overview of your business operating system structure. Data will populate as you enable integrations.
          </p>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Pipeline */}
          <div className="border rounded-xl p-6 bg-gradient-to-br from-white to-blue-50 dark:from-card dark:to-blue-950/20 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <span>Pipeline</span>
            </h2>
            <ol className="space-y-2 text-sm">
              <li className="p-2 bg-gray-100 dark:bg-gray-900 rounded flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                <span>Lead</span>
              </li>
              <li className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>Discovery</span>
              </li>
              <li className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span>Proposal</span>
              </li>
              <li className="p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                <span>Negotiation</span>
              </li>
              <li className="p-2 bg-green-50 dark:bg-green-950/20 rounded flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                <span>Won</span>
              </li>
            </ol>
            <div className="mt-4 pt-4 border-t">
              <div className="text-2xl font-bold">—</div>
              <div className="text-xs text-muted-foreground">Total Pipeline Value</div>
            </div>
          </div>

          {/* Metrics */}
          <div className="border rounded-xl p-6 bg-gradient-to-br from-white to-green-50 dark:from-card dark:to-green-950/20 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">📈</span>
              <span>Metrics</span>
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Win Rate</span>
                  <span className="text-sm font-medium">—</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "0%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">MRR</span>
                  <span className="text-sm font-medium">—</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "0%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Utilization</span>
                  <span className="text-sm font-medium">—</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "0%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Customer Sat.</span>
                  <span className="text-sm font-medium">—</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: "0%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Templates */}
          <div className="border rounded-xl p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 shadow-sm hover:shadow-lg transition-all">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span>Templates</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Use One-Click Template to unfold domain-specific pages and workflows.
            </p>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-white dark:bg-background rounded border">💼 Consulting</div>
              <div className="p-2 bg-white dark:bg-background rounded border">🛒 E-commerce</div>
              <div className="p-2 bg-white dark:bg-background rounded border">🏢 Digital Agency</div>
              <div className="p-2 bg-white dark:bg-background rounded border">💻 SaaS</div>
            </div>
            <Link
              href="/onboarding"
              className="mt-4 block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg px-4 py-3 text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              Browse All Templates →
            </Link>
          </div>
        </div>

        {/* Domain Pages Overview */}
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Domain Pages</h2>
          <p className="text-sm text-muted-foreground mb-6">
            These pages will become available after you select and apply a template. Each domain provides specialized
            tools and workflows.
          </p>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="border rounded-lg p-4 opacity-50">
              <div className="text-2xl mb-2">📋</div>
              <div className="font-medium text-sm">Projects</div>
              <div className="text-xs text-muted-foreground mt-1">Project management</div>
            </div>

            <div className="border rounded-lg p-4 opacity-50">
              <div className="text-2xl mb-2">💰</div>
              <div className="font-medium text-sm">Deals</div>
              <div className="text-xs text-muted-foreground mt-1">Sales pipeline</div>
            </div>

            <div className="border rounded-lg p-4 opacity-50">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-medium text-sm">Clients</div>
              <div className="text-xs text-muted-foreground mt-1">Client relationships</div>
            </div>

            <div className="border rounded-lg p-4 opacity-50">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium text-sm">Metrics</div>
              <div className="text-xs text-muted-foreground mt-1">KPIs & analytics</div>
            </div>

            <div className="border rounded-lg p-4 opacity-50">
              <div className="text-2xl mb-2">📦</div>
              <div className="font-medium text-sm">Products</div>
              <div className="text-xs text-muted-foreground mt-1">Product catalog</div>
            </div>

            <div className="border rounded-lg p-4 opacity-50">
              <div className="text-2xl mb-2">🛠️</div>
              <div className="font-medium text-sm">Services</div>
              <div className="text-xs text-muted-foreground mt-1">Service offerings</div>
            </div>

            <div className="border rounded-lg p-4 opacity-50">
              <div className="text-2xl mb-2">📈</div>
              <div className="font-medium text-sm">Sales</div>
              <div className="text-xs text-muted-foreground mt-1">Sales operations</div>
            </div>

            <div className="border rounded-lg p-4 opacity-50">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-medium text-sm">Strategy</div>
              <div className="text-xs text-muted-foreground mt-1">Strategic planning</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="border rounded-lg p-4 bg-card">
            <div className="text-sm text-muted-foreground mb-1">Active Projects</div>
            <div className="text-2xl font-bold">—</div>
          </div>

          <div className="border rounded-lg p-4 bg-card">
            <div className="text-sm text-muted-foreground mb-1">Open Deals</div>
            <div className="text-2xl font-bold">—</div>
          </div>

          <div className="border rounded-lg p-4 bg-card">
            <div className="text-sm text-muted-foreground mb-1">Total Clients</div>
            <div className="text-2xl font-bold">—</div>
          </div>

          <div className="border rounded-lg p-4 bg-card">
            <div className="text-sm text-muted-foreground mb-1">This Month</div>
            <div className="text-2xl font-bold">—</div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="border-l-4 border-indigo-600 rounded-r-lg bg-indigo-50 dark:bg-indigo-950/20 p-4">
          <h3 className="font-semibold text-sm mb-2">Next Steps</h3>
          <p className="text-sm text-muted-foreground">
            Select a template from the onboarding flow to unlock domain-specific pages. Each template pre-configures
            your workspace with industry-standard pipelines, charts of accounts, and workflows.
          </p>
        </div>
      </div>
    </AppShell>
  )
}
