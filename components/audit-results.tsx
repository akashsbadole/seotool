"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AuditReport } from "@/lib/types"

interface AuditResultsProps {
  report: AuditReport
}

export function AuditResults({ report }: AuditResultsProps) {
  const [activeTab, setActiveTab] = useState("on-page")

  const getGradeIcon = (grade: string) => {
    if (grade === "A") {
      return <CheckCircle className="h-5 w-5 text-emerald-500" />
    } else if (grade === "B" || grade === "C") {
      return <AlertTriangle className="h-5 w-5 text-amber-500" />
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getGradeBadge = (grade: string) => {
    let color = ""
    switch (grade) {
      case "A":
        color = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
        break
      case "B":
        color = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        break
      case "C":
        color = "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
        break
      case "D":
        color = "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
        break
      default:
        color = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    }
    return <Badge className={`${color} ml-2`}>{grade}</Badge>
  }

  const renderCategoryItems = (category: Record<string, any>) => {
    return Object.entries(category).map(([key, item]) => (
      <AccordionItem key={key} value={key}>
        <AccordionTrigger className="px-4 py-3 text-left hover:no-underline">
          <div className="flex items-center">
            {getGradeIcon(item.grade)}
            <span className="ml-2 font-medium">{item.name || key.replace(/([A-Z])/g, " $1").trim()}</span>
            {getGradeBadge(item.grade)}
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-3 pt-1">
          <div className="space-y-3 text-sm">
            {item.value !== undefined && (
              <div>
                <span className="font-medium">Current Value:</span> {item.value}
              </div>
            )}

            {item.issues && item.issues.length > 0 ? (
              <div>
                <span className="font-medium">Issues:</span>
                <ul className="ml-5 mt-1 list-disc space-y-1">
                  {item.issues.map((issue: string, i: number) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-emerald-600 dark:text-emerald-400">No issues detected</div>
            )}

            {item.recommendations && item.recommendations.length > 0 && (
              <div>
                <span className="font-medium">Recommendations:</span>
                <ul className="ml-5 mt-1 list-disc space-y-1">
                  {item.recommendations.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Results</CardTitle>
        <CardDescription>Comprehensive analysis of all SEO factors</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="on-page">On-Page</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="indexability">Indexability</TabsTrigger>
          </TabsList>

          <TabsContent value="on-page" className="mt-0">
            <Accordion type="multiple" className="w-full">
              {renderCategoryItems(report.onPageSEO)}
            </Accordion>
          </TabsContent>

          <TabsContent value="technical" className="mt-0">
            <Accordion type="multiple" className="w-full">
              {renderCategoryItems(report.technicalSEO)}
            </Accordion>
          </TabsContent>

          <TabsContent value="content" className="mt-0">
            <Accordion type="multiple" className="w-full">
              {renderCategoryItems(report.contentSEO)}
            </Accordion>
          </TabsContent>

          <TabsContent value="performance" className="mt-0">
            <Accordion type="multiple" className="w-full">
              {renderCategoryItems(report.performance)}
            </Accordion>
          </TabsContent>

          <TabsContent value="indexability" className="mt-0">
            <Accordion type="multiple" className="w-full">
              {renderCategoryItems(report.indexability)}
            </Accordion>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
