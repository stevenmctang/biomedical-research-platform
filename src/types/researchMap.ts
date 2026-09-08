export type ResearchDomain =
  | 'Biomedical Science'
  | 'Biology'
  | 'Chemistry'
  | 'Physics'
  | 'Astronomy'
  | 'Materials Science'
  | 'Environmental Science'
  | 'Earth Science'
  | 'Neuroscience'
  | 'Computer Science'
  | 'General Science'


export type ResearchNodeType =
  | 'question'
  | 'concept'
  | 'disease'
  | 'gene'
  | 'drug'
  | 'pathway'
  | 'molecule'
  | 'material'
  | 'process'
  | 'mechanism'
  | 'organism'
  | 'technology'
  | 'theory'
  | 'experiment'
  | 'paper'
  | 'dataset'
  | 'evidence'


export type ResearchEvidenceStrength =
  | 'strong'
  | 'moderate'
  | 'limited'
  | 'unknown'


export type ResearchRelationshipType =
  | 'associated-with'
  | 'causes'
  | 'contributes-to'
  | 'regulates'
  | 'inhibits'
  | 'activates'
  | 'contains'
  | 'participates-in'
  | 'targets'
  | 'supports'
  | 'contradicts'
  | 'explains'
  | 'depends-on'
  | 'produces'
  | 'interacts-with'
  | 'related-to'


export interface ResearchSource {
  id: string

  title: string

  sourceType:
    | 'journal'
    | 'database'
    | 'paper'
    | 'dataset'
    | 'institution'
    | 'other'

  authors?: string[]

  publication?: string

  year?: number

  doi?: string

  externalId?: string

  url?: string

  description?: string
}


export interface ResearchNode {
  id: string

  type: ResearchNodeType

  label: string

  subtitle: string

  description: string

  domain: ResearchDomain

  sourceIds: string[]

  evidenceStrength?:
    ResearchEvidenceStrength

  metadata?: Record<
    string,
    string | number | boolean
  >
}


export interface ResearchEdge {
  id: string

  sourceId: string

  targetId: string

  relationship:
    ResearchRelationshipType

  label: string

  explanation: string

  evidenceStrength:
    ResearchEvidenceStrength

  sourceIds: string[]
}


export interface ResearchMap {
  id: string

  question: string

  domain: ResearchDomain

  title: string

  summary: string

  nodes: ResearchNode[]

  edges: ResearchEdge[]

  sources: ResearchSource[]

  generatedAt: string

  notice: string
}


export interface ResearchMapSelection {
  kind:
    | 'node'
    | 'edge'

  id: string
}
