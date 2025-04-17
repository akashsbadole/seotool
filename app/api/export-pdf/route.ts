import { NextResponse } from "next/server"
import type { PDFExportOptions, SEOAuditResult } from "@/types/seo-audit"
import puppeteer from "puppeteer"

export async function POST(request: Request) {
  try {
    const { url, auditResult, exportOptions } = await request.json()

    // Generate HTML for the PDF
    const html = generatePdfHtml(url, auditResult, exportOptions)

    // Launch a headless browser
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    // Set the HTML content
    await page.setContent(html, { waitUntil: "networkidle0" })

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    })

    // Close the browser
    await browser.close()

    // Return the PDF
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="seo-audit-report-${new Date().toISOString().split("T")[0]}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}

function generatePdfHtml(url: string, auditResult: SEOAuditResult, options: PDFExportOptions): string {
  const { overallScore } = auditResult
  const { includeWatermark, watermarkText, includeSections, companyName, includeRecommendations } = options

  // Helper function to get status color
  const getStatusColor = (status: "good" | "warning" | "error") => {
    switch (status) {
      case "good":
        return "#22c55e" // green-500
      case "warning":
        return "#f59e0b" // amber-500
      case "error":
        return "#ef4444" // red-500
      default:
        return "#6b7280" // gray-500
    }
  }

  // Helper function to get score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return "#22c55e" // green-500
    if (score >= 70) return "#f59e0b" // amber-500
    return "#ef4444" // red-500
  }

  // Generate watermark style if enabled
  const watermarkStyle = includeWatermark
    ? `
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 100px;
      color: rgba(0, 0, 0, 0.05);
      z-index: -1;
      white-space: nowrap;
      pointer-events: none;
    }
  `
    : ""

  // Generate sections HTML based on includeSections
  let sectionsHtml = ""

  if (includeSections.onPageSEO) {
    sectionsHtml += generateSectionHtml(
      "On-Page SEO",
      auditResult.onPageSEO.score,
      [
        { title: "Meta Title", ...auditResult.onPageSEO.metaTitle },
        { title: "Meta Description", ...auditResult.onPageSEO.metaDescription },
        {
          title: "Heading Structure",
          status: auditResult.onPageSEO.headings.status,
          value: `${auditResult.onPageSEO.headings.h1Count} H1, ${auditResult.onPageSEO.headings.h2Count} H2, ${auditResult.onPageSEO.headings.h3Count} H3`,
          issues: auditResult.onPageSEO.headings.issues,
          recommendations: auditResult.onPageSEO.headings.recommendations,
        },
        {
          title: "Image Alt Attributes",
          status: auditResult.onPageSEO.imageAlt.status,
          value: `${auditResult.onPageSEO.imageAlt.withAlt} of ${auditResult.onPageSEO.imageAlt.total} images have alt text`,
          issues: auditResult.onPageSEO.imageAlt.issues,
          recommendations: auditResult.onPageSEO.imageAlt.recommendations,
        },
        { title: "URL Structure", ...auditResult.onPageSEO.urlStructure },
        {
          title: "Internal Links",
          status: auditResult.onPageSEO.internalLinks.status,
          value: `${auditResult.onPageSEO.internalLinks.count} internal links found`,
          issues: auditResult.onPageSEO.internalLinks.issues,
          recommendations: auditResult.onPageSEO.internalLinks.recommendations,
        },
      ],
      includeRecommendations,
    )
  }

  if (includeSections.technicalSEO) {
    sectionsHtml += generateSectionHtml(
      "Technical SEO",
      auditResult.technicalSEO.score,
      [
        { title: "HTTP Status", ...auditResult.technicalSEO.httpStatus },
        {
          title: "Broken Links",
          status: auditResult.technicalSEO.brokenLinks.status,
          value: `${auditResult.technicalSEO.brokenLinks.broken} of ${auditResult.technicalSEO.brokenLinks.total} links are broken`,
          issues: auditResult.technicalSEO.brokenLinks.issues,
          recommendations: auditResult.technicalSEO.brokenLinks.recommendations,
        },
        {
          title: "Page Speed",
          status: auditResult.technicalSEO.pageSpeed.status,
          value: `${auditResult.technicalSEO.pageSpeed.score}/100`,
          issues: auditResult.technicalSEO.pageSpeed.issues,
          recommendations: auditResult.technicalSEO.pageSpeed.recommendations,
        },
        { title: "Mobile-Friendliness", ...auditResult.technicalSEO.mobileFriendliness },
        { title: "SSL Certificate", ...auditResult.technicalSEO.ssl },
        { title: "Canonical Tags", ...auditResult.technicalSEO.canonicalTags },
        { title: "Hreflang Implementation", ...auditResult.technicalSEO.hreflang },
        {
          title: "Core Web Vitals",
          status: auditResult.technicalSEO.coreWebVitals.status,
          value: `LCP: ${auditResult.technicalSEO.coreWebVitals.lcp.value}, FID: ${auditResult.technicalSEO.coreWebVitals.fid.value}, CLS: ${auditResult.technicalSEO.coreWebVitals.cls.value}`,
          issues: auditResult.technicalSEO.coreWebVitals.issues,
          recommendations: auditResult.technicalSEO.coreWebVitals.recommendations,
        },
        { title: "Duplicate Content", ...auditResult.technicalSEO.duplicateContent },
        { title: "Robots.txt", ...auditResult.technicalSEO.robotsTxt },
        { title: "Sitemap.xml", ...auditResult.technicalSEO.sitemap },
        { title: "Structured Data", ...auditResult.technicalSEO.structuredData },
      ],
      includeRecommendations,
    )
  }

  if (includeSections.contentSEO) {
    sectionsHtml += generateSectionHtml(
      "Content SEO",
      auditResult.contentSEO.score,
      [
        {
          title: "Content Quality",
          status: auditResult.contentSEO.contentQuality.status,
          value: `${auditResult.contentSEO.contentQuality.score}/100`,
          issues: auditResult.contentSEO.contentQuality.issues,
          recommendations: auditResult.contentSEO.contentQuality.recommendations,
        },
        {
          title: "Content Length",
          status: auditResult.contentSEO.contentLength.status,
          value: `${auditResult.contentSEO.contentLength.wordCount} words`,
          issues: auditResult.contentSEO.contentLength.issues,
          recommendations: auditResult.contentSEO.contentLength.recommendations,
        },
        { title: "Keyword Optimization", ...auditResult.contentSEO.keywordOptimization },
        { title: "Readability", ...auditResult.contentSEO.readability },
        { title: "Thin Content", ...auditResult.contentSEO.thinContent },
        { title: "Content Freshness", ...auditResult.contentSEO.contentFreshness },
        { title: "E-A-T Signals", ...auditResult.contentSEO.eatSignals },
      ],
      includeRecommendations,
    )
  }

  if (includeSections.performance) {
    sectionsHtml += generateSectionHtml(
      "Performance",
      auditResult.performance.score,
      [
        { title: "Largest Contentful Paint (LCP)", ...auditResult.performance.lcp },
        { title: "First Input Delay (FID)", ...auditResult.performance.fid },
        { title: "Cumulative Layout Shift (CLS)", ...auditResult.performance.cls },
      ],
      includeRecommendations,
    )
  }

  if (includeSections.advancedSEO) {
    sectionsHtml += generateSectionHtml(
      "Advanced SEO",
      auditResult.advancedSEO.score,
      [
        { title: "Internal Linking Strength", ...auditResult.advancedSEO.internalLinkingStrength },
        { title: "Page Depth", ...auditResult.advancedSEO.pageDepth },
        {
          title: "Orphaned Pages",
          status: auditResult.advancedSEO.orphanedPages.status,
          value: `${auditResult.advancedSEO.orphanedPages.count} orphaned pages found`,
          issues: auditResult.advancedSEO.orphanedPages.issues,
          recommendations: auditResult.advancedSEO.orphanedPages.recommendations,
        },
        { title: "JavaScript SEO", ...auditResult.advancedSEO.javascriptSEO },
      ],
      includeRecommendations,
    )
  }

  if (includeSections.competitiveAnalysis) {
    sectionsHtml += generateSectionHtml(
      "Competitive Analysis",
      auditResult.competitiveAnalysis.score,
      [
        {
          title: "Backlinks Comparison",
          ...auditResult.competitiveAnalysis.backlinksComparison,
        },
      ],
      includeRecommendations,
      `
      <div class="competitors-table">
        <h4>Competitor Overview</h4>
        <table>
          <thead>
            <tr>
              <th>Domain</th>
              <th>Share of Voice</th>
              <th>Common Keywords</th>
              <th>Unique Keywords</th>
            </tr>
          </thead>
          <tbody>
            ${auditResult.competitiveAnalysis.competitors
              .map(
                (competitor) => `
              <tr>
                <td>${competitor.domain}</td>
                <td>${competitor.shareOfVoice}</td>
                <td>${competitor.commonKeywords}</td>
                <td>${competitor.uniqueKeywords}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `,
    )
  }

  if (includeSections.localSEO && auditResult.localSEO) {
    sectionsHtml += generateSectionHtml(
      "Local SEO",
      auditResult.localSEO.score,
      [
        { title: "Google Business Profile", ...auditResult.localSEO.googleBusinessProfile },
        { title: "Local Citations", ...auditResult.localSEO.localCitations },
        { title: "Local Keywords", ...auditResult.localSEO.localKeywords },
        { title: "Reviews", ...auditResult.localSEO.reviews },
      ],
      includeRecommendations,
    )
  }

  // Complete HTML template
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>SEO Audit Report - ${url}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          position: relative;
        }
        .container {
          max-width: 100%;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .header h1 {
          margin: 0;
          color: #333;
          font-size: 28px;
        }
        .header p {
          margin: 5px 0;
          color: #666;
        }
        .summary {
          margin-bottom: 30px;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 5px;
        }
        .summary h2 {
          margin-top: 0;
        }
        .score {
          font-size: 36px;
          font-weight: bold;
          color: ${getScoreColor(overallScore)};
        }
        .section {
          margin-bottom: 30px;
        }
        .section h2 {
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }
        .item {
          margin-bottom: 20px;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 5px;
        }
        .item-header {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .item h3 {
          margin: 0;
          font-size: 18px;
        }
        .item p {
          margin: 5px 0;
          color: #666;
        }
        .issues, .recommendations {
          margin-top: 10px;
        }
        .issues h4, .recommendations h4 {
          margin-bottom: 5px;
          font-size: 16px;
        }
        .issues ul, .recommendations ul {
          margin: 0;
          padding-left: 20px;
        }
        .issues li, .recommendations li {
          margin-bottom: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
        }
        table th, table td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        table th {
          background-color: #f2f2f2;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
        ${watermarkStyle}
      </style>
    </head>
    <body>
      ${includeWatermark ? `<div class="watermark">${watermarkText || "SEO Audit Report"}</div>` : ""}
      
      <div class="container">
        <div class="header">
          <h1>SEO Audit Report</h1>
          <p>URL: ${url}</p>
          <p>Date: ${new Date().toLocaleDateString()}</p>
          ${companyName ? `<p>Prepared for: ${companyName}</p>` : ""}
        </div>
        
        <div class="summary">
          <h2>Overall SEO Score</h2>
          <div class="score">${overallScore}/100</div>
          <p>
            ${
              overallScore >= 90
                ? "Your website has excellent SEO optimization."
                : overallScore >= 70
                  ? "Your website has good SEO optimization with some areas for improvement."
                  : overallScore >= 50
                    ? "Your website needs significant SEO improvements."
                    : "Your website has critical SEO issues that need immediate attention."
            }
          </p>
        </div>
        
        ${sectionsHtml}
        
        <div class="footer">
          <p>This report was generated on ${new Date().toLocaleString()}</p>
          <p>© ${new Date().getFullYear()} SEO Audit Tool</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateSectionHtml(
  title: string,
  score: number,
  items: Array<{
    title: string
    status: "good" | "warning" | "error"
    value: string
    issues: string[]
    recommendations: string[]
  }>,
  includeRecommendations: boolean,
  additionalHtml = "",
): string {
  return `
    <div class="section">
      <h2>${title} - Score: ${score}/100</h2>
      ${additionalHtml}
      ${items
        .map(
          (item) => `
        <div class="item">
          <div class="item-header">
            <div class="status-indicator" style="background-color: ${getStatusColor(item.status)};"></div>
            <h3>${item.title}</h3>
          </div>
          <p>${item.value}</p>
          
          ${
            item.issues.length > 0
              ? `
            <div class="issues">
              <h4>Issues Found:</h4>
              <ul>
                ${item.issues.map((issue) => `<li>${issue}</li>`).join("")}
              </ul>
            </div>
          `
              : ""
          }
          
          ${
            includeRecommendations && item.recommendations.length > 0
              ? `
            <div class="recommendations">
              <h4>Recommendations:</h4>
              <ul>
                ${item.recommendations.map((rec) => `<li>${rec}</li>`).join("")}
              </ul>
            </div>
          `
              : ""
          }
        </div>
      `,
        )
        .join("")}
    </div>
  `
}

function getStatusColor(status: "good" | "warning" | "error"): string {
  switch (status) {
    case "good":
      return "#22c55e" // green-500
    case "warning":
      return "#f59e0b" // amber-500
    case "error":
      return "#ef4444" // red-500
    default:
      return "#6b7280" // gray-500
  }
}
