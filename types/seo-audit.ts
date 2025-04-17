export interface SEOAuditResult {
  overallScore: number
  onPageSEO: {
    score: number
    metaTitle: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    metaDescription: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    headings: {
      status: "good" | "warning" | "error"
      h1Count: number
      h2Count: number
      h3Count: number
      issues: string[]
      recommendations: string[]
    }
    imageAlt: {
      status: "good" | "warning" | "error"
      total: number
      withAlt: number
      issues: string[]
      recommendations: string[]
    }
    urlStructure: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    internalLinks: {
      status: "good" | "warning" | "error"
      count: number
      issues: string[]
      recommendations: string[]
    }
  }
  technicalSEO: {
    score: number
    pageSpeed: {
      status: "good" | "warning" | "error"
      score: number
      issues: string[]
      recommendations: string[]
    }
    mobileFriendliness: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    ssl: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    robotsTxt: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    sitemap: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    structuredData: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    // New technical SEO checks
    httpStatus: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    brokenLinks: {
      status: "good" | "warning" | "error"
      total: number
      broken: number
      brokenList: Array<{ url: string; statusCode: number }>
      issues: string[]
      recommendations: string[]
    }
    canonicalTags: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    hreflang: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    coreWebVitals: {
      status: "good" | "warning" | "error"
      lcp: {
        value: string
        status: "good" | "warning" | "error"
      }
      fid: {
        value: string
        status: "good" | "warning" | "error"
      }
      cls: {
        value: string
        status: "good" | "warning" | "error"
      }
      issues: string[]
      recommendations: string[]
    }
    duplicateContent: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
  }
  contentSEO: {
    score: number
    contentLength: {
      status: "good" | "warning" | "error"
      wordCount: number
      issues: string[]
      recommendations: string[]
    }
    keywordOptimization: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    readability: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    // New content SEO checks
    contentQuality: {
      status: "good" | "warning" | "error"
      score: number
      issues: string[]
      recommendations: string[]
    }
    keywordDensity: {
      status: "good" | "warning" | "error"
      keywords: Array<{ keyword: string; count: number; density: string }>
      issues: string[]
      recommendations: string[]
    }
    thinContent: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    contentFreshness: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    eatSignals: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
  }
  performance: {
    score: number
    lcp: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    fid: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    cls: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
  }
  // New categories
  advancedSEO: {
    score: number
    internalLinkingStrength: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    pageDepth: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    orphanedPages: {
      status: "good" | "warning" | "error"
      count: number
      issues: string[]
      recommendations: string[]
    }
    entityIdentification: {
      status: "good" | "warning" | "error"
      entities: string[]
      issues: string[]
      recommendations: string[]
    }
    serpFeatures: {
      status: "good" | "warning" | "error"
      opportunities: string[]
      issues: string[]
      recommendations: string[]
    }
    javascriptSEO: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
  }
  competitiveAnalysis: {
    score: number
    competitors: Array<{
      domain: string
      shareOfVoice: string
      commonKeywords: number
      uniqueKeywords: number
    }>
    keywordGaps: string[]
    contentGaps: string[]
    backlinksComparison: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    issues: string[]
    recommendations: string[]
  }
  localSEO?: {
    score: number
    googleBusinessProfile: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    localCitations: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    localKeywords: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
    reviews: {
      status: "good" | "warning" | "error"
      value: string
      issues: string[]
      recommendations: string[]
    }
  }
}

export interface PDFExportOptions {
  includeWatermark: boolean
  watermarkText?: string
  includeSections: {
    onPageSEO: boolean
    technicalSEO: boolean
    contentSEO: boolean
    performance: boolean
    advancedSEO: boolean
    competitiveAnalysis: boolean
    localSEO: boolean
  }
  companyLogo?: string
  companyName?: string
  includeRecommendations: boolean
}
