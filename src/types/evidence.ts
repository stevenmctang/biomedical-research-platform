export type EvidenceCategory =
  | 'Genetics'
  | 'Literature'
  | 'Pathway'
  | 'Clinical'
  | 'Database'

export type EvidenceLevel =
  | 'Strong'
  | 'Moderate'
  | 'Limited'

export type EvidenceEntityType =
  | 'gene'
  | 'drug'
  | 'pathway'

export type EvidenceSourceType =
  | 'PubMed'
  | 'NCBI Gene'
  | 'Clinical Study'
  | 'Database'

export interface EvidenceSource {
  id: string

  sourceType: EvidenceSourceType

  title: string

  authors?: string

  publication?: string

  year?: number

  externalId?: string

  doi?: string

  description: string
}

export interface EvidenceRecord {
  id: string

  diseaseId: string

  entityType: EvidenceEntityType
  entityId: string

  title: string

  summary: string

  strength: EvidenceLevel

  categories: EvidenceCategory[]

  sources: EvidenceSource[]

  developmentOnly: boolean
}
