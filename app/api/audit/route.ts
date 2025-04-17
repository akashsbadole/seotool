import { type NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"
import type { SEOAuditResult } from "@/types/seo-audit"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  try {
    // Fetch the HTML content
    const response = await fetch(url, {
      headers: {
        "User-Agent": "SEO Audit Tool/1.0",
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch URL: ${response.statusText}` }, { status: 500 })
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Extract domain for more realistic data generation
    const domain = new URL(url).hostname

    // Perform the SEO audit
    const auditResult = performSEOAudit($, url, domain)

    return NextResponse.json(auditResult)
  } catch (error) {
    console.error("Error performing SEO audit:", error)
    return NextResponse.json({ error: "Failed to perform SEO audit" }, { status: 500 })
  }
}

function performSEOAudit($: cheerio.CheerioAPI, url: string, domain: string): SEOAuditResult {
  // On-Page SEO checks
  const metaTitleResult = checkMetaTitle($)
  const metaDescriptionResult = checkMetaDescription($)
  const headingsResult = checkHeadings($)
  const imageAltResult = checkImageAlt($)
  const urlStructureResult = checkUrlStructure(url)
  const internalLinksResult = checkInternalLinks($, url)

  // Technical SEO checks
  const pageSpeedResult = mockPageSpeedCheck(domain)
  const mobileFriendlinessResult = mockMobileFriendlinessCheck(domain)
  const sslResult = checkSSL(url)
  const robotsTxtResult = mockRobotsTxtCheck(domain)
  const sitemapResult = mockSitemapCheck(domain)
  const structuredDataResult = checkStructuredData($)
  const httpStatusResult = mockHttpStatusCheck(url)
  const brokenLinksResult = mockBrokenLinksCheck(domain, $)
  const canonicalTagsResult = checkCanonicalTags($, url)
  const hreflangResult = checkHreflang($)
  const coreWebVitalsResult = mockCoreWebVitalsCheck(domain)
  const duplicateContentResult = mockDuplicateContentCheck(domain, $)

  // Content SEO checks
  const contentLengthResult = checkContentLength($)
  const keywordOptimizationResult = mockKeywordOptimizationCheck(domain, $)
  const readabilityResult = mockReadabilityCheck($)
  const contentQualityResult = mockContentQualityCheck($)
  const keywordDensityResult = mockKeywordDensityCheck($)
  const thinContentResult = mockThinContentCheck(contentLengthResult.wordCount)
  const contentFreshnessResult = mockContentFreshnessCheck(domain)
  const eatSignalsResult = mockEATSignalsCheck($)

  // Performance checks
  const lcpResult = mockLCPCheck(domain)
  const fidResult = mockFIDCheck(domain)
  const clsResult = mockCLSCheck(domain)

  // Advanced SEO checks
  const internalLinkingStrengthResult = mockInternalLinkingStrengthCheck($)
  const pageDepthResult = mockPageDepthCheck(url)
  const orphanedPagesResult = mockOrphanedPagesCheck(domain)
  const entityIdentificationResult = mockEntityIdentificationCheck($)
  const serpFeaturesResult = mockSERPFeaturesCheck(domain, $)
  const javascriptSEOResult = mockJavaScriptSEOCheck($)

  // Competitive Analysis
  const competitiveAnalysisResult = mockCompetitiveAnalysisCheck(domain, $)

  // Local SEO
  const localSEOResult = mockLocalSEOCheck(domain, $)

  // Calculate scores
  const onPageScore = calculateCategoryScore([
    metaTitleResult.status,
    metaDescriptionResult.status,
    headingsResult.status,
    imageAltResult.status,
    urlStructureResult.status,
    internalLinksResult.status,
  ])

  const technicalScore = calculateCategoryScore([
    pageSpeedResult.status,
    mobileFriendlinessResult.status,
    sslResult.status,
    robotsTxtResult.status,
    sitemapResult.status,
    structuredDataResult.status,
    httpStatusResult.status,
    brokenLinksResult.status,
    canonicalTagsResult.status,
    hreflangResult.status,
    coreWebVitalsResult.status,
    duplicateContentResult.status,
  ])

  const contentScore = calculateCategoryScore([
    contentLengthResult.status,
    keywordOptimizationResult.status,
    readabilityResult.status,
    contentQualityResult.status,
    keywordDensityResult.status,
    thinContentResult.status,
    contentFreshnessResult.status,
    eatSignalsResult.status,
  ])

  const performanceScore = calculateCategoryScore([lcpResult.status, fidResult.status, clsResult.status])

  const advancedSEOScore = calculateCategoryScore([
    internalLinkingStrengthResult.status,
    pageDepthResult.status,
    orphanedPagesResult.status,
    entityIdentificationResult.status,
    serpFeaturesResult.status,
    javascriptSEOResult.status,
  ])

  const competitiveScore = calculateCategoryScore([competitiveAnalysisResult.backlinksComparison.status])

  // Calculate overall score
  const overallScore = Math.round(
    onPageScore * 0.2 +
      technicalScore * 0.25 +
      contentScore * 0.2 +
      performanceScore * 0.15 +
      advancedSEOScore * 0.1 +
      competitiveScore * 0.1,
  )

  return {
    overallScore,
    onPageSEO: {
      score: onPageScore,
      metaTitle: metaTitleResult,
      metaDescription: metaDescriptionResult,
      headings: headingsResult,
      imageAlt: imageAltResult,
      urlStructure: urlStructureResult,
      internalLinks: internalLinksResult,
    },
    technicalSEO: {
      score: technicalScore,
      pageSpeed: pageSpeedResult,
      mobileFriendliness: mobileFriendlinessResult,
      ssl: sslResult,
      robotsTxt: robotsTxtResult,
      sitemap: sitemapResult,
      structuredData: structuredDataResult,
      httpStatus: httpStatusResult,
      brokenLinks: brokenLinksResult,
      canonicalTags: canonicalTagsResult,
      hreflang: hreflangResult,
      coreWebVitals: coreWebVitalsResult,
      duplicateContent: duplicateContentResult,
    },
    contentSEO: {
      score: contentScore,
      contentLength: contentLengthResult,
      keywordOptimization: keywordOptimizationResult,
      readability: readabilityResult,
      contentQuality: contentQualityResult,
      keywordDensity: keywordDensityResult,
      thinContent: thinContentResult,
      contentFreshness: contentFreshnessResult,
      eatSignals: eatSignalsResult,
    },
    performance: {
      score: performanceScore,
      lcp: lcpResult,
      fid: fidResult,
      cls: clsResult,
    },
    advancedSEO: {
      score: advancedSEOScore,
      internalLinkingStrength: internalLinkingStrengthResult,
      pageDepth: pageDepthResult,
      orphanedPages: orphanedPagesResult,
      entityIdentification: entityIdentificationResult,
      serpFeatures: serpFeaturesResult,
      javascriptSEO: javascriptSEOResult,
    },
    competitiveAnalysis: competitiveAnalysisResult,
    localSEO: localSEOResult,
  }
}

// Helper functions for SEO checks

function checkMetaTitle($: cheerio.CheerioAPI) {
  const metaTitle = $("title").text().trim()
  const issues: string[] = []
  const recommendations: string[] = []

  if (!metaTitle) {
    issues.push("Meta title is missing")
    recommendations.push("Add a descriptive meta title that includes your primary keyword")
    return {
      status: "error" as const,
      value: "Missing",
      issues,
      recommendations,
    }
  }

  if (metaTitle.length < 30) {
    issues.push("Meta title is too short (less than 30 characters)")
    recommendations.push("Expand your title to between 50-60 characters for optimal visibility in search results")
  } else if (metaTitle.length > 60) {
    issues.push("Meta title is too long (more than 60 characters)")
    recommendations.push("Shorten your title to 50-60 characters to prevent truncation in search results")
  }

  if (!issues.length) {
    recommendations.push("Your meta title has a good length")
  }

  return {
    status: issues.length ? ((issues.length > 1 ? "error" : "warning") as const) : ("good" as const),
    value: metaTitle,
    issues,
    recommendations,
  }
}

function checkMetaDescription($: cheerio.CheerioAPI) {
  const metaDescription = $('meta[name="description"]').attr("content")?.trim() || ""
  const issues: string[] = []
  const recommendations: string[] = []

  if (!metaDescription) {
    issues.push("Meta description is missing")
    recommendations.push("Add a compelling meta description that includes your primary keyword")
    return {
      status: "error" as const,
      value: "Missing",
      issues,
      recommendations,
    }
  }

  if (metaDescription.length < 70) {
    issues.push("Meta description is too short (less than 70 characters)")
    recommendations.push("Expand your description to between 120-155 characters")
  } else if (metaDescription.length > 160) {
    issues.push("Meta description is too long (more than 160 characters)")
    recommendations.push("Shorten your description to 120-155 characters to prevent truncation in search results")
  }

  if (!issues.length) {
    recommendations.push("Your meta description has a good length")
  }

  return {
    status: issues.length ? ((issues.length > 1 ? "error" : "warning") as const) : ("good" as const),
    value: metaDescription,
    issues,
    recommendations,
  }
}

function checkHeadings($: cheerio.CheerioAPI) {
  const h1Count = $("h1").length
  const h2Count = $("h2").length
  const h3Count = $("h3").length
  const issues: string[] = []
  const recommendations: string[] = []

  if (h1Count === 0) {
    issues.push("No H1 heading found")
    recommendations.push("Add an H1 heading that includes your primary keyword")
  } else if (h1Count > 1) {
    issues.push(`Multiple H1 headings found (${h1Count})`)
    recommendations.push("Use only one H1 heading per page for proper SEO structure")
  }

  if (h2Count === 0) {
    issues.push("No H2 headings found")
    recommendations.push("Add H2 headings to structure your content and include relevant keywords")
  }

  // Check heading hierarchy
  const headings = $("h1, h2, h3, h4, h5, h6").toArray()
  let previousLevel = 0

  for (let i = 0; i < headings.length; i++) {
    const currentLevel = Number.parseInt(headings[i].name.substring(1))

    if (previousLevel > 0 && currentLevel > previousLevel + 1) {
      issues.push(`Heading hierarchy skip from H${previousLevel} to H${currentLevel}`)
      recommendations.push("Maintain proper heading hierarchy (don't skip levels)")
      break
    }

    previousLevel = currentLevel
  }

  if (!issues.length) {
    recommendations.push("Your heading structure follows SEO best practices")
  }

  return {
    status: issues.length ? ((issues.length > 1 ? "error" : "warning") as const) : ("good" as const),
    h1Count,
    h2Count,
    h3Count,
    issues,
    recommendations,
  }
}

function checkImageAlt($: cheerio.CheerioAPI) {
  const images = $("img")
  const totalImages = images.length
  let imagesWithAlt = 0
  const issues: string[] = []
  const recommendations: string[] = []

  images.each((_, img) => {
    if ($(img).attr("alt")) {
      imagesWithAlt++
    }
  })

  const missingAltCount = totalImages - imagesWithAlt

  if (totalImages === 0) {
    issues.push("No images found on the page")
    recommendations.push("Consider adding relevant images with descriptive alt text")
  } else if (missingAltCount > 0) {
    issues.push(`${missingAltCount} of ${totalImages} images are missing alt attributes`)
    recommendations.push("Add descriptive alt text to all images for better accessibility and SEO")
  }

  if (!issues.length && totalImages > 0) {
    recommendations.push("All images have alt attributes - great job!")
  }

  return {
    status:
      missingAltCount > 0 ? ((missingAltCount === totalImages ? "error" : "warning") as const) : ("good" as const),
    total: totalImages,
    withAlt: imagesWithAlt,
    issues,
    recommendations,
  }
}

function checkUrlStructure(url: string) {
  const parsedUrl = new URL(url)
  const path = parsedUrl.pathname
  const issues: string[] = []
  const recommendations: string[] = []

  // Check for uppercase letters
  if (/[A-Z]/.test(path)) {
    issues.push("URL contains uppercase letters")
    recommendations.push("Use lowercase letters in URLs for better consistency")
  }

  // Check for underscores
  if (/_/.test(path)) {
    issues.push("URL contains underscores")
    recommendations.push("Use hyphens instead of underscores to separate words in URLs")
  }

  // Check for multiple consecutive hyphens
  if (/--/.test(path)) {
    issues.push("URL contains consecutive hyphens")
    recommendations.push("Avoid using consecutive hyphens in URLs")
  }

  // Check for query parameters
  if (parsedUrl.search) {
    issues.push("URL contains query parameters")
    recommendations.push("Consider using clean, static URLs without query parameters")
  }

  if (!issues.length) {
    recommendations.push("Your URL structure follows SEO best practices")
  }

  return {
    status: issues.length ? ((issues.length > 1 ? "error" : "warning") as const) : ("good" as const),
    value: url,
    issues,
    recommendations,
  }
}

function checkInternalLinks($: cheerio.CheerioAPI, url: string) {
  const parsedUrl = new URL(url)
  const baseUrl = parsedUrl.origin
  const links = $("a[href]")
  let internalLinksCount = 0
  const issues: string[] = []
  const recommendations: string[] = []

  links.each((_, link) => {
    const href = $(link).attr("href") || ""

    // Check if it's an internal link
    if (
      href.startsWith("/") ||
      href.startsWith(baseUrl) ||
      (!href.startsWith("http://") && !href.startsWith("https://") && !href.startsWith("#"))
    ) {
      internalLinksCount++

      // Check for empty anchor text
      const anchorText = $(link).text().trim()
      if (!anchorText && !$(link).find("img").length) {
        issues.push("Some internal links have empty anchor text")
        recommendations.push("Use descriptive anchor text for all internal links")
      }
    }
  })

  if (internalLinksCount < 3) {
    issues.push(`Only ${internalLinksCount} internal links found`)
    recommendations.push("Add more internal links to improve site structure and user navigation")
  }

  if (!issues.length) {
    recommendations.push("Your internal linking structure is good")
  }

  return {
    status: issues.length ? ((issues.length > 1 ? "error" : "warning") as const) : ("good" as const),
    count: internalLinksCount,
    issues,
    recommendations,
  }
}

function checkSSL(url: string) {
  const isHttps = url.startsWith("https://")
  const issues: string[] = []
  const recommendations: string[] = []

  if (!isHttps) {
    issues.push("Website is not using HTTPS")
    recommendations.push("Implement SSL/TLS certificate to secure your website with HTTPS")
  } else {
    recommendations.push("Your website is properly secured with HTTPS")
  }

  return {
    status: isHttps ? ("good" as const) : ("error" as const),
    value: isHttps ? "HTTPS Enabled" : "HTTPS Not Enabled",
    issues,
    recommendations,
  }
}

function checkStructuredData($: cheerio.CheerioAPI) {
  const structuredData = $('script[type="application/ld+json"]')
  const issues: string[] = []
  const recommendations: string[] = []

  if (structuredData.length === 0) {
    issues.push("No structured data found")
    recommendations.push("Implement structured data markup (JSON-LD) to help search engines understand your content")
    return {
      status: "warning" as const,
      value: "Not Found",
      issues,
      recommendations,
    }
  }

  // In a real implementation, you would validate the structured data
  // against Schema.org specifications

  return {
    status: "good" as const,
    value: `${structuredData.length} structured data blocks found`,
    issues,
    recommendations: ["Your page includes structured data markup"],
  }
}

function checkContentLength($: cheerio.CheerioAPI) {
  // Extract main content (simplified approach)
  const bodyText = $("body").text()
  const cleanText = bodyText.replace(/\s+/g, " ").trim()
  const wordCount = cleanText.split(" ").length

  const issues: string[] = []
  const recommendations: string[] = []

  if (wordCount < 300) {
    issues.push("Content is too thin (less than 300 words)")
    recommendations.push("Expand your content to at least 600 words for better SEO performance")
  } else if (wordCount < 600) {
    issues.push("Content is relatively short (less than 600 words)")
    recommendations.push("Consider expanding your content to 1000+ words for comprehensive coverage")
  }

  if (!issues.length) {
    recommendations.push("Your content length is good for SEO")
  }

  return {
    status: wordCount < 300 ? ("error" as const) : wordCount < 600 ? ("warning" as const) : ("good" as const),
    wordCount,
    issues,
    recommendations,
  }
}

function checkCanonicalTags($: cheerio.CheerioAPI, url: string) {
  const canonicalTag = $('link[rel="canonical"]').attr("href")
  const issues: string[] = []
  const recommendations: string[] = []

  if (!canonicalTag) {
    issues.push("No canonical tag found")
    recommendations.push("Add a canonical tag to prevent duplicate content issues")
    return {
      status: "warning" as const,
      value: "Missing",
      issues,
      recommendations,
    }
  }

  try {
    const canonicalUrl = new URL(canonicalTag, url).href
    const currentUrl = new URL(url).href

    if (canonicalUrl !== currentUrl) {
      issues.push("Canonical URL does not match the current URL")
      recommendations.push(
        "Ensure the canonical URL points to the current page unless intentionally pointing elsewhere",
      )
    }
  } catch (error) {
    issues.push("Invalid canonical URL")
    recommendations.push("Fix the canonical URL to ensure it's a valid URL")
  }

  if (!issues.length) {
    recommendations.push("Your canonical tag is properly implemented")
  }

  return {
    status: issues.length ? ((issues.length > 1 ? "error" : "warning") as const) : ("good" as const),
    value: canonicalTag || "Missing",
    issues,
    recommendations,
  }
}

function checkHreflang($: cheerio.CheerioAPI) {
  const hreflangTags = $('link[rel="alternate"][hreflang]')
  const issues: string[] = []
  const recommendations: string[] = []

  if (hreflangTags.length === 0) {
    // Not having hreflang tags is not necessarily an issue if the site is not multilingual
    return {
      status: "good" as const,
      value: "Not applicable (no multilingual content detected)",
      issues,
      recommendations: ["Implement hreflang tags if your website targets multiple languages or regions"],
    }
  }

  // Check for self-referencing hreflang
  let hasSelfReference = false
  hreflangTags.each((_, tag) => {
    if ($(tag).attr("hreflang") === "x-default") {
      hasSelfReference = true
    }
  })

  if (!hasSelfReference) {
    issues.push("Missing x-default hreflang tag")
    recommendations.push("Add an x-default hreflang tag to specify the default language version")
  }

  if (!issues.length) {
    recommendations.push("Your hreflang implementation is correct")
  }

  return {
    status: issues.length ? ((issues.length > 1 ? "error" : "warning") as const) : ("good" as const),
    value: `${hreflangTags.length} hreflang tags found`,
    issues,
    recommendations,
  }
}

// Enhanced mock functions with more realistic data

function mockHttpStatusCheck(url: string) {
  // In a real implementation, this would check the actual HTTP status code
  const statusCode = url.includes("example") ? 301 : 200 // Simulate a redirect for example.com
  const issues: string[] = []
  const recommendations: string[] = []

  if (statusCode !== 200) {
    issues.push(`HTTP status code is ${statusCode} (not 200 OK)`)

    if (statusCode >= 300 && statusCode < 400) {
      recommendations.push("Resolve redirect chains to improve page load speed")
      recommendations.push("Update internal links to point directly to the final URL")
    } else if (statusCode >= 400 && statusCode < 500) {
      recommendations.push("Fix client-side errors to ensure proper page access")
      recommendations.push("Check for broken links or incorrect URLs in your navigation")
    } else if (statusCode >= 500) {
      recommendations.push("Resolve server-side errors to ensure proper page access")
      recommendations.push("Check your server logs and fix any server configuration issues")
    }
  } else {
    recommendations.push("Your page returns a proper 200 OK status code")
  }

  return {
    status: statusCode === 200 ? ("good" as const) : ("error" as const),
    value: `HTTP ${statusCode}${statusCode === 301 ? " (Redirect)" : ""}`,
    issues,
    recommendations,
  }
}

function mockBrokenLinksCheck(domain: string, $: cheerio.CheerioAPI) {
  // In a real implementation, this would check all links on the page
  const links = $("a[href]")
  const totalLinks = links.length

  // Generate a deterministic number of broken links based on domain
  const brokenLinks = domain.includes("example") ? 3 : domain.length % 3
  const issues: string[] = []
  const recommendations: string[] = []
  const brokenList: Array<{ url: string; statusCode: number }> = []

  if (brokenLinks > 0) {
    issues.push(`${brokenLinks} broken links found`)
    recommendations.push("Fix or remove broken links to improve user experience and SEO")
    recommendations.push("Set up redirects for pages that have been moved or deleted")
    recommendations.push("Regularly monitor your website for broken links using tools like Screaming Frog")

    // Generate realistic broken links based on the domain
    const statusCodes = [404, 500, 503, 301, 302]
    for (let i = 0; i < brokenLinks; i++) {
      const statusCode = statusCodes[Math.floor(i % statusCodes.length)]
      brokenList.push({
        url: `https://${domain}/broken-link-${i + 1}`,
        statusCode,
      })
    }
  } else {
    recommendations.push("No broken links found - great job!")
  }

  return {
    status: brokenLinks > 0 ? ((brokenLinks > 1 ? "error" : "warning") as const) : ("good" as const),
    total: totalLinks,
    broken: brokenLinks,
    brokenList,
    issues,
    recommendations,
  }
}

function mockCoreWebVitalsCheck(domain: string) {
  // Generate deterministic values based on domain
  const domainHash = domain.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // LCP: 1.0-5.0s (good: ≤2.5s, needs improvement: ≤4.0s, poor: >4.0s)
  const lcpBase = (domainHash % 50) / 10 + 1
  const lcpValue = lcpBase.toFixed(1)

  // FID: 0-300ms (good: ≤100ms, needs improvement: ≤300ms, poor: >300ms)
  const fidBase = domainHash % 300
  const fidValue = fidBase.toString()

  // CLS: 0.00-0.25 (good: ≤0.1, needs improvement: ≤0.25, poor: >0.25)
  const clsBase = (domainHash % 25) / 100
  const clsValue = clsBase.toFixed(2)

  const lcpNumeric = Number.parseFloat(lcpValue)
  const fidNumeric = Number.parseInt(fidValue)
  const clsNumeric = Number.parseFloat(clsValue)

  const lcpStatus = lcpNumeric <= 2.5 ? "good" : lcpNumeric <= 4.0 ? "warning" : "error"
  const fidStatus = fidNumeric <= 100 ? "good" : fidNumeric <= 300 ? "warning" : "error"
  const clsStatus = clsNumeric <= 0.1 ? "good" : clsNumeric <= 0.25 ? "warning" : "error"

  const issues: string[] = []
  const recommendations: string[] = []

  if (lcpStatus !== "good") {
    issues.push(`LCP is too slow (${lcpValue}s)`)
    recommendations.push("Optimize critical rendering path and server response times")
    recommendations.push("Implement proper resource prioritization")
    recommendations.push("Use a Content Delivery Network (CDN) to reduce server response time")
  }

  if (fidStatus !== "good") {
    issues.push(`FID is too high (${fidValue}ms)`)
    recommendations.push("Minimize main thread work and optimize JavaScript execution")
    recommendations.push("Break up long tasks into smaller, asynchronous tasks")
    recommendations.push("Remove or defer non-critical third-party scripts")
  }

  if (clsStatus !== "good") {
    issues.push(`CLS is too high (${clsValue})`)
    recommendations.push("Set size attributes on images and videos to prevent layout shifts")
    recommendations.push("Avoid inserting content above existing content")
    recommendations.push("Use transform animations instead of animations that trigger layout changes")
  }

  if (!issues.length) {
    recommendations.push("Your Core Web Vitals are good - this positively impacts your search rankings")
  }

  const overallStatus =
    lcpStatus === "good" && fidStatus === "good" && clsStatus === "good"
      ? "good"
      : lcpStatus === "error" || fidStatus === "error" || clsStatus === "error"
        ? "error"
        : "warning"

  return {
    status: overallStatus as "good" | "warning" | "error",
    lcp: {
      value: `${lcpValue}s`,
      status: lcpStatus as "good" | "warning" | "error",
    },
    fid: {
      value: `${fidValue}ms`,
      status: fidStatus as "good" | "warning" | "error",
    },
    cls: {
      value: clsValue,
      status: clsStatus as "good" | "warning" | "error",
    },
    issues,
    recommendations,
  }
}

function mockDuplicateContentCheck(domain: string, $: cheerio.CheerioAPI) {
  // In a real implementation, this would check for duplicate content across the site
  const hasDuplicateContent = domain.includes("blog") || domain.includes("news")
  const issues: string[] = []
  const recommendations: string[] = []

  if (hasDuplicateContent) {
    issues.push("Duplicate content detected on multiple pages")
    issues.push("Similar content found on category and tag pages")

    recommendations.push("Use canonical tags to indicate the preferred version of duplicate pages")
    recommendations.push("Implement 301 redirects for duplicate content when appropriate")
    recommendations.push("Use meta robots noindex tag for paginated pages, tag pages, and other thin content")
    recommendations.push("Consolidate similar content into comprehensive guides")
  } else {
    recommendations.push("No duplicate content issues detected")
  }

  return {
    status: hasDuplicateContent ? ("warning" as const) : ("good" as const),
    value: hasDuplicateContent
      ? "Duplicate content detected on category and tag pages"
      : "No duplicate content detected",
    issues,
    recommendations,
  }
}

function mockPageSpeedCheck(domain: string) {
  // Generate a deterministic score based on domain
  const domainHash = domain.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const score = Math.min(100, Math.max(50, (domainHash % 50) + 50)) // Score between 50-100

  const issues: string[] = []
  const recommendations: string[] = []

  if (score < 70) {
    issues.push("Page speed score is below 70")
    issues.push("Slow server response time detected")
    issues.push("Render-blocking resources found")

    recommendations.push("Optimize images and minimize CSS/JavaScript")
    recommendations.push("Implement browser caching with longer expiration times")
    recommendations.push("Use a Content Delivery Network (CDN) to reduce server response time")
    recommendations.push("Eliminate render-blocking resources by deferring non-critical JavaScript")
  } else if (score < 90) {
    issues.push("Page speed could be improved")

    recommendations.push("Consider lazy loading images and videos")
    recommendations.push("Reduce server response time")
    recommendations.push("Preload critical resources")
  } else {
    recommendations.push("Your page speed is excellent")
  }

  return {
    status: score < 70 ? ("error" as const) : score < 90 ? ("warning" as const) : ("good" as const),
    score,
    issues,
    recommendations,
  }
}

function mockMobileFriendlinessCheck(domain: string) {
  // Generate deterministic result based on domain
  const isMobileFriendly = !domain.includes("legacy") && !domain.includes("old")

  const issues: string[] = []
  const recommendations: string[] = []

  if (!isMobileFriendly) {
    issues.push("Page is not mobile-friendly")
    issues.push("Content wider than screen detected")
    issues.push("Touch elements too close together")
    issues.push("Text too small to read on mobile")

    recommendations.push("Implement responsive design principles")
    recommendations.push("Ensure tap targets are at least 48px apart and sized appropriately")
    recommendations.push("Use viewport meta tag with width=device-width")
    recommendations.push("Use relative units for text and container sizes")
  } else {
    recommendations.push("Your page is mobile-friendly")
    recommendations.push("Continue monitoring mobile usability as you update your site")
  }

  return {
    status: isMobileFriendly ? ("good" as const) : ("error" as const),
    value: isMobileFriendly ? "Mobile-Friendly" : "Not Mobile-Friendly",
    issues,
    recommendations,
  }
}

function mockRobotsTxtCheck(domain: string) {
  // Generate deterministic result based on domain
  const hasRobotsTxt = !domain.includes("new") && !domain.includes("test")

  const issues: string[] = []
  const recommendations: string[] = []

  if (!hasRobotsTxt) {
    issues.push("No robots.txt file found")

    recommendations.push("Create a robots.txt file to control search engine crawling")
    recommendations.push("Include directives for all major search engines")
    recommendations.push("Add a sitemap reference in your robots.txt file")
  } else {
    recommendations.push("Your website has a robots.txt file")
    recommendations.push("Regularly review your robots.txt to ensure it's not blocking important content")
  }

  return {
    status: hasRobotsTxt ? ("good" as const) : ("warning" as const),
    value: hasRobotsTxt ? "Found" : "Not Found",
    issues,
    recommendations,
  }
}

function mockSitemapCheck(domain: string) {
  // Generate deterministic result based on domain
  const hasSitemap = !domain.includes("small") && !domain.includes("personal")

  const issues: string[] = []
  const recommendations: string[] = []

  if (!hasSitemap) {
    issues.push("No sitemap.xml file found")

    recommendations.push("Create a sitemap.xml file to help search engines discover your content")
    recommendations.push("Include all important pages in your sitemap")
    recommendations.push("Submit your sitemap to Google Search Console and Bing Webmaster Tools")
  } else {
    recommendations.push("Your website has a sitemap.xml file")
    recommendations.push("Ensure your sitemap is always up-to-date with your latest content")
  }

  return {
    status: hasSitemap ? ("good" as const) : ("warning" as const),
    value: hasSitemap ? "Found" : "Not Found",
    issues,
    recommendations,
  }
}

function mockKeywordOptimizationCheck(domain: string, $: cheerio.CheerioAPI) {
  // Extract potential keywords from content
  const bodyText = $("body").text().toLowerCase()
  const title = $("title").text().toLowerCase()
  const h1 = $("h1").text().toLowerCase()

  // Generate deterministic result based on domain and content
  const optimizationLevel = domain.includes("blog") || domain.includes("news") ? 0.8 : 0.5

  const issues: string[] = []
  const recommendations: string[] = []

  if (optimizationLevel < 0.3) {
    issues.push("Primary keyword not found in important elements")
    issues.push("Low keyword usage in content")

    recommendations.push("Include your primary keyword in title, headings, and first paragraph")
    recommendations.push("Add related keywords throughout your content")
    recommendations.push("Optimize your meta tags with relevant keywords")

    return {
      status: "error" as const,
      value: "Poor keyword optimization",
      issues,
      recommendations,
    }
  } else if (optimizationLevel < 0.7) {
    issues.push("Keyword density could be improved")
    issues.push("Some important elements missing keyword optimization")

    recommendations.push("Ensure natural keyword usage throughout the content")
    recommendations.push("Include keywords in H2 and H3 headings where appropriate")
    recommendations.push("Add LSI (Latent Semantic Indexing) keywords to enhance relevance")

    return {
      status: "warning" as const,
      value: "Moderate keyword optimization",
      issues,
      recommendations,
    }
  } else {
    return {
      status: "good" as const,
      value: "Good keyword optimization",
      issues,
      recommendations: [
        "Your keyword optimization is good",
        "Continue monitoring keyword performance in Search Console",
        "Consider expanding content to target additional related keywords",
      ],
    }
  }
}

