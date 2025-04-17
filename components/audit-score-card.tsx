import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface AuditScoreCardProps {
  title: string
  score: number
  description: string
}

export function AuditScoreCard({ title, score, description }: AuditScoreCardProps) {
  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-amber-500"
    return "text-red-500"
  }

  // Determine progress color based on score
  const getProgressColor = () => {
    if (score >= 90) return "bg-green-500"
    if (score >= 70) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="w-full">
            <Progress value={score} className="h-2" indicatorClassName={getProgressColor()} />
          </div>
          <div className={`text-2xl font-bold ${getScoreColor()}`}>{score}/100</div>
        </div>
      </CardContent>
    </Card>
  )
}
