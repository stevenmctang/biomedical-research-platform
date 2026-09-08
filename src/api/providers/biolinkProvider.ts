import type {
  AssociationDetail,
  BiomedicalEntityType,
  EntityNeighborhood,
  GraphNode,
  SearchResult,
} from '../../types/biomedical'
import type { BiomedicalDataProvider } from './types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

interface ApiSearchResult {
  results: {
    id: string
    type: string
    title: string
    subtitle: string
    description: string
  }[]
  total: number
}

interface ApiEntity {
  id: string
  type: string
  label: string
  description?: string
  metadata?: Record<string, unknown>
}

interface ApiNeighborhood {
  center: ApiEntity
  nodes: ApiEntity[]
  edges: {
    id: string
    source: string
    target: string
    relationship: string
    evidence?: string
    evidenceCodes?: string[]
    primaryKnowledgeSource?: string
    publications?: string[]
    updateDate?: string
  }[]
}

interface ApiAssociationDetail {
  id: string
  source: string
  sourceLabel: string
  sourceCategory: string
  target: string
  targetLabel: string
  targetCategory: string
  relationship: string
  predicate: string
  associationCategory: string
  evidence?: string
  evidenceCodes: string[]
  primaryKnowledgeSource: string
  providedBy: string[]
  publications: string[]
  updateDate: string
  createdDate: string
  evidenceCount: number
}

function headers(): Record<string, string> {
  return {
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  }
}

function apiUrl(path: string): string {
  return `${SUPABASE_URL}/functions/v1/biolink-proxy${path}`
}

const VALID_ENTITY_TYPES: Set<string> = new Set([
  'disease',
  'gene',
  'drug',
  'pathway',
  'phenotype',
  'anatomy',
  'function',
  'variant',
])

function coerceEntityType(type: string): BiomedicalEntityType {
  return (VALID_ENTITY_TYPES.has(type) ? type : 'function') as BiomedicalEntityType
}

function toGraphNode(entity: ApiEntity): GraphNode {
  return {
    id: entity.id,
    type: coerceEntityType(entity.type),
    label: entity.label,
    description: entity.description,
    metadata: entity.metadata,
  }
}

/**
 * Real biomedical data provider backed by the Monarch Initiative API v3.
 * Requests are proxied through a Supabase Edge Function (biolink-proxy) which
 * handles caching in a Postgres table to avoid redundant API calls.
 *
 * Data source: https://api-v3.monarchinitiative.org/v3/api
 * Documentation: https://monarch-app.monarchinitiative.org/FastAPI/Endpoints
 */
export const biolinkProvider: BiomedicalDataProvider = {
  async searchEntities(
    query: string,
    entityTypes?: BiomedicalEntityType[],
    limit = 20,
  ): Promise<SearchResult[]> {
    const params = new URLSearchParams({ q: query, limit: String(limit) })
    if (entityTypes && entityTypes.length > 0) {
      params.set('categories', entityTypes.join(','))
    }

    const res = await fetch(apiUrl(`/search?${params.toString()}`), {
      headers: headers(),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error ?? `Search failed (${res.status})`)
    }

    const data = (await res.json()) as ApiSearchResult
    return data.results.map((r) => ({
      id: r.id,
      type: coerceEntityType(r.type),
      title: r.title,
      subtitle: r.subtitle,
      description: r.description,
    }))
  },

  async getEntity(entityId: string): Promise<GraphNode | null> {
    const res = await fetch(apiUrl(`/entity/${encodeURIComponent(entityId)}`), {
      headers: headers(),
    })

    if (!res.ok) return null

    const entity = (await res.json()) as ApiEntity
    return toGraphNode(entity)
  },

  async getEntityNeighborhood(
    entityId: string,
    depth = 1,
  ): Promise<EntityNeighborhood> {
    const params = new URLSearchParams({ depth: String(depth) })
    const res = await fetch(
      apiUrl(`/neighborhood/${encodeURIComponent(entityId)}?${params.toString()}`),
      { headers: headers() },
    )

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error ?? `Failed to load neighborhood (${res.status})`)
    }

    const data = (await res.json()) as ApiNeighborhood

    return {
      center: toGraphNode(data.center),
      nodes: data.nodes.map(toGraphNode),
      edges: data.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        relationship: e.relationship as never,
        evidence: e.evidence as never,
        evidenceCodes: e.evidenceCodes,
        primaryKnowledgeSource: e.primaryKnowledgeSource,
        publications: e.publications,
        updateDate: e.updateDate,
      })),
    }
  },

  async getAssociation(associationId: string): Promise<AssociationDetail | null> {
    const res = await fetch(apiUrl(`/association/${encodeURIComponent(associationId)}`), {
      headers: headers(),
    })

    if (!res.ok) return null

    const data = (await res.json()) as ApiAssociationDetail
    return {
      ...data,
      evidence: data.evidence as AssociationDetail['evidence'],
    }
  },
}
