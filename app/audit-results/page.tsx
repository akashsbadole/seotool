import { Suspense } from "react"
import { AuditResults } from "@/components/audit-results"
import { AuditResultsSkeleton } from "@/components/audit-results-skeleton"

export default function AuditResultsPage({
  searchParams,
}: {
  searchParams: { url?: string }
}) {
  const url = searchParams.url || ""

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">SEO Audit Results</h1>
        <Suspense fallback={<AuditResultsSkeleton />}>
          <AuditResults url={decodeURIComponent(url)} />
        </Suspense>
      </div>
    </main>
  )
}
