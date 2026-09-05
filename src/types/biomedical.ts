export type EvidenceStrength = 'strong' | 'moderate' | 'limited'

export interface EvidenceSummary {
  genetics?: EvidenceStrength
  literature?: EvidenceStrength
  pathway?: EvidenceStrength
  clinical?: EvidenceStrength
}

export interface Gene {
  id: string
  symbol: string
  name: string
  description: string
  chromosome?: string
  associatedDiseases: string[]
  pathways: string[]
}

export interface Drug {
  id: string
  name: string
  description: string
  targets: string[]
  associatedDiseases: string[]
  developmentStatus: string
}

export interface Pathway {
  id: string
  name: string
  description: string
  genes: string[]
}

export interface Disease {
  id: string
  name: string
  abbreviation?: string
  description: string
  genes: string[]
  pathways: string[]
  drugs: string[]
  evidence: EvidenceSummary
}

export type BiomedicalEntityType =
  | 'disease'
  | 'gene'
  | 'drug'
  | 'pathway'

export interface SearchResult {
  id: string
  type: BiomedicalEntityType
  title: string
  subtitle: string
  description: string
}