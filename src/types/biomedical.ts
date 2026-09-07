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
  | 'phenotype'
  | 'anatomy'
  | 'function'
  | 'variant'

export interface SearchResult {
  id: string
  type: BiomedicalEntityType
  title: string
  subtitle: string
  description: string
}

export type RelationshipType =
  | 'associated-with'
  | 'participates-in'
  | 'involves'
  | 'treats'
  | 'targets'
  | 'has-phenotype'
  | 'expressed-in'
  | 'causes'
  | 'related-to'

export interface GraphNode {
  id: string
  type: BiomedicalEntityType
  label: string
  description?: string
  metadata?: Record<string, unknown>
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  relationship: RelationshipType
  evidence?: EvidenceStrength
}

export interface KnowledgeGraph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface EntityNeighborhood {
  center: GraphNode
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export type DataProviderType = 'biolink' | 'mock'

export interface BiomedicalDataProvider {
  searchEntities(
    query: string,
    entityTypes?: BiomedicalEntityType[],
    limit?: number,
  ): Promise<SearchResult[]>

  getEntityNeighborhood(
    entityId: string,
    depth?: number,
  ): Promise<EntityNeighborhood>

  getEntity(entityId: string): Promise<GraphNode | null>
}

export interface GraphDataState {
  data: KnowledgeGraph | null
  loading: boolean
  error: string | null
  empty: boolean
}
