import { Suspense } from "react";
import { AuditResults } from "@/components/audit-results";
import { AuditResultsSkeleton } from "@/components/audit-results-skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function AuditResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string }>;
}) {
  const params = await searchParams;
  const url = (await params)?.url ?? "";

  return (
    <main className="min-h-screen py-8 px-8">
      <div className="container mx-auto px-4">
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-1 px-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-8">SEO Audit Results</h1>
        <Suspense fallback={<AuditResultsSkeleton />}>
          <AuditResults url={decodeURIComponent(url)} />
        </Suspense>
      </div>
    </main>
  );
}