function mockReadabilityCheck($: cheerio.CheerioAPI) {
  // Extract content for analysis
  const paragraphs = $("p")
  const paragraphCount = paragraphs.length
  const avgSentences = paragraphCount > 0 ? Math.min(5, Math.max(2, paragraphCount / 2)) : 3

  // Calculate a readability score (simplified)
  const readabilityScore = paragraphCount > 10 ? 75 : paragraphCount > 5 ? 65 : 55

  const issues: string[] = []
  const recommendations: string[] = []

  if (readabilityScore < 60) {
    issues.push("Content is difficult to read")
    issues.push("Sentences are too long and complex")
    issues.push("Content lacks proper structure")

    recommendations.push("Use shorter sentences and simpler language")
    recommendations.push("Break up long paragraphs into smaller chunks")
    recommendations.push("Add more subheadings to organize content")
    recommendations.push("Use bullet points for lists and key points")
  } else if (readabilityScore < 70) {
    issues.push("Readability could be improved")

    recommendations.push("Consider using more transition words")
    recommendations.push("Vary sentence structure for better flow")
    recommendations.push("Add more white space to improve visual readability")
  } else {
    recommendations.push("Your content has good readability")
    recommendations.push("Continue using clear, concise language")
  }

  return {
    status:
      readabilityScore < 60 ? ("error" as const) : readabilityScore < 70 ? ("warning" as const) : ("good" as const),
    value: `${readabilityScore}/100`,
    issues,
    recommendations,
  }
}

function mockContentQualityCheck($: cheerio.CheerioAPI) {
  // Extract content for analysis
  const paragraphs = $("p").length
  const lists = $("ul, ol").length
  const images = $("img").length
  const links = $("a").length

  // Calculate a quality score based on content elements
  const qualityScore = Math.min(100, Math.max(60, paragraphs * 5 + lists * 3 + images * 2 + links))

  const issues: string[] = []
  const recommendations: string[] = []

  if (qualityScore < 80) {
    issues.push("Content quality could be improved")
    issues.push("Content lacks depth and supporting elements")

    recommendations.push("Enhance content with more detailed information and expert insights")
    recommendations.push("Include data, statistics, and citations to support claims")
    recommendations.push("Add relevant images, videos, or infographics to illustrate points")
    recommendations.push("Incorporate expert quotes or testimonials to build credibility")
  } else if (qualityScore < 90) {
    issues.push("Content quality is good but could be better")

    recommendations.push("Add more unique insights and original research to stand out")
    recommendations.push("Consider adding interactive elements to increase engagement")
    recommendations.push("Expand sections that provide the most value to readers")
  } else {
    recommendations.push("Your content quality is excellent")
    recommendations.push("Continue updating with fresh information to maintain quality")
  }

  return {
    status: qualityScore < 80 ? ("warning" as const) : ("good" as const),
    score: qualityScore,
    issues,
    recommendations,
  }
}

function mockKeywordDensityCheck($: cheerio.CheerioAPI) {
  // Extract text content
  const bodyText = $("body").text().toLowerCase()
  const words = bodyText.split(/\s+/)

  // Count word frequencies
  const wordFreq: Record<string, number> = {}
  words.forEach((word) => {
    if (word.length > 3) {
      // Ignore short words
      wordFreq[word] = (wordFreq[word] || 0) + 1
    }
  })

  // Sort by frequency
  const sortedWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([keyword, count]) => ({
      keyword,
      count,
      density: `${((count / words.length) * 100).toFixed(1)}%`,
    }))

  // Check for keyword stuffing or low density
  const highDensity = sortedWords.some((k) => Number.parseFloat(k.density) > 2.5)
  const lowDensity = sortedWords.every((k) => Number.parseFloat(k.density) < 0.5)

  const issues: string[] = []
  const recommendations: string[] = []

  if (highDensity) {
    issues.push("Some keywords have unusually high density (potential keyword stuffing)")
    issues.push("Overuse of keywords may trigger spam filters")

    recommendations.push("Reduce keyword density to avoid keyword stuffing penalties")
    recommendations.push("Use synonyms and related terms instead of repeating the same keywords")
    recommendations.push("Focus on writing naturally for users, not search engines")
  } else if (lowDensity) {
    issues.push("Primary keywords have low density")
    issues.push("Content may lack focus on target keywords")

    recommendations.push("Increase the usage of important keywords in your content (aim for 1-2% density)")
    recommendations.push("Ensure keywords appear in important elements like headings and first paragraph")
    recommendations.push("Add more content around your target topic")
  } else {
    recommendations.push("Your keyword density appears to be within a natural range")
    recommendations.push("Continue focusing on creating valuable content for users")
  }

  return {
    status: highDensity ? ("warning" as const) : lowDensity ? ("warning" as const) : ("good" as const),
    keywords: sortedWords,
    issues,
    recommendations,
  }
}

function mockThinContentCheck(wordCount: number) {
  const issues: string[] = []
  const recommendations: string[] = []

  if (wordCount < 300) {
    issues.push("Page has thin content (less than 300 words)")
    issues.push("Search engines may devalue pages with insufficient content")
    issues.push("Thin content pages rarely rank well for competitive keywords")

    recommendations.push("Expand your content to at least 600 words for better search visibility")
    recommendations.push("Add more detailed information, examples, and explanations")
    recommendations.push("Consider merging with other related thin content pages")
    recommendations.push("If appropriate, add FAQs to naturally increase word count")

    return {
      status: "error" as const,
      value: "Thin content detected",
      issues,
      recommendations,
    }
  } else if (wordCount < 600) {
    issues.push("Content is on the shorter side (less than 600 words)")
    issues.push("May not be comprehensive enough for competitive keywords")

    recommendations.push("Consider expanding your content to 1000+ words for comprehensive coverage")
    recommendations.push("Add more sections addressing user questions and needs")
    recommendations.push("Include expert insights, data, or case studies to add depth")

    return {
      status: "warning" as const,
      value: "Content could be expanded",
      issues,
      recommendations,
    }
  } else {
    return {
      status: "good" as const,
      value: "Content length is sufficient",
      issues,
      recommendations: [
        "Your content has sufficient length for good SEO performance",
        "Focus on maintaining quality while ensuring comprehensive coverage",
        "Regularly update content to keep it fresh and relevant",
      ],
    }
  }
}

function mockContentFreshnessCheck(domain: string) {
  // Generate a deterministic last updated date based on domain
  const domainHash = domain.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const daysAgo = domainHash % 365 // 0-364 days ago

  const lastUpdated = new Date()
  lastUpdated.setDate(lastUpdated.getDate() - daysAgo)

  const issues: string[] = []
  const recommendations: string[] = []

  if (daysAgo > 180) {
    issues.push(`Content was last updated ${daysAgo} days ago`)
    issues.push("Outdated content may contain inaccurate information")
    issues.push("Search engines prefer fresh content for many queries")

    recommendations.push("Update your content regularly to maintain freshness signals")
    recommendations.push("Add new information, examples, or data to keep content current")
    recommendations.push("Implement a content audit schedule to regularly review older content")
    recommendations.push("Add a 'Last Updated' date to signal freshness to users and search engines")

    return {
      status: "warning" as const,
      value: `Last updated ${lastUpdated.toLocaleDateString()} (${daysAgo} days ago)`,
      issues,
      recommendations,
    }
  } else {
    return {
      status: "good" as const,
      value: `Last updated ${lastUpdated.toLocaleDateString()} (${daysAgo} days ago)`,
      issues,
      recommendations: [
        "Your content is relatively fresh and up-to-date",
        "Continue to monitor industry changes to keep content current",
        "Consider adding a visible 'Last Updated' date to signal freshness to users",
      ],
    }
  }
}

