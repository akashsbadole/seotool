"use client"

import { useMemo } from "react"
import dynamic from "next/dynamic"
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AuditReport } from "@/lib/types"

// Dynamically import Chart.js components with no SSR to avoid hydration issues
const DynamicChart = dynamic(
  async () => {
    const { Chart } = await import("chart.js/auto")
    const { ArcElement, Tooltip, Legend } = await import("chart.js")
    Chart.register(ArcElement, Tooltip, Legend)
    
    const { Doughnut } = await import("react-chartjs-2")
    return Doughnut
  },
  { ssr: false }
)

interface AuditSummaryProps {
  report: AuditReport
}

export function AuditSummary({ report }: AuditSummaryProps) {
  const scores = useMemo(() => {
    const categories = [
      { name: "On-Page SEO", data: report.onPageSEO },
      { name: "Technical SEO", data: report.technicalSEO },
      { name: "Content SEO", data: report.contentSEO },
      { name: "Performance", data: report.performance },
      { name: "Indexability", data: report.indexability },
    ]

    return categories.map((category) => {
      const items = Object.values(category.data)
      const totalItems = items.length
      const passedItems = items.filter((item) => item.grade === "A" || item.grade === "B").length
      const score = totalItems > 0 ? Math.round((passedItems / totalItems) * 100) : 0

      return {
        name: category.name,
        score,
        status: score >= 80 ? "good" : score >= 50 ? "warning" : "poor",
      }
    })
  }, [report])

  const overallScore = useMemo(() => {
    const totalScore = scores.reduce((acc, curr) => acc + curr.score, 0)
    return Math.round(totalScore / scores.length)
  }, [scores])

  const chartData = {
    labels: ["Good", "Needs Improvement", "Poor"],
    datasets: [
      {
        data: [
          scores.filter((s) => s.status === "good").length,
          scores.filter((s) => s.status === "warning").length,
          scores.filter((s) => s.status === "poor").length,
        ],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
        borderWidth: 0,
      },
    ],
  }

  const chartOptions = {
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    maintainAspectRatio: false,
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Overall Score</CardTitle>
          <CardDescription>Combined score across all categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="relative flex h-40 w-40 items-center justify-center">
              <DynamicChart data={chartData} options={chartOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{overallScore}</span>
                <span className="text-sm text-slate-500">out of 100</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Category Scores</CardTitle>
          <CardDescription>Individual performance by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scores.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {category.status === "good" ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  ) : category.status === "warning" ? (
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">{category.name}</span>
                </div>
                <div
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    category.status === "good"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                      : category.status === "warning"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {category.score}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
