import type { Edge, Node } from '@xyflow/react'
import type {
  GraphEdge,
  GraphNode,
  KnowledgeGraph,
} from '../../types/biomedical'

export type BiomedicalNodeData = {
  entityType: GraphNode['type']
  label: string
  description?: string
  metadata?: Record<string, unknown>
  [key: string]: unknown
}

export type BiomedicalEdgeData = {
  relationship: GraphEdge['relationship']
  evidence?: GraphEdge['evidence']
  [key: string]: unknown
}

const NODE_BASE_POSITION = { x: 0, y: 0 }

export function toFlowNodes(graph: KnowledgeGraph): Node<BiomedicalNodeData>[] {
  return graph.nodes.map((node) => ({
    id: node.id,
    type: 'biomedicalNode',
    position: NODE_BASE_POSITION,
    data: {
      entityType: node.type,
      label: node.label,
      description: node.description,
      metadata: node.metadata,
    },
  }))
}

export function toFlowEdges(graph: KnowledgeGraph): Edge<BiomedicalEdgeData>[] {
  return graph.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: 'smoothstep',
    animated: false,
    data: {
      relationship: edge.relationship,
      evidence: edge.evidence,
    },
  }))
}