function mockEATSignalsCheck($: cheerio.CheerioAPI) {
  // Check for author information
  const hasAuthorInfo = $('[rel="author"]').length > 0 || $('*:contains("author")').length > 0

  // Check for credentials
  const hasCredentials = $('*:contains("certified")').length > 0 || $('*:contains("expert")').length > 0

  // Check for citations
  const hasCitations = $("cite").length > 0 || $("blockquote").length > 0

  const issues: string[] = []
  const recommendations: string[] = []

  if (!hasAuthorInfo) {
    issues.push("No clear author information found")
    recommendations.push("Add author information with credentials to improve E-A-T signals")
    recommendations.push("Include author bios that highlight expertise and authority")
  }

  if (!hasCredentials) {
    issues.push("Author credentials or expertise not clearly stated")
    recommendations.push("Include author credentials, qualifications, or expertise to enhance trustworthiness")
    recommendations.push("Highlight relevant experience, certifications, or education")
  }

  if (!hasCitations) {
    issues.push("Content lacks citations or references to authoritative sources")
    recommendations.push("Add citations, references, or links to authoritative sources to improve credibility")
    recommendations.push("Include data from reputable studies or organizations")
  }

  const status =
    !hasAuthorInfo && !hasCredentials
      ? ("error" as const)
      : !hasAuthorInfo || !hasCredentials || !hasCitations
        ? ("warning" as const)
        : ("good" as const)

  if (!issues.length) {
    recommendations.push("Your content demonstrates good E-A-T signals")
    recommendations.push("Continue building authority with expert content and proper citations")
  }

  return {
    status,
    value: status === "good" ? "Good E-A-T signals detected" : "E-A-T signals could be improved",
    issues,
    recommendations,
  }
}

function mockLCPCheck(domain: string) {
  // Generate deterministic LCP value based on domain
  const domainHash = domain.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const lcpValue = ((domainHash % 40) / 10 + 1).toFixed(1) // 1.0-5.0s

  const lcpNumeric = Number.parseFloat(lcpValue)
  const issues: string[] = []
  const recommendations: string[] = []

  if (lcpNumeric > 2.5) {
    issues.push(`LCP is too slow (${lcpValue}s)`)
    issues.push("Users may perceive your page as slow to load")

    if (lcpNumeric > 4.0) {
      issues.push("Extremely slow LCP may significantly impact user experience and rankings")
    }

    recommendations.push("Optimize critical rendering path")
    recommendations.push("Reduce server response times")
    recommendations.push("Optimize and preload key resources")
    recommendations.push("Implement proper resource prioritization")
    recommendations.push("Use a Content Delivery Network (CDN)")
  } else {
    recommendations.push("Your LCP performance is good")
    recommendations.push("Continue monitoring LCP as you add new features or content")
  }

  return {
    status: lcpNumeric > 2.5 ? ((lcpNumeric > 4.0 ? "error" : "warning") as const) : ("good" as const),
    value: `${lcpValue}s`,
    issues,
    recommendations,
  }
}

function mockFIDCheck(domain: string) {
  // Generate deterministic FID value based on domain
  const domainHash = domain.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const fidValue = (domainHash % 300).toString() // 0-300ms

  const fidNumeric = Number.parseInt(fidValue)
  const issues: string[] = []
  const recommendations: string[] = []

  if (fidNumeric > 100) {
    issues.push(`FID is too slow (${fidValue}ms)`)
    issues.push("Users may experience delayed interaction with your page")

    if (fidNumeric > 300) {
      issues.push("Extremely high FID indicates significant interactivity issues")
    }

    recommendations.push("Minimize main thread work")
    recommendations.push("Break up long tasks into smaller chunks")
    recommendations.push("Optimize JavaScript execution and reduce JavaScript bundle size")
    recommendations.push("Defer or remove non-critical third-party scripts")
    recommendations.push("Use web workers for complex calculations")
  } else {
    recommendations.push("Your FID performance is good")
    recommendations.push("Continue monitoring JavaScript performance as you add new features")
  }

  return {
    status: fidNumeric > 100 ? ((fidNumeric > 300 ? "error" : "warning") as const) : ("good" as const),
    value: `${fidValue}ms`,
    issues,
    recommendations,
  }
}

function mockCLSCheck(domain: string) {
  // Generate deterministic CLS value based on domain
  const domainHash = domain.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const clsValue = ((domainHash % 25) / 100).toFixed(2) // 0.00-0.25

  const clsNumeric = Number.parseFloat(clsValue)
  const issues: string[] = []
  const recommendations: string[] = []

  if (clsNumeric > 0.1) {
    issues.push(`CLS is too high (${clsValue})`)
    issues.push("Users may experience unexpected layout shifts")

    if (clsNumeric > 0.25) {
      issues.push("Very high CLS indicates major visual stability issues")
    }

    recommendations.push("Set size attributes on images and video elements")
    recommendations.push("Avoid inserting content above existing content")
    recommendations.push("Use transform animations instead of animations that trigger layout changes")
    recommendations.push("Reserve space for dynamic content like ads")
    recommendations.push("Ensure web fonts don't cause layout shifts")
  } else {
    recommendations.push("Your CLS performance is good")
    recommendations.push("Continue monitoring layout stability as you add new elements")
  }

  return {
    status: clsNumeric > 0.1 ? ((clsNumeric > 0.25 ? "error" : "warning") as const) : ("good" as const),
    value: clsValue,
    issues,
    recommendations,
  }
}

function mockInternalLinkingStrengthCheck($: cheerio.CheerioAPI) {
  // Analyze internal links
  const internalLinks = $("a[href^='/'], a[href^='#']").length
  const totalLinks = $("a").length

  // Calculate a score based on internal linking
  const linkingScore = Math.min(100, Math.max(50, internalLinks * 5))

  const issues: string[] = []
  const recommendations: string[] = []

  if (linkingScore < 70) {
    issues.push("Internal linking structure is weak")
    issues.push("Poor internal link distribution")
    issues.push("Key pages may not be receiving enough internal links")

    recommendations.push("Create a more robust internal linking structure with relevant anchor text")
    recommendations.push("Ensure important pages receive more internal links")
    recommendations.push("Implement a hub and spoke model for content organization")
    recommendations.push("Add contextual links within content to related pages")
  } else if (linkingScore < 90) {
    issues.push("Internal linking could be improved")

    recommendations.push("Add more contextual internal links to related content")
    recommendations.push("Use descriptive anchor text that includes target keywords")
    recommendations.push("Create pillar content that links to related subtopics")
  } else {
    recommendations.push("Your internal linking structure is strong")
    recommendations.push("Continue linking to important pages from new content")
  }

  return {
    status: linkingScore < 70 ? ("warning" as const) : ("good" as const),
    value: `${linkingScore}/100 (${internalLinks} internal links)`,
    issues,
    recommendations,
  }
}

function mockPageDepthCheck(url: string) {
  // Analyze URL structure to estimate page depth
  const path = new URL(url).pathname
  const segments = path.split("/").filter(Boolean)
  const clicksFromHomepage = segments.length || 1

  const issues: string[] = []
  const recommendations: string[] = []

  if (clicksFromHomepage > 3) {
    issues.push(`Page is ${clicksFromHomepage} clicks away from the homepage`)
    issues.push("Deep pages may receive less PageRank")
    issues.push("Search engines may crawl deep pages less frequently")

    recommendations.push("Reduce the number of clicks required to reach this page from the homepage")
    recommendations.push("Consider adding direct links from the main navigation or homepage")
    recommendations.push("Implement breadcrumbs to improve navigation and SEO")
    recommendations.push("Add links to this page from higher-level pages")
  } else {
    recommendations.push("Your page depth is good (3 or fewer clicks from homepage)")
    recommendations.push("Continue maintaining a flat site architecture for optimal crawling")
  }

  return {
    status: clicksFromHomepage > 3 ? ("warning" as const) : ("good" as const),
    value: `${clicksFromHomepage} clicks from homepage`,
    issues,
    recommendations,
  }
}

function mockOrphanedPagesCheck(domain: string) {
  // Generate deterministic result based on domain
  const domainHash = domain.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const orphanedCount = domainHash % 4 // 0-3 orphaned pages

  const issues: string[] = []
  const recommendations: string[] = []

  if (orphanedCount > 0) {
    issues.push(`${orphanedCount} orphaned pages found`)
    issues.push("Orphaned pages receive no internal links")
    issues.push("Search engines may have difficulty discovering orphaned pages")

    recommendations.push("Add internal links to orphaned pages to improve their visibility")
    recommendations.push("Consider adding these pages to your sitemap and navigation")
    recommendations.push("Implement a related content section to link to orphaned pages")
    recommendations.push("Review your site structure to prevent creating new orphaned pages")
  } else {
    recommendations.push("No orphaned pages detected")
    recommendations.push("Continue maintaining good site structure and internal linking")
  }

  return {
    status: orphanedCount > 0 ? ("warning" as const) : ("good" as const),
    count: orphanedCount,
    issues,
    recommendations,
  }
}

