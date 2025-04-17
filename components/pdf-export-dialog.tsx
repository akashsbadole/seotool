"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import type { PDFExportOptions, SEOAuditResult } from "@/types/seo-audit"

interface PdfExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: string
  auditResult: SEOAuditResult
}

export function PdfExportDialog({ open, onOpenChange, url, auditResult }: PdfExportDialogProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportOptions, setExportOptions] = useState<PDFExportOptions>({
    includeWatermark: true,
    watermarkText: "SEO Audit Report",
    includeSections: {
      onPageSEO: true,
      technicalSEO: true,
      contentSEO: true,
      performance: true,
      advancedSEO: true,
      competitiveAnalysis: true,
      localSEO: true,
    },
    companyName: "",
    includeRecommendations: true,
  })

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          auditResult,
          exportOptions,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      // Get the PDF as a blob
      const blob = await response.blob()

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob)

      // Create a link element
      const link = document.createElement("a")
      link.href = url
      link.download = `seo-audit-report-${new Date().toISOString().split("T")[0]}.pdf`

      // Append to the document
      document.body.appendChild(link)

      // Trigger the download
      link.click()

      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)

      onOpenChange(false)
    } catch (error) {
      console.error("Error exporting PDF:", error)
      alert("Failed to export PDF. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleSectionChange = (section: keyof PDFExportOptions["includeSections"], checked: boolean) => {
    setExportOptions((prev) => ({
      ...prev,
      includeSections: {
        ...prev.includeSections,
        [section]: checked,
      },
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export PDF Report</DialogTitle>
          <DialogDescription>Customize your SEO audit report before exporting</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name (Optional)</Label>
            <Input
              id="companyName"
              placeholder="Your Company Name"
              value={exportOptions.companyName}
              onChange={(e) =>
                setExportOptions((prev) => ({
                  ...prev,
                  companyName: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="watermarkText">Watermark Text</Label>
            <div className="flex items-center gap-2">
              <Checkbox
                id="includeWatermark"
                checked={exportOptions.includeWatermark}
                onCheckedChange={(checked) =>
                  setExportOptions((prev) => ({
                    ...prev,
                    includeWatermark: checked === true,
                  }))
                }
              />
              <Label htmlFor="includeWatermark" className="text-sm font-normal">
                Include watermark
              </Label>
            </div>
            {exportOptions.includeWatermark && (
              <Input
                id="watermarkText"
                placeholder="Watermark Text"
                value={exportOptions.watermarkText}
                onChange={(e) =>
                  setExportOptions((prev) => ({
                    ...prev,
                    watermarkText: e.target.value,
                  }))
                }
              />
            )}
          </div>

          <div className="space-y-2">
            <Label>Include Sections</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="includeOnPageSEO"
                  checked={exportOptions.includeSections.onPageSEO}
                  onCheckedChange={(checked) => handleSectionChange("onPageSEO", checked === true)}
                />
                <Label htmlFor="includeOnPageSEO" className="text-sm font-normal">
                  On-Page SEO
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="includeTechnicalSEO"
                  checked={exportOptions.includeSections.technicalSEO}
                  onCheckedChange={(checked) => handleSectionChange("technicalSEO", checked === true)}
                />
                <Label htmlFor="includeTechnicalSEO" className="text-sm font-normal">
                  Technical SEO
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="includeContentSEO"
                  checked={exportOptions.includeSections.contentSEO}
                  onCheckedChange={(checked) => handleSectionChange("contentSEO", checked === true)}
                />
                <Label htmlFor="includeContentSEO" className="text-sm font-normal">
                  Content SEO
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="includePerformance"
                  checked={exportOptions.includeSections.performance}
                  onCheckedChange={(checked) => handleSectionChange("performance", checked === true)}
                />
                <Label htmlFor="includePerformance" className="text-sm font-normal">
                  Performance
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="includeAdvancedSEO"
                  checked={exportOptions.includeSections.advancedSEO}
                  onCheckedChange={(checked) => handleSectionChange("advancedSEO", checked === true)}
                />
                <Label htmlFor="includeAdvancedSEO" className="text-sm font-normal">
                  Advanced SEO
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="includeCompetitiveAnalysis"
                  checked={exportOptions.includeSections.competitiveAnalysis}
                  onCheckedChange={(checked) => handleSectionChange("competitiveAnalysis", checked === true)}
                />
                <Label htmlFor="includeCompetitiveAnalysis" className="text-sm font-normal">
                  Competitive Analysis
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="includeLocalSEO"
                  checked={exportOptions.includeSections.localSEO}
                  onCheckedChange={(checked) => handleSectionChange("localSEO", checked === true)}
                />
                <Label htmlFor="includeLocalSEO" className="text-sm font-normal">
                  Local SEO
                </Label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="includeRecommendations"
              checked={exportOptions.includeRecommendations}
              onCheckedChange={(checked) =>
                setExportOptions((prev) => ({
                  ...prev,
                  includeRecommendations: checked === true,
                }))
              }
            />
            <Label htmlFor="includeRecommendations" className="text-sm font-normal">
              Include recommendations
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              "Export PDF"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
