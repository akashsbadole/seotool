import { ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block p-2 bg-slate-100 rounded-full mb-4 dark:bg-slate-800">
            <Search className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Comprehensive SEO Audit Tool</h1>
          <p className="text-xl text-slate-600 mb-8 dark:text-slate-400">
            Analyze your website's SEO performance and get actionable insights to improve your search engine rankings
          </p>
          <Button size="lg" className="rounded-full px-8 gap-2">
            Start Your Audit <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
