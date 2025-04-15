"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Download, Loader2 } from 'lucide-react'
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { AuditResults } from "@/components/audit-results"
import { AuditSummary } from "@/components/audit-summary"
import type { AuditReport } from "@/lib/types"

export default function AuditPage() {
  const searchParams = useSearchParams()
  const url = searchParams.get("url")
  const [isLoading, setIsLoading] = useState(true)
  const [report, setReport] = useState<AuditReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [exportLoading, setExportLoading] = useState(false)

  useEffect(() => {
    async function fetchAuditData() {
      if (!url) {
        setError("No URL provided")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/audit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        })

        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || `Error: ${response.status}`)
        }

        setReport(data)
      } catch (err: any) {
        console.error("Error fetching audit data:", err)
        setError(err.message || "Failed to analyze the website. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAuditData()
  }, [url])

  const handleExportPDF = async () => {
    if (!report || !url) return

    try {
      setExportLoading(true)
      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ report, url }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error: ${response.status}`)
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = `seo-audit-${new URL(url).hostname}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (err: any) {
      console.error("Error exporting PDF:", err)
      alert(`Failed to export PDF: ${err.message || "Unknown error"}`)
    } finally {
      setExportLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          {report && (
            <Button onClick={handleExportPDF} variant="outline" size="sm" className="gap-1" disabled={exportLoading}>
              {exportLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Export PDF
                </>
              )}
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex h-[60vh] flex-col items-center justify-center">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-slate-600 dark:text-slate-400" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Analyzing website...</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">This may take a minute or two.</p>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">
            <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">{error}</h2>
            <p className="mt-2 text-red-600 dark:text-red-300">Please check the URL and try again.</p>
            <Link href="/">
              <Button className="mt-4">Try Again</Button>
            </Link>
          </div>
        ) : report ? (
          <div className="space-y-8">
            <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-50">SEO Audit Results</h1>
              <p className="text-slate-600 dark:text-slate-400">
                <span className="font-medium">URL:</span> {url}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Analyzed on {new Date().toLocaleDateString()}
              </p>
            </div>

            <AuditSummary report={report} />
            <AuditResults report={report} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
