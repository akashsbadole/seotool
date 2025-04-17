"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AlertCircle, AlertTriangle, CheckCircle2, Download, Globe, Loader2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuditScoreCard } from "@/components/audit-score-card"
import { AuditSummary } from "@/components/audit-summary"
import { PdfExportDialog } from "@/components/pdf-export-dialog"
import type { SEOAuditResult } from "@/types/seo-audit"

export function AuditResults({ url }: { url: string }) {
  const [auditResult, setAuditResult] = useState<SEOAuditResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false)

  useEffect(() => {
    const fetchAuditResults = async () => {
      if (!url) {
        setError("No URL provided")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await fetch(`/api/audit?url=${encodeURIComponent(url)}`)

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setAuditResult(data)
      } catch (err) {
        console.error("Failed to fetch audit results:", err)
        setError("Failed to fetch audit results. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchAuditResults()
  }, [url])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-semibold mb-2">Analyzing your website</h2>
        <p className="text-muted-foreground">This may take a minute or two...</p>
      </div>
    )
  }

  if (error || !auditResult) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || "Failed to load audit results. Please try again."}</AlertDescription>
      </Alert>
    )
  }

  const { overallScore, onPageSEO, technicalSEO, contentSEO, performance, advancedSEO, competitiveAnalysis, localSEO } =
    auditResult

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-xl">{url}</CardTitle>
          </div>
          <CardDescription>
            Audit completed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuditSummary overallScore={overallScore} />
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="gap-2" onClick={() => setIsPdfDialogOpen(true)}>
            <Download className="h-4 w-4" />
            Export PDF Report
          </Button>
        </CardFooter>
      </Card>

      <Tabs defaultValue="on-page">
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-4">
          <TabsTrigger value="on-page">On-Page SEO</TabsTrigger>
          <TabsTrigger value="technical">Technical SEO</TabsTrigger>
          <TabsTrigger value="content">Content SEO</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="advanced">Advanced SEO</TabsTrigger>
          <TabsTrigger value="competitive">Competitive</TabsTrigger>
          <TabsTrigger value="local">Local SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="on-page" className="space-y-4">
          <AuditScoreCard
            title="On-Page SEO Score"
            score={onPageSEO.score}
            description="Analysis of on-page elements like meta tags, headings, and internal links"
          />

          <Accordion type="single" collapsible className="space-y-4">
            <AuditItem
              title="Meta Title"
              status={onPageSEO.metaTitle.status}
              value={onPageSEO.metaTitle.value}
              issues={onPageSEO.metaTitle.issues}
              recommendations={onPageSEO.metaTitle.recommendations}
            />

            <AuditItem
              title="Meta Description"
              status={onPageSEO.metaDescription.status}
              value={onPageSEO.metaDescription.value}
              issues={onPageSEO.metaDescription.issues}
              recommendations={onPageSEO.metaDescription.recommendations}
            />

            <AuditItem
              title="Heading Structure"
              status={onPageSEO.headings.status}
              value={`${onPageSEO.headings.h1Count} H1, ${onPageSEO.headings.h2Count} H2, ${onPageSEO.headings.h3Count} H3`}
              issues={onPageSEO.headings.issues}
              recommendations={onPageSEO.headings.recommendations}
            />

            <AuditItem
              title="Image Alt Attributes"
              status={onPageSEO.imageAlt.status}
              value={`${onPageSEO.imageAlt.withAlt} of ${onPageSEO.imageAlt.total} images have alt text`}
              issues={onPageSEO.imageAlt.issues}
              recommendations={onPageSEO.imageAlt.recommendations}
            />

            <AuditItem
              title="URL Structure"
              status={onPageSEO.urlStructure.status}
              value={onPageSEO.urlStructure.value}
              issues={onPageSEO.urlStructure.issues}
              recommendations={onPageSEO.urlStructure.recommendations}
            />

            <AuditItem
              title="Internal Links"
              status={onPageSEO.internalLinks.status}
              value={`${onPageSEO.internalLinks.count} internal links found`}
              issues={onPageSEO.internalLinks.issues}
              recommendations={onPageSEO.internalLinks.recommendations}
            />
          </Accordion>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <AuditScoreCard
            title="Technical SEO Score"
            score={technicalSEO.score}
            description="Analysis of technical aspects like page speed, mobile-friendliness, and indexability"
          />

          <Accordion type="single" collapsible className="space-y-4">
            <AuditItem
              title="HTTP Status"
              status={technicalSEO.httpStatus.status}
              value={technicalSEO.httpStatus.value}
              issues={technicalSEO.httpStatus.issues}
              recommendations={technicalSEO.httpStatus.recommendations}
            />

            <AuditItem
              title="Broken Links"
              status={technicalSEO.brokenLinks.status}
              value={`${technicalSEO.brokenLinks.broken} of ${technicalSEO.brokenLinks.total} links are broken`}
              issues={technicalSEO.brokenLinks.issues}
              recommendations={technicalSEO.brokenLinks.recommendations}
              details={
                technicalSEO.brokenLinks.brokenList.length > 0 ? (
                  <div className="mt-4 border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left">URL</th>
                          <th className="px-4 py-2 text-left">Status Code</th>
                        </tr>
                      </thead>
                      <tbody>
                        {technicalSEO.brokenLinks.brokenList.map((link, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2 break-all">{link.url}</td>
                            <td className="px-4 py-2">{link.statusCode}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null
              }
            />

            <AuditItem
              title="Page Speed"
              status={technicalSEO.pageSpeed.status}
              value={`${technicalSEO.pageSpeed.score}/100`}
              issues={technicalSEO.pageSpeed.issues}
              recommendations={technicalSEO.pageSpeed.recommendations}
            />

            <AuditItem
              title="Mobile-Friendliness"
              status={technicalSEO.mobileFriendliness.status}
              value={technicalSEO.mobileFriendliness.value}
              issues={technicalSEO.mobileFriendliness.issues}
              recommendations={technicalSEO.mobileFriendliness.recommendations}
            />

            <AuditItem
              title="SSL Certificate"
              status={technicalSEO.ssl.status}
              value={technicalSEO.ssl.value}
              issues={technicalSEO.ssl.issues}
              recommendations={technicalSEO.ssl.recommendations}
            />

            <AuditItem
              title="Canonical Tags"
              status={technicalSEO.canonicalTags.status}
              value={technicalSEO.canonicalTags.value}
              issues={technicalSEO.canonicalTags.issues}
              recommendations={technicalSEO.canonicalTags.recommendations}
            />

            <AuditItem
              title="Hreflang Implementation"
              status={technicalSEO.hreflang.status}
              value={technicalSEO.hreflang.value}
              issues={technicalSEO.hreflang.issues}
              recommendations={technicalSEO.hreflang.recommendations}
            />

            <AuditItem
              title="Core Web Vitals"
              status={technicalSEO.coreWebVitals.status}
              value={`LCP: ${technicalSEO.coreWebVitals.lcp.value}, FID: ${technicalSEO.coreWebVitals.fid.value}, CLS: ${technicalSEO.coreWebVitals.cls.value}`}
              issues={technicalSEO.coreWebVitals.issues}
              recommendations={technicalSEO.coreWebVitals.recommendations}
            />

            <AuditItem
              title="Duplicate Content"
              status={technicalSEO.duplicateContent.status}
              value={technicalSEO.duplicateContent.value}
              issues={technicalSEO.duplicateContent.issues}
              recommendations={technicalSEO.duplicateContent.recommendations}
            />

            <AuditItem
              title="Robots.txt"
              status={technicalSEO.robotsTxt.status}
              value={technicalSEO.robotsTxt.value}
              issues={technicalSEO.robotsTxt.issues}
              recommendations={technicalSEO.robotsTxt.recommendations}
            />

            <AuditItem
              title="Sitemap.xml"
              status={technicalSEO.sitemap.status}
              value={technicalSEO.sitemap.value}
              issues={technicalSEO.sitemap.issues}
              recommendations={technicalSEO.sitemap.recommendations}
            />

            <AuditItem
              title="Structured Data"
              status={technicalSEO.structuredData.status}
              value={technicalSEO.structuredData.value}
              issues={technicalSEO.structuredData.issues}
              recommendations={technicalSEO.structuredData.recommendations}
            />
          </Accordion>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <AuditScoreCard
            title="Content SEO Score"
            score={contentSEO.score}
            description="Analysis of content quality, keyword optimization, and readability"
          />

          <Accordion type="single" collapsible className="space-y-4">
            <AuditItem
              title="Content Quality"
              status={contentSEO.contentQuality.status}
              value={`${contentSEO.contentQuality.score}/100`}
              issues={contentSEO.contentQuality.issues}
              recommendations={contentSEO.contentQuality.recommendations}
            />

            <AuditItem
              title="Content Length"
              status={contentSEO.contentLength.status}
              value={`${contentSEO.contentLength.wordCount} words`}
              issues={contentSEO.contentLength.issues}
              recommendations={contentSEO.contentLength.recommendations}
            />

            <AuditItem
              title="Keyword Density"
              status={contentSEO.keywordDensity.status}
              value={`Top keywords analyzed`}
              issues={contentSEO.keywordDensity.issues}
              recommendations={contentSEO.keywordDensity.recommendations}
              details={
                contentSEO.keywordDensity.keywords.length > 0 ? (
                  <div className="mt-4 border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left">Keyword</th>
                          <th className="px-4 py-2 text-left">Count</th>
                          <th className="px-4 py-2 text-left">Density</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contentSEO.keywordDensity.keywords.map((keyword, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2">{keyword.keyword}</td>
                            <td className="px-4 py-2">{keyword.count}</td>
                            <td className="px-4 py-2">{keyword.density}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null
              }
            />

            <AuditItem
              title="Keyword Optimization"
              status={contentSEO.keywordOptimization.status}
              value={contentSEO.keywordOptimization.value}
              issues={contentSEO.keywordOptimization.issues}
              recommendations={contentSEO.keywordOptimization.recommendations}
            />

            <AuditItem
              title="Readability"
              status={contentSEO.readability.status}
              value={contentSEO.readability.value}
              issues={contentSEO.readability.issues}
              recommendations={contentSEO.readability.recommendations}
            />

            <AuditItem
              title="Thin Content"
              status={contentSEO.thinContent.status}
              value={contentSEO.thinContent.value}
              issues={contentSEO.thinContent.issues}
              recommendations={contentSEO.thinContent.recommendations}
            />

            <AuditItem
              title="Content Freshness"
              status={contentSEO.contentFreshness.status}
              value={contentSEO.contentFreshness.value}
              issues={contentSEO.contentFreshness.issues}
              recommendations={contentSEO.contentFreshness.recommendations}
            />

            <AuditItem
              title="E-A-T Signals"
              status={contentSEO.eatSignals.status}
              value={contentSEO.eatSignals.value}
              issues={contentSEO.eatSignals.issues}
              recommendations={contentSEO.eatSignals.recommendations}
            />
          </Accordion>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <AuditScoreCard
            title="Performance Score"
            score={performance.score}
            description="Analysis of Core Web Vitals and overall performance metrics"
          />

          <Accordion type="single" collapsible className="space-y-4">
            <AuditItem
              title="Largest Contentful Paint (LCP)"
              status={performance.lcp.status}
              value={performance.lcp.value}
              issues={performance.lcp.issues}
              recommendations={performance.lcp.recommendations}
            />

            <AuditItem
              title="First Input Delay (FID)"
              status={performance.fid.status}
              value={performance.fid.value}
              issues={performance.fid.issues}
              recommendations={performance.fid.recommendations}
            />

            <AuditItem
              title="Cumulative Layout Shift (CLS)"
              status={performance.cls.status}
              value={performance.cls.value}
              issues={performance.cls.issues}
              recommendations={performance.cls.recommendations}
            />
          </Accordion>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <AuditScoreCard
            title="Advanced SEO Score"
            score={advancedSEO.score}
            description="Analysis of advanced SEO factors like internal linking strength and semantic SEO"
          />

          <Accordion type="single" collapsible className="space-y-4">
            <AuditItem
              title="Internal Linking Strength"
              status={advancedSEO.internalLinkingStrength.status}
              value={advancedSEO.internalLinkingStrength.value}
              issues={advancedSEO.internalLinkingStrength.issues}
              recommendations={advancedSEO.internalLinkingStrength.recommendations}
            />

            <AuditItem
              title="Page Depth"
              status={advancedSEO.pageDepth.status}
              value={advancedSEO.pageDepth.value}
              issues={advancedSEO.pageDepth.issues}
              recommendations={advancedSEO.pageDepth.recommendations}
            />

            <AuditItem
              title="Orphaned Pages"
              status={advancedSEO.orphanedPages.status}
              value={`${advancedSEO.orphanedPages.count} orphaned pages found`}
              issues={advancedSEO.orphanedPages.issues}
              recommendations={advancedSEO.orphanedPages.recommendations}
            />

            <AuditItem
              title="Entity Identification"
              status={advancedSEO.entityIdentification.status}
              value={`${advancedSEO.entityIdentification.entities.length} entities identified`}
              issues={advancedSEO.entityIdentification.issues}
              recommendations={advancedSEO.entityIdentification.recommendations}
              details={
                advancedSEO.entityIdentification.entities.length > 0 ? (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Identified Entities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {advancedSEO.entityIdentification.entities.map((entity, index) => (
                        <span key={index} className="px-2 py-1 bg-muted rounded-md text-sm">
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null
              }
            />

            <AuditItem
              title="SERP Feature Opportunities"
              status={advancedSEO.serpFeatures.status}
              value={`${advancedSEO.serpFeatures.opportunities.length} opportunities identified`}
              issues={advancedSEO.serpFeatures.issues}
              recommendations={advancedSEO.serpFeatures.recommendations}
              details={
                advancedSEO.serpFeatures.opportunities.length > 0 ? (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">SERP Feature Opportunities:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {advancedSEO.serpFeatures.opportunities.map((opportunity, index) => (
                        <li key={index} className="text-sm">
                          {opportunity}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null
              }
            />

            <AuditItem
              title="JavaScript SEO"
              status={advancedSEO.javascriptSEO.status}
              value={advancedSEO.javascriptSEO.value}
              issues={advancedSEO.javascriptSEO.issues}
              recommendations={advancedSEO.javascriptSEO.recommendations}
            />
          </Accordion>
        </TabsContent>

        <TabsContent value="competitive" className="space-y-4">
          <AuditScoreCard
            title="Competitive Analysis Score"
            score={competitiveAnalysis.score}
            description="Analysis of your website compared to competitors"
          />

          <Card>
            <CardHeader>
              <CardTitle>Competitor Overview</CardTitle>
              <CardDescription>Analysis of your top competitors in search results</CardDescription>
            </CardHeader>
            <CardContent>
              {competitiveAnalysis.competitors.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left">Domain</th>
                        <th className="px-4 py-2 text-left">Share of Voice</th>
                        <th className="px-4 py-2 text-left">Common Keywords</th>
                        <th className="px-4 py-2 text-left">Unique Keywords</th>
                      </tr>
                    </thead>
                    <tbody>
                      {competitiveAnalysis.competitors.map((competitor, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{competitor.domain}</td>
                          <td className="px-4 py-2">{competitor.shareOfVoice}</td>
                          <td className="px-4 py-2">{competitor.commonKeywords}</td>
                          <td className="px-4 py-2">{competitor.uniqueKeywords}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">No competitor data available</p>
              )}
            </CardContent>
          </Card>

          <Accordion type="single" collapsible className="space-y-4">
            <AuditItem
              title="Keyword Gaps"
              status={competitiveAnalysis.keywordGaps.length > 0 ? "warning" : "good"}
              value={`${competitiveAnalysis.keywordGaps.length} keyword opportunities identified`}
              issues={competitiveAnalysis.issues.filter((issue) => issue.includes("keyword"))}
              recommendations={competitiveAnalysis.recommendations.filter((rec) => rec.includes("keyword"))}
              details={
                competitiveAnalysis.keywordGaps.length > 0 ? (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Keyword Opportunities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {competitiveAnalysis.keywordGaps.map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-muted rounded-md text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null
              }
            />

            <AuditItem
              title="Content Gaps"
              status={competitiveAnalysis.contentGaps.length > 0 ? "warning" : "good"}
              value={`${competitiveAnalysis.contentGaps.length} content opportunities identified`}
              issues={competitiveAnalysis.issues.filter((issue) => issue.includes("content"))}
              recommendations={competitiveAnalysis.recommendations.filter((rec) => rec.includes("content"))}
              details={
                competitiveAnalysis.contentGaps.length > 0 ? (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Content Opportunities:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {competitiveAnalysis.contentGaps.map((content, index) => (
                        <li key={index} className="text-sm">
                          {content}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null
              }
            />

            <AuditItem
              title="Backlinks Comparison"
              status={competitiveAnalysis.backlinksComparison.status}
              value={competitiveAnalysis.backlinksComparison.value}
              issues={competitiveAnalysis.backlinksComparison.issues}
              recommendations={competitiveAnalysis.backlinksComparison.recommendations}
            />
          </Accordion>
        </TabsContent>

        <TabsContent value="local" className="space-y-4">
          {localSEO ? (
            <>
              <AuditScoreCard
                title="Local SEO Score"
                score={localSEO.score}
                description="Analysis of local search optimization factors"
              />

              <Accordion type="single" collapsible className="space-y-4">
                <AuditItem
                  title="Google Business Profile"
                  status={localSEO.googleBusinessProfile.status}
                  value={localSEO.googleBusinessProfile.value}
                  issues={localSEO.googleBusinessProfile.issues}
                  recommendations={localSEO.googleBusinessProfile.recommendations}
                />

                <AuditItem
                  title="Local Citations"
                  status={localSEO.localCitations.status}
                  value={localSEO.localCitations.value}
                  issues={localSEO.localCitations.issues}
                  recommendations={localSEO.localCitations.recommendations}
                />

                <AuditItem
                  title="Local Keywords"
                  status={localSEO.localKeywords.status}
                  value={localSEO.localKeywords.value}
                  issues={localSEO.localKeywords.issues}
                  recommendations={localSEO.localKeywords.recommendations}
                />

                <AuditItem
                  title="Reviews"
                  status={localSEO.reviews.status}
                  value={localSEO.reviews.value}
                  issues={localSEO.reviews.issues}
                  recommendations={localSEO.reviews.recommendations}
                />
              </Accordion>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Local SEO Analysis Not Available</h2>
              <p className="text-muted-foreground max-w-md">
                We couldn't detect if this website has local business elements. Local SEO analysis is only available for
                business websites with physical locations.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <PdfExportDialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen} url={url} auditResult={auditResult} />
    </div>
  )
}

interface AuditItemProps {
  title: string
  status: "good" | "warning" | "error"
  value: string
  issues: string[]
  recommendations: string[]
  details?: React.ReactNode
}

function AuditItem({ title, status, value, issues, recommendations, details }: AuditItemProps) {
  return (
    <Card>
      <AccordionItem value={title} className="border-none">
        <CardHeader className="pb-2">
          <AccordionTrigger className="py-0">
            <div className="flex items-center gap-3 text-left">
              {status === "good" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              {status === "warning" && <AlertTriangle className="h-5 w-5 text-amber-500" />}
              {status === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
              <div>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription className="text-sm">{value}</CardDescription>
              </div>
            </div>
          </AccordionTrigger>
        </CardHeader>
        <AccordionContent>
          <CardContent className="pt-0">
            {issues.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Issues Found:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {issues.map((issue, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Recommendations:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {recommendations.map((recommendation, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {details}
          </CardContent>
        </AccordionContent>
      </AccordionItem>
    </Card>
  )
}
