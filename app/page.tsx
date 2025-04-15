import { AuditForm } from "@/components/audit-form"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
            SEO Audit Tool
          </h1>
          <p className="mb-8 text-lg text-slate-600 dark:text-slate-400">
            Analyze your website's SEO performance and get actionable recommendations to improve your search engine
            rankings.
          </p>
          <AuditForm />
        </div>
      </div>
    </div>
  )
}
