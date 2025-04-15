import { NextResponse } from "next/server"
import puppeteer from "puppeteer-core"
import chromium from "@sparticuz/chromium"

export const maxDuration = 60 // Set max duration to 60 seconds

export async function POST(request: Request) {
  try {
    const { report, url } = await request.json()

    if (!report || !url) {
      return NextResponse.json({ error: "Report and URL are required" }, { status: 400 })
    }

    // Format the report data for PDF
    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }

    // Generate HTML content for the PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SEO Audit Report - ${new URL(url).hostname}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
          }
          h1 {
            color: #2563eb;
            margin-bottom: 10px;
          }
          h2 {
            color: #1e40af;
            margin-top: 30px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
          }
          h3 {
            color: #1e3a8a;
            margin-top: 20px;
          }
          .url {
            color: #666;
            font-size: 16px;
            margin-bottom: 5px;
          }
          .date {
            color: #888;
            font-size: 14px;
          }
          .section {
            margin-bottom: 30px;
          }
          .item {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f9fafb;
            border-radius: 5px;
          }
          .item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .item-name {
            font-weight: bold;
            font-size: 16px;
          }
          .grade {
            padding: 3px 10px;
            border-radius: 12px;
            font-weight: bold;
            font-size: 14px;
          }
          .grade-a {
            background-color: #d1fae5;
            color: #065f46;
          }
          .grade-b {
            background-color: #dcfce7;
            color: #166534;
          }
          .grade-c {
            background-color: #fef3c7;
            color: #92400e;
          }
          .grade-d {
            background-color: #ffedd5;
            color: #9a3412;
          }
          .grade-f {
            background-color: #fee2e2;
            color: #b91c1c;
          }
          .value {
            margin-bottom: 10px;
            font-size: 14px;
          }
          .issues {
            margin-bottom: 10px;
          }
          .issues-title {
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 14px;
          }
          .issue-list {
            margin: 0;
            padding-left: 20px;
            font-size: 14px;
          }
          .recommendations {
            margin-top: 10px;
          }
          .recommendations-title {
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 14px;
          }
          .recommendation-list {
            margin: 0;
            padding-left: 20px;
            font-size: 14px;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SEO Audit Report</h1>
          <div class="url">${url}</div>
          <div class="date">Generated on ${formatDate(report.timestamp || new Date().toISOString())}</div>
        </div>
        
        <div class="section">
          <h2>On-Page SEO</h2>
          ${Object.entries(report.onPageSEO)
            .map(
              ([key, item]: [string, any]) => `
            <div class="item">
              <div class="item-header">
                <div class="item-name">${item.name || key}</div>
                <div class="grade grade-${item.grade.toLowerCase()}">${item.grade}</div>
              </div>
              ${item.value ? `<div class="value"><strong>Current Value:</strong> ${item.value}</div>` : ""}
              ${
                item.issues && item.issues.length > 0
                  ? `
                <div class="issues">
                  <div class="issues-title">Issues:</div>
                  <ul class="issue-list">
                    ${item.issues.map((issue: string) => `<li>${issue}</li>`).join("")}
                  </ul>
                </div>
              `
                  : `<div class="issues">No issues detected</div>`
              }
              ${
                item.recommendations && item.recommendations.length > 0
                  ? `
                <div class="recommendations">
                  <div class="recommendations-title">Recommendations:</div>
                  <ul class="recommendation-list">
                    ${item.recommendations.map((rec: string) => `<li>${rec}</li>`).join("")}
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
        
        <div class="section">
          <h2>Technical SEO</h2>
          ${Object.entries(report.technicalSEO)
            .map(
              ([key, item]: [string, any]) => `
            <div class="item">
              <div class="item-header">
                <div class="item-name">${item.name || key}</div>
                <div class="grade grade-${item.grade.toLowerCase()}">${item.grade}</div>
              </div>
              ${item.value ? `<div class="value"><strong>Current Value:</strong> ${item.value}</div>` : ""}
              ${
                item.issues && item.issues.length > 0
                  ? `
                <div class="issues">
                  <div class="issues-title">Issues:</div>
                  <ul class="issue-list">
                    ${item.issues.map((issue: string) => `<li>${issue}</li>`).join("")}
                  </ul>
                </div>
              `
                  : `<div class="issues">No issues detected</div>`
              }
              ${
                item.recommendations && item.recommendations.length > 0
                  ? `
                <div class="recommendations">
                  <div class="recommendations-title">Recommendations:</div>
                  <ul class="recommendation-list">
                    ${item.recommendations.map((rec: string) => `<li>${rec}</li>`).join("")}
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
        
        <div class="section">
          <h2>Content SEO</h2>
          ${Object.entries(report.contentSEO)
            .map(
              ([key, item]: [string, any]) => `
            <div class="item">
              <div class="item-header">
                <div class="item-name">${item.name || key}</div>
                <div class="grade grade-${item.grade.toLowerCase()}">${item.grade}</div>
              </div>
              ${item.value ? `<div class="value"><strong>Current Value:</strong> ${item.value}</div>` : ""}
              ${
                item.issues && item.issues.length > 0
                  ? `
                <div class="issues">
                  <div class="issues-title">Issues:</div>
                  <ul class="issue-list">
                    ${item.issues.map((issue: string) => `<li>${issue}</li>`).join("")}
                  </ul>
                </div>
              `
                  : `<div class="issues">No issues detected</div>`
              }
              ${
                item.recommendations && item.recommendations.length > 0
                  ? `
                <div class="recommendations">
                  <div class="recommendations-title">Recommendations:</div>
                  <ul class="recommendation-list">
                    ${item.recommendations.map((rec: string) => `<li>${rec}</li>`).join("")}
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
        
        <div class="section">
          <h2>Performance</h2>
          ${Object.entries(report.performance)
            .map(
              ([key, item]: [string, any]) => `
            <div class="item">
              <div class="item-header">
                <div class="item-name">${item.name || key}</div>
                <div class="grade grade-${item.grade.toLowerCase()}">${item.grade}</div>
              </div>
              ${item.value ? `<div class="value"><strong>Current Value:</strong> ${item.value}</div>` : ""}
              ${
                item.issues && item.issues.length > 0
                  ? `
                <div class="issues">
                  <div class="issues-title">Issues:</div>
                  <ul class="issue-list">
                    ${item.issues.map((issue: string) => `<li>${issue}</li>`).join("")}
                  </ul>
                </div>
              `
                  : `<div class="issues">No issues detected</div>`
              }
              ${
                item.recommendations && item.recommendations.length > 0
                  ? `
                <div class="recommendations">
                  <div class="recommendations-title">Recommendations:</div>
                  <ul class="recommendation-list">
                    ${item.recommendations.map((rec: string) => `<li>${rec}</li>`).join("")}
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
        
        <div class="section">
          <h2>Indexability</h2>
          ${Object.entries(report.indexability)
            .map(
              ([key, item]: [string, any]) => `
            <div class="item">
              <div class="item-header">
                <div class="item-name">${item.name || key}</div>
                <div class="grade grade-${item.grade.toLowerCase()}">${item.grade}</div>
              </div>
              ${item.value ? `<div class="value"><strong>Current Value:</strong> ${item.value}</div>` : ""}
              ${
                item.issues && item.issues.length > 0
                  ? `
                <div class="issues">
                  <div class="issues-title">Issues:</div>
                  <ul class="issue-list">
                    ${item.issues.map((issue: string) => `<li>${issue}</li>`).join("")}
                  </ul>
                </div>
              `
                  : `<div class="issues">No issues detected</div>`
              }
              ${
                item.recommendations && item.recommendations.length > 0
                  ? `
                <div class="recommendations">
                  <div class="recommendations-title">Recommendations:</div>
                  <ul class="recommendation-list">
                    ${item.recommendations.map((rec: string) => `<li>${rec}</li>`).join("")}
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
        
        <div class="footer">
          <p>This report was generated automatically and should be used as a guide for SEO improvements.</p>
        </div>
      </body>
      </html>
    `

    // Launch a headless browser
    const browser = await puppeteer.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
      ignoreHTTPSErrors: true,
    })

    // Create a new page
    const page = await browser.newPage()

    // Set the HTML content
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    })

    // Close the browser
    await browser.close()

    // Return the PDF
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="seo-audit-${new URL(url).hostname}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF. Please try again." }, { status: 500 })
  }
}
