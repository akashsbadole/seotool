import { NextResponse } from "next/server"
import axios from "axios"
import * as cheerio from "cheerio"

export const maxDuration = 60 // Set max duration to 60 seconds

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Fetch the HTML content with error handling
    let response;
    try {
      response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        maxRedirects: 5,
        timeout: 30000,
      });
    } catch (error) {
      console.error("Error fetching URL:", error);
      return NextResponse.json({ 
        error: "Failed to fetch the website. Please check if the URL is accessible." 
      }, { status: 500 });
    }

    const html = response.data
    const $ = cheerio.load(html)

    // Check if the site is using HTTPS
    const isHttps = url.startsWith("https://")

    // Extract meta title
    const metaTitle = $("title").text()
    const metaTitleIssues = []
    if (!metaTitle) {
      metaTitleIssues.push("Missing meta title")
    } else if (metaTitle.length > 60) {
      metaTitleIssues.push("Meta title is too long (over 60 characters)")
    } else if (metaTitle.length < 30) {
      metaTitleIssues.push("Meta title is too short (under 30 characters)")
    }

    // Extract meta description
    const metaDescription = $('meta[name="description"]').attr("content") || ""
    const metaDescriptionIssues = []
    if (!metaDescription) {
      metaDescriptionIssues.push("Missing meta description")
    } else if (metaDescription.length > 160) {
      metaDescriptionIssues.push("Meta description is too long (over 160 characters)")
    } else if (metaDescription.length < 70) {
      metaDescriptionIssues.push("Meta description is too short (under 70 characters)")
    }

    // Check heading tags
    const h1Count = $("h1").length
    const h1Issues = []
    if (h1Count === 0) {
      h1Issues.push("No H1 tag found")
    } else if (h1Count > 1) {
      h1Issues.push(`Multiple H1 tags found (${h1Count})`)
    }

    // Check images without alt text
    const images = $("img")
    const imagesWithoutAlt = []
    let imagesWithoutAltCount = 0

    images.each((i, img) => {
      const alt = $(img).attr("alt")
      if (!alt && $(img).attr("src")) {
        imagesWithoutAltCount++
        if (imagesWithoutAltCount <= 5) {
          imagesWithoutAlt.push($(img).attr("src") || `Image #${i + 1}`)
        }
      }
    })

    const imageIssues = []
    if (imagesWithoutAltCount > 0) {
      imageIssues.push(`${imagesWithoutAltCount} images missing alt text`)
      if (imagesWithoutAltCount > 5) {
        imageIssues.push("Only showing first 5 images without alt text")
      }
    }

    // Check canonical tag
    const canonicalUrl = $('link[rel="canonical"]').attr("href") || ""
    const canonicalIssues = []
    if (!canonicalUrl) {
      canonicalIssues.push("Missing canonical tag")
    } else if (canonicalUrl !== url && !url.endsWith("/") && !canonicalUrl.endsWith("/")) {
      canonicalIssues.push("Canonical URL doesn't match the current URL")
    }

    // Check robots meta tag
    const robotsMeta = $('meta[name="robots"]').attr("content") || ""
    const robotsIssues = []
    if (robotsMeta.includes("noindex")) {
      robotsIssues.push("Page is set to noindex")
    }
    if (robotsMeta.includes("nofollow")) {
      robotsIssues.push("Page is set to nofollow")
    }

    // Check URL structure
    const urlIssues = []
    if (url.includes("?")) {
      urlIssues.push("URL contains query parameters")
    }
    if (url.includes("_")) {
      urlIssues.push("URL contains underscores instead of hyphens")
    }
    if (/[A-Z]/.test(url)) {
      urlIssues.push("URL contains uppercase letters")
    }

    // Check internal links
    const links = $("a")
    let internalLinksCount = 0
    let externalLinksCount = 0
    const urlObj = new URL(url)
    const domain = urlObj.hostname

    links.each((i, link) => {
      const href = $(link).attr("href")
      if (href) {
        if (href.startsWith("/") || href.includes(domain)) {
          internalLinksCount++
        } else if (href.startsWith("http")) {
          externalLinksCount++
        }
      }
    })

    // Check content length
    const bodyText = $("body").text().trim().replace(/\s+/g, " ")
    const wordCount = bodyText.split(" ").length
    const contentIssues = []
    if (wordCount < 300) {
      contentIssues.push("Content is too short (under 300 words)")
    }

    // Check for sitemap
    let sitemapExists = false
    try {
      const sitemapUrl = `${urlObj.protocol}//${domain}/sitemap.xml`
      const sitemapResponse = await axios.head(sitemapUrl, { timeout: 5000 })
      sitemapExists = sitemapResponse.status === 200
    } catch (error) {
      // Sitemap doesn't exist or couldn't be accessed
    }

    // Check for robots.txt
    let robotsTxtExists = false
    try {
      const robotsUrl = `${urlObj.protocol}//${domain}/robots.txt`
      const robotsResponse = await axios.head(robotsUrl, { timeout: 5000 })
      robotsTxtExists = robotsResponse.status === 200
    } catch (error) {
      // robots.txt doesn't exist or couldn't be accessed
    }

    // Compile the report
    const report = {
      url,
      timestamp: new Date().toISOString(),
      onPageSEO: {
        metaTitle: {
          name: "Meta Title",
          value: metaTitle,
          issues: metaTitleIssues,
          recommendations: metaTitleIssues.length > 0 ? ["Create a descriptive title between 30-60 characters"] : [],
          grade: metaTitleIssues.length === 0 ? "A" : metaTitleIssues.length === 1 ? "C" : "F",
        },
        metaDescription: {
          name: "Meta Description",
          value: metaDescription,
          issues: metaDescriptionIssues,
          recommendations:
            metaDescriptionIssues.length > 0 ? ["Create a compelling description between 70-160 characters"] : [],
          grade: metaDescriptionIssues.length === 0 ? "A" : metaDescriptionIssues.length === 1 ? "C" : "F",
        },
        headings: {
          name: "Heading Tags",
          value: `H1: ${h1Count}`,
          issues: h1Issues,
          recommendations: h1Issues.length > 0 ? ["Use exactly one H1 tag that includes your primary keyword"] : [],
          grade: h1Issues.length === 0 ? "A" : "F",
        },
        images: {
          name: "Image Alt Text",
          value: `${images.length} images, ${imagesWithoutAltCount} missing alt text`,
          issues: imageIssues,
          recommendations: imagesWithoutAltCount > 0 ? ["Add descriptive alt text to all images"] : [],
          grade: imagesWithoutAltCount === 0 ? "A" : imagesWithoutAltCount < images.length / 3 ? "C" : "F",
        },
        canonicalTag: {
          name: "Canonical Tag",
          value: canonicalUrl,
          issues: canonicalIssues,
          recommendations: canonicalIssues.length > 0 ? ["Add a canonical tag pointing to the current URL"] : [],
          grade: canonicalIssues.length === 0 ? "A" : "F",
        },
        urlStructure: {
          name: "URL Structure",
          value: url,
          issues: urlIssues,
          recommendations:
            urlIssues.length > 0
              ? ["Use lowercase letters, hyphens instead of underscores, and avoid query parameters in URLs"]
              : [],
          grade: urlIssues.length === 0 ? "A" : urlIssues.length === 1 ? "C" : "F",
        },
        internalLinks: {
          name: "Internal Links",
          value: internalLinksCount,
          issues: internalLinksCount < 5 ? ["Few internal links found"] : [],
          recommendations:
            internalLinksCount < 5 ? ["Add more internal links to improve site structure and user navigation"] : [],
          grade: internalLinksCount >= 10 ? "A" : internalLinksCount >= 5 ? "B" : "D",
        },
      },
      technicalSEO: {
        ssl: {
          name: "SSL Certificate",
          value: isHttps ? "Enabled" : "Disabled",
          issues: !isHttps ? ["Site is not using HTTPS"] : [],
          recommendations: !isHttps ? ["Enable HTTPS to secure your website and improve rankings"] : [],
          grade: isHttps ? "A" : "F",
        },
        robots: {
          name: "Robots.txt",
          value: robotsTxtExists ? "Found" : "Not found",
          issues: !robotsTxtExists ? ["No robots.txt file found"] : [],
          recommendations: !robotsTxtExists ? ["Create a robots.txt file to guide search engine crawlers"] : [],
          grade: robotsTxtExists ? "A" : "C",
        },
        sitemap: {
          name: "Sitemap.xml",
          value: sitemapExists ? "Found" : "Not found",
          issues: !sitemapExists ? ["No sitemap.xml file found"] : [],
          recommendations: !sitemapExists
            ? ["Create a sitemap.xml file to help search engines discover your content"]
            : [],
          grade: sitemapExists ? "A" : "C",
        },
        mobileResponsive: {
          name: "Mobile Responsiveness",
          value: "Not tested", // Would require browser rendering
          issues: ["Mobile responsiveness test requires browser rendering"],
          recommendations: ["Ensure your website is responsive and works well on mobile devices"],
          grade: "C", // Default grade since we can't test
        },
        pageSpeed: {
          name: "Page Speed",
          value: "Not tested", // Would require PageSpeed Insights API
          issues: ["Page speed test requires Google PageSpeed Insights API"],
          recommendations: ["Optimize images, minify CSS/JS, and use browser caching to improve speed"],
          grade: "C", // Default grade since we can't test
        },
      },
      contentSEO: {
        contentLength: {
          name: "Content Length",
          value: `${wordCount} words`,
          issues: contentIssues,
          recommendations:
            wordCount < 300 ? ["Add more comprehensive content, aim for at least 600 words for important pages"] : [],
          grade: wordCount >= 600 ? "A" : wordCount >= 300 ? "C" : "F",
        },
        keywordDensity: {
          name: "Keyword Density",
          value: "Not analyzed", // Would require keyword input
          issues: ["Keyword density analysis requires primary keyword input"],
          recommendations: ["Ensure your primary keyword appears in title, headings, and naturally throughout content"],
          grade: "C", // Default grade since we can't test
        },
        readability: {
          name: "Readability",
          value: "Not analyzed", // Would require more complex analysis
          issues: ["Readability analysis requires more complex text processing"],
          recommendations: ["Use short paragraphs, subheadings, and simple language to improve readability"],
          grade: "C", // Default grade since we can't test
        },
      },
      performance: {
        coreWebVitals: {
          name: "Core Web Vitals",
          value: "Not tested", // Would require Lighthouse or PageSpeed Insights
          issues: ["Core Web Vitals test requires Google PageSpeed Insights API"],
          recommendations: ["Optimize LCP, FID, and CLS metrics to improve user experience"],
          grade: "C", // Default grade since we can't test
        },
      },
      indexability: {
        robotsMeta: {
          name: "Robots Meta Tags",
          value: robotsMeta || "Not specified",
          issues: robotsIssues,
          recommendations:
            robotsIssues.length > 0 ? ["Remove noindex/nofollow directives if you want the page to be indexed"] : [],
          grade: robotsIssues.length === 0 ? "A" : "F",
        },
        indexStatus: {
          name: "Index Status",
          value: "Not checked", // Would require Google Search Console API
          issues: ["Index status check requires Google Search Console API access"],
          recommendations: ["Check Google Search Console to verify if the page is indexed"],
          grade: "C", // Default grade since we can't test
        },
      },
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error performing SEO audit:", error)
    return NextResponse.json({ error: "Failed to analyze the website. Please try again." }, { status: 500 })
  }
}
