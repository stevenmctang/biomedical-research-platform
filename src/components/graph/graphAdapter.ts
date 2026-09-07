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

type EntityGroup = 'disease' | 'gene' | 'pathway' | 'drug'

const GROUP_ORDER: EntityGroup[] = ['disease', 'gene', 'pathway', 'drug']

function computeNodePositions(graph: KnowledgeGraph): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>()
  const byGroup: Record<EntityGroup, GraphNode[]> = {
    disease: [],
    gene: [],
    pathway: [],
    drug: [],
  }

  graph.nodes.forEach((node) => {
    byGroup[node.type as EntityGroup]?.push(node)
  })

  const groupCount = GROUP_ORDER.length
  const baseRadius = 340

  GROUP_ORDER.forEach((group, groupIndex) => {
    const nodesInGroup = byGroup[group]
    const groupAngle = (groupIndex / groupCount) * Math.PI * 2 - Math.PI / 2
    const groupCenterX = Math.cos(groupAngle) * baseRadius
    const groupCenterY = Math.sin(groupAngle) * baseRadius

    nodesInGroup.forEach((node, nodeIndex) => {
      if (nodesInGroup.length === 1) {
        positions.set(node.id, { x: groupCenterX, y: groupCenterY })
        return
      }

      const subRadius = 150
      const subAngle =
        (nodeIndex / nodesInGroup.length) * Math.PI * 2 + groupAngle
      positions.set(node.id, {
        x: groupCenterX + Math.cos(subAngle) * subRadius,
        y: groupCenterY + Math.sin(subAngle) * subRadius,
      })
    })
  })

  return positions
}

export function toFlowNodes(graph: KnowledgeGraph): Node<BiomedicalNodeData>[] {
  const positions = computeNodePositions(graph)

  return graph.nodes.map((node) => ({
    id: node.id,
    type: 'biomedicalNode',
    position: positions.get(node.id) ?? { x: 0, y: 0 },
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
