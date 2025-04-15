export interface AuditItem {
  name?: string
  value?: string | number | boolean
  issues: string[]
  recommendations?: string[]
  grade: string
}

export interface AuditCategory {
  [key: string]: AuditItem
}

export interface AuditReport {
  url: string
  timestamp: string
  onPageSEO: AuditCategory
  technicalSEO: AuditCategory
  contentSEO: AuditCategory
  performance: AuditCategory
  indexability: AuditCategory
}
