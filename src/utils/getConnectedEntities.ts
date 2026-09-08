import { knowledgeGraph } from '../data/biomedicalGraphData'
import type {
  BiomedicalEntityType,
  GraphEdge,
  GraphNode,
  RelationshipType,
} from '../types/biomedical'

export interface ConnectedEntity {
  node: GraphNode
  edge: GraphEdge
  direction: 'outgoing' | 'incoming'
  relationshipLabel: string
}

const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  'associated-with': 'associated with',
  'participates-in': 'participates in',
  'involves': 'involves',
  'treats': 'treats',
  'targets': 'targets',
  'has-phenotype': 'has phenotype',
  'expressed-in': 'expressed in',
  'causes': 'causes',
  'related-to': 'related to',
}

const nodeMap = new Map(knowledgeGraph.nodes.map((n) => [n.id, n]))

export function getConnectedEntities(entityId: string): ConnectedEntity[] {
  const connected: ConnectedEntity[] = []

  for (const edge of knowledgeGraph.edges) {
    if (edge.source === entityId) {
      const targetNode = nodeMap.get(edge.target)
      if (targetNode) {
        connected.push({
          node: targetNode,
          edge,
          direction: 'outgoing',
          relationshipLabel: RELATIONSHIP_LABELS[edge.relationship] ?? edge.relationship,
        })
      }
    } else if (edge.target === entityId) {
      const sourceNode = nodeMap.get(edge.source)
      if (sourceNode) {
        connected.push({
          node: sourceNode,
          edge,
          direction: 'incoming',
          relationshipLabel: RELATIONSHIP_LABELS[edge.relationship] ?? edge.relationship,
        })
      }
    }
  }

  return connected
}

export function getEntityTypeLabel(type: BiomedicalEntityType): string {
  const labels: Record<BiomedicalEntityType, string> = {
    disease: 'Disease',
    gene: 'Gene',
    drug: 'Drug',
    pathway: 'Pathway',
    phenotype: 'Phenotype',
    anatomy: 'Anatomy',
    function: 'Function',
    variant: 'Variant',
  }
  return labels[type] ?? type
}
