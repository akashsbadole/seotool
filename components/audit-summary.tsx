import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface AuditSummaryProps {
  overallScore: number
}

export function AuditSummary({ overallScore }: AuditSummaryProps) {
  // Determine color and text based on score
  const getScoreInfo = () => {
    if (overallScore >= 90) {
      return {
        color: "text-green-500",
        bgColor: "bg-green-500",
        text: "Excellent",
        description: "Your website has excellent SEO optimization",
      }
    }
    if (overallScore >= 70) {
      return {
        color: "text-amber-500",
        bgColor: "bg-amber-500",
        text: "Good",
        description: "Your website has good SEO optimization with some areas for improvement",
      }
    }
    if (overallScore >= 50) {
      return {
        color: "text-orange-500",
        bgColor: "bg-orange-500",
        text: "Average",
        description: "Your website needs significant SEO improvements",
      }
    }
    return {
      color: "text-red-500",
      bgColor: "bg-red-500",
      text: "Poor",
      description: "Your website has critical SEO issues that need immediate attention",
    }
  }

  const { color, bgColor, text, description } = getScoreInfo()

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-3">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-32 h-32 flex-shrink-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-3xl font-bold ${color}`}>{overallScore}</span>
              </div>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-slate-200 dark:text-slate-800"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className={color.replace("text", "stroke")}
                  strokeWidth="10"
                  strokeDasharray={`${overallScore * 2.51} 251`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">
                Overall SEO Score: <span className={color}>{text}</span>
              </h2>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{Math.round(overallScore * 0.8)}/100</div>
            <h3 className="text-lg font-medium mb-2">On-Page SEO</h3>
            <Progress value={overallScore * 0.8} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{Math.round(overallScore * 0.9)}/100</div>
            <h3 className="text-lg font-medium mb-2">Technical SEO</h3>
            <Progress value={overallScore * 0.9} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{Math.round(overallScore * 0.7)}/100</div>
            <h3 className="text-lg font-medium mb-2">Content Quality</h3>
            <Progress value={overallScore * 0.7} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