function mockEntityIdentificationCheck($: cheerio.CheerioAPI) {
  // Extract potential entities from content
  const bodyText = $("body").text()

  // Common entity types
  const potentialEntities = ["Product", "Service", "Organization", "Person", "Location", "Event", "Creative Work"]

  // Select a subset based on content
  const entities = potentialEntities.filter(() => Math.random() > 0.3)

  const issues: string[] = []
  const recommendations: string[] = []

  if (entities.length < 3) {
    issues.push("Few entities identified in the content")
    issues.push("Content may lack semantic richness")

    recommendations.push("Enrich your content with more named entities relevant to your topic")
    recommendations.push("Use schema markup to explicitly identify entities for search engines")
    recommendations.push("Include specific people, places, organizations, and concepts in your content")
    recommendations.push("Add structured data to help search engines understand entity relationships")
  } else {
    recommendations.push("Your content contains a good number of identifiable entities")
    recommendations.push("Consider adding schema markup to enhance entity recognition")
  }

  return {
    status: entities.length < 3 ? ("warning" as const) : ("good" as const),
    entities,
    issues,
    recommendations,
  }
}

function mockSERPFeaturesCheck(domain: string, $: cheerio.CheerioAPI) {
  // Analyze content to determine SERP feature opportunities
  const hasLists = $("ul, ol").length > 0
  const hasQuestions = $("h2:contains('?'), h3:contains('?')").length > 0
  const hasImages = $("img").length > 3
  const hasVideo = $("video").length > 0 || $("iframe[src*='youtube']").length > 0

  // Potential SERP features
  const allOpportunities = [
    "Featured Snippet",
    "FAQ Schema",
    "How-to Schema",
    "Video Results",
    "Image Pack",
    "Knowledge Panel",
    "Local Pack",
  ]

  // Select opportunities based on content
  const opportunities = []

  if (hasLists) {
    opportunities.push("Featured Snippet")
    opportunities.push("How-to Schema")
  }

  if (hasQuestions) {
    opportunities.push("FAQ Schema")
  }

  if (hasImages) {
    opportunities.push("Image Pack")
  }

  if (hasVideo) {
    opportunities.push("Video Results")
  }

  // Add at least one random opportunity if none detected
  if (opportunities.length === 0) {
    opportunities.push(allOpportunities[Math.floor(Math.random() * allOpportunities.length)])
  }

  const issues: string[] = []
  const recommendations: string[] = []

  if (opportunities.length === 0) {
    issues.push("No clear SERP feature opportunities identified")

    recommendations.push("Structure your content to target featured snippets or other SERP features")
    recommendations.push("Add FAQ sections to target FAQ rich results")
    recommendations.push("Include step-by-step instructions for how-to rich results")
    recommendations.push("Add high-quality images with proper alt text for image packs")
  } else {
    recommendations.push("Optimize your content to target the identified SERP feature opportunities")

    if (opportunities.includes("Featured Snippet")) {
      recommendations.push("Format key information in lists, tables, or short paragraphs for featured snippets")
    }

    if (opportunities.includes("FAQ Schema")) {
      recommendations.push("Implement FAQ schema markup for question-and-answer content")
    }

    if (opportunities.includes("How-to Schema")) {
      recommendations.push("Add step-by-step instructions with how-to schema markup")
    }
  }

  return {
    status: opportunities.length === 0 ? ("warning" as const) : ("good" as const),
    opportunities,
    issues,
    recommendations,
  }
}

function mockJavaScriptSEOCheck($: cheerio.CheerioAPI) {
  // Check for JavaScript-heavy indicators
  const hasJSFrameworks = $("script:contains('react'), script:contains('vue'), script:contains('angular')").length > 0
  const hasAjaxContent = $("script:contains('ajax'), script:contains('fetch'), script:contains('axios')").length > 0

  const hasJSIssues = hasJSFrameworks || hasAjaxContent

  const issues: string[] = []
  const recommendations: string[] = []

  if (hasJSIssues) {
    issues.push("JavaScript-rendered content may not be fully indexed")
    issues.push("Search engines may miss dynamically loaded content")
    issues.push("JavaScript errors may prevent proper rendering")

    recommendations.push("Implement server-side rendering or dynamic rendering for critical content")
    recommendations.push("Ensure your JavaScript doesn't block indexing of important content")
    recommendations.push("Use pre-rendering for static content")
    recommendations.push("Implement proper error handling in JavaScript code")
    recommendations.push("Test your site with JavaScript disabled to identify critical content issues")
  } else {
    recommendations.push("No JavaScript SEO issues detected")
    recommendations.push("Continue following JavaScript SEO best practices as you add new features")
  }

  return {
    status: hasJSIssues ? ("warning" as const) : ("good" as const),
    value: hasJSIssues ? "JavaScript SEO issues detected" : "No JavaScript SEO issues detected",
    issues,
    recommendations,
  }
}

function mockCompetitiveAnalysisCheck(domain: string, $: cheerio.CheerioAPI) {
  // Extract potential keywords from content
  const title = $("title").text()
  const h1 = $("h1").text()
  const metaDescription = $('meta[name="description"]').attr("content") || ""

  // Generate domain variations for competitors
  const domainParts = domain.split(".")
  const rootDomain = domainParts[domainParts.length - 2] || domain

  // Generate realistic competitors
  const competitors = [
    {
      domain: `${rootDomain}-competitor1.com`,
      shareOfVoice: `${Math.floor(Math.random() * 20) + 15}%`,
      commonKeywords: Math.floor(Math.random() * 100) + 80,
      uniqueKeywords: Math.floor(Math.random() * 200) + 150,
    },
    {
      domain: `best-${rootDomain}.com`,
      shareOfVoice: `${Math.floor(Math.random() * 15) + 10}%`,
      commonKeywords: Math.floor(Math.random() * 80) + 60,
      uniqueKeywords: Math.floor(Math.random() * 150) + 100,
    },
    {
      domain: `${rootDomain}-pro.com`,
      shareOfVoice: `${Math.floor(Math.random() * 10) + 5}%`,
      commonKeywords: Math.floor(Math.random() * 60) + 40,
      uniqueKeywords: Math.floor(Math.random() * 100) + 80,
    },
    {
      domain: `${rootDomain}hub.com`,
      shareOfVoice: `${Math.floor(Math.random() * 8) + 3}%`,
      commonKeywords: Math.floor(Math.random() * 40) + 30,
      uniqueKeywords: Math.floor(Math.random() * 80) + 50,
    },
  ]

  // Generate keyword gaps
  const keywordGaps = [
    `best ${rootDomain} alternatives`,
    `${rootDomain} vs competitors`,
    `affordable ${rootDomain} solutions`,
    `${rootDomain} for beginners`,
    `professional ${rootDomain} services`,
    `${rootDomain} near me`,
    `${rootDomain} reviews`,
    `${rootDomain} pricing comparison`,
  ].slice(0, Math.floor(Math.random() * 5) + 3) // 3-7 keyword gaps

  // Generate content gaps
  const contentGaps = [
    `Comprehensive ${rootDomain} guide`,
    `${rootDomain} case studies`,
    `${rootDomain} tutorials`,
    `${rootDomain} industry trends`,
    `${rootDomain} best practices`,
    `${rootDomain} FAQ section`,
    `${rootDomain} comparison tables`,
  ].slice(0, Math.floor(Math.random() * 4) + 2) // 2-5 content gaps

  // Mock backlinks comparison
  const backlinksStatus = Math.random() > 0.5 ? "good" : "warning"
  const backlinksValue =
    backlinksStatus === "good"
      ? "Your backlink profile is stronger than competitors"
      : "Competitors have stronger backlink profiles"

  const backlinksIssues =
    backlinksStatus === "good"
      ? []
      : [
          "Competitors have more high-quality backlinks",
          "Competitors have more diverse anchor text",
          "Competitors have better link authority distribution",
          "Your backlink growth rate is slower than competitors",
        ]

  const backlinksRecommendations =
    backlinksStatus === "good"
      ? [
          "Continue building high-quality backlinks to maintain your advantage",
          "Diversify your backlink sources for greater authority",
          "Monitor competitors' new backlinks for opportunities",
        ]
      : [
          "Focus on acquiring more high-quality backlinks from authoritative domains",
          "Diversify your anchor text profile with relevant keywords",
          "Create link-worthy content like original research and infographics",
          "Implement a strategic outreach campaign to build relationships with industry sites",
          "Analyze competitors' backlink profiles to identify link opportunities",
        ]

  const issues: string[] = []
  const recommendations: string[] = []

  if (keywordGaps.length > 0) {
    issues.push("Competitors are ranking for keywords that you're not targeting")
    recommendations.push("Target the identified keyword gaps in your content strategy")
    recommendations.push("Create dedicated content for high-value keyword opportunities")
  }

  if (contentGaps.length > 0) {
    issues.push("Competitors have content types or topics that you're missing")
    recommendations.push("Create content to address the identified content gaps")
    recommendations.push("Develop more comprehensive resources than your competitors")
  }

  if (backlinksStatus === "warning") {
    issues.push("Your backlink profile is weaker than competitors")
    recommendations.push("Implement a link building strategy to improve your backlink profile")
    recommendations.push("Focus on quality over quantity in your link building efforts")
  }

  return {
    score: Math.floor(Math.random() * 31) + 70, // Random score between 70-100
    competitors,
    keywordGaps,
    contentGaps,
    backlinksComparison: {
      status: backlinksStatus as "good" | "warning" | "error",
      value: backlinksValue,
      issues: backlinksIssues,
      recommendations: backlinksRecommendations,
    },
    issues,
    recommendations,
  }
}

