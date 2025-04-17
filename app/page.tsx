import { AuditForm } from "@/components/audit-form"
import { HeroSection } from "@/components/hero-section"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <AuditForm />
        </div>
      </div>
    </main>
  )
}