function mockLocalSEOCheck(domain: string, $: cheerio.CheerioAPI) {
  // Check if the page has local business indicators
  const hasAddress = $("address").length > 0 || $('*:contains("street")').length > 0
  const hasPhone = $('a[href^="tel:"]').length > 0 || $('*:contains("phone")').length > 0
  const hasMap = $('iframe[src*="map"]').length > 0 || $('*:contains("directions")').length > 0
  const hasLocalKeywords = $('*:contains("near me")').length > 0 || $('*:contains("local")').length > 0

  // For demo purposes, always show local SEO section
  const isLocalBusiness = true // hasAddress || hasPhone || hasMap || hasLocalKeywords

  if (!isLocalBusiness) {
    return undefined // Not a local business, don't include local SEO section
  }

  // Mock Google Business Profile check
  const hasGBP = domain.includes("local") || domain.includes("shop") || Math.random() > 0.3
  const gbpStatus = hasGBP ? "good" : "error"
  const gbpValue = hasGBP ? "Google Business Profile found" : "No Google Business Profile detected"
  const gbpIssues = hasGBP
    ? ["Profile information could be more complete", "Missing business hours or services"]
    : ["No Google Business Profile found for this business", "Missing critical local presence"]
  const gbpRecommendations = hasGBP
    ? [
        "Ensure your Google Business Profile is fully optimized with all business details",
        "Add high-quality photos to your profile",
        "Keep business hours and special hours up to date",
        "Add complete service or product information",
        "Respond to all customer reviews promptly",
      ]
    : [
        "Create and verify a Google Business Profile for your business",
        "Include complete NAP (Name, Address, Phone) information",
        "Add business categories, attributes, and services",
        "Upload high-quality photos of your business",
        "Create a review generation strategy",
      ]

  // Mock local citations check
  const citationsConsistency = domain.includes("established") || Math.random() > 0.4 ? "good" : "warning"
  const citationsValue =
    citationsConsistency === "good"
      ? "Citations are consistent across directories"
      : "Some citation inconsistencies found"
  const citationsIssues =
    citationsConsistency === "good"
      ? []
      : [
          "Business information is inconsistent across local directories",
          "Missing citations on important platforms",
          "Outdated information on some directories",
          "Duplicate listings detected",
        ]
  const citationsRecommendations =
    citationsConsistency === "good"
      ? [
          "Continue monitoring your citations for consistency",
          "Add citations to additional relevant directories",
          "Regularly audit citations to ensure information remains current",
        ]
      : [
          "Ensure your NAP (Name, Address, Phone) is consistent across all directories",
          "Claim and verify listings on major platforms (Yelp, Yellow Pages, etc.)",
          "Remove duplicate listings to prevent confusion",
          "Update outdated information across all platforms",
          "Consider using a citation management service",
        ]

  // Mock local keywords check
  const localKeywordsStatus = domain.includes("local") || Math.random() > 0.5 ? "good" : "warning"
  const localKeywordsValue =
    localKeywordsStatus === "good" ? "Good use of local keywords" : "Local keyword optimization could be improved"
  const localKeywordsIssues =
    localKeywordsStatus === "good"
      ? []
      : [
          "Content lacks sufficient local keyword optimization",
          "Missing location-specific landing pages",
          "Title tags and meta descriptions don't include location terms",
          "Minimal use of local landmarks or neighborhoods",
        ]
  const localKeywordsRecommendations =
    localKeywordsStatus === "good"
      ? [
          "Continue targeting local keywords in your content",
          "Create content about local events or news to strengthen local relevance",
          "Expand content to target nearby locations",
        ]
      : [
          "Add more location-specific keywords to your content",
          "Include nearby locations in your content",
          "Create location-specific landing pages for each service area",
          "Optimize title tags and meta descriptions with location terms",
          "Mention local landmarks, neighborhoods, and community features",
        ]

  // Mock reviews check
  const reviewsStatus = domain.includes("top") || Math.random() > 0.4 ? "good" : "warning"
  const reviewsValue = reviewsStatus === "good" ? "Good review profile" : "Review profile could be improved"
  const reviewsIssues =
    reviewsStatus === "good"
      ? ["Some negative reviews without responses"]
      : [
          "Low number of reviews compared to competitors",
          "Some negative reviews without responses",
          "Low overall rating (below 4.0)",
          "Reviews are not recent or consistent",
        ]
  const reviewsRecommendations =
    reviewsStatus === "good"
      ? [
          "Continue encouraging satisfied customers to leave reviews",
          "Respond to all reviews, especially negative ones",
          "Showcase positive reviews on your website",
          "Implement a review monitoring system",
        ]
      : [
          "Implement a review generation strategy",
          "Respond promptly to all reviews, especially negative ones",
          "Address issues mentioned in negative reviews",
          "Create a process for requesting reviews after positive customer interactions",
          "Monitor review sites regularly and set up alerts for new reviews",
        ]

  return {
    score: Math.floor(Math.random() * 31) + 70, // Random score between 70-100
    googleBusinessProfile: {
      status: gbpStatus as "good" | "warning" | "error",
      value: gbpValue,
      issues: gbpIssues,
      recommendations: gbpRecommendations,
    },
    localCitations: {
      status: citationsConsistency as "good" | "warning" | "error",
      value: citationsValue,
      issues: citationsIssues,
      recommendations: citationsRecommendations,
    },
    localKeywords: {
      status: localKeywordsStatus as "good" | "warning" | "error",
      value: localKeywordsValue,
      issues: localKeywordsIssues,
      recommendations: localKeywordsRecommendations,
    },
    reviews: {
      status: reviewsStatus as "good" | "warning" | "error",
      value: reviewsValue,
      issues: reviewsIssues,
      recommendations: reviewsRecommendations,
    },
  }
}

function calculateCategoryScore(statuses: Array<"good" | "warning" | "error">): number {
  const weights = {
    good: 100,
    warning: 60,
    error: 20,
  }

  const total = statuses.reduce((sum, status) => sum + weights[status], 0)
  return Math.round(total / statuses.length)
}
