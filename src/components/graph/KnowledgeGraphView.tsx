import { useCallback, useMemo, useState } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type EdgeTypes,
  type NodeTypes,
  type Node,
} from '@xyflow/react'
import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react'
import '@xyflow/react/dist/style.css'

import { getFullGraph } from '../../api/graphApi'
import type {
  BiomedicalEntityType,
  GraphEdge,
  GraphNode,
} from '../../types/biomedical'
import { toFlowEdges, toFlowNodes } from './graphAdapter'
import BiomedicalNode from './BiomedicalNode'
import { BiomedicalEdge } from './BiomedicalEdge'
import { GraphDetailPanel } from './GraphDetailPanel'
import { GraphLegend } from './GraphLegend'
import './graph.css'

const nodeTypes: NodeTypes = { biomedicalNode: BiomedicalNode }
const edgeTypes: EdgeTypes = { smoothstep: BiomedicalEdge }

interface KnowledgeGraphViewProps {
  graph?: ReturnType<typeof getFullGraph>
}

export function KnowledgeGraphView({ graph }: KnowledgeGraphViewProps) {
  return (
    <ReactFlowProvider>
      <KnowledgeGraphInner graph={graph} />
    </ReactFlowProvider>
  )
}

function KnowledgeGraphInner({ graph }: KnowledgeGraphViewProps) {
  const data = useMemo(() => graph ?? getFullGraph(), [graph])

  const initialNodes = useMemo(() => toFlowNodes(data), [data])
  const initialEdges = useMemo(() => toFlowEdges(data), [data])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [visibleTypes, setVisibleTypes] = useState<Set<BiomedicalEntityType>>(
    new Set(['disease', 'gene', 'pathway', 'drug']),
  )

  const reactFlow = useReactFlow()

  const filteredNodes = useMemo(
    () => nodes.filter((n) => visibleTypes.has(n.data.entityType)),
    [nodes, visibleTypes],
  )

  const visibleNodeIds = useMemo(
    () => new Set(filteredNodes.map((n) => n.id)),
    [filteredNodes],
  )

  const filteredEdges = useMemo(
    () =>
      edges.filter(
        (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target),
      ),
    [edges, visibleNodeIds],
  )

  const connectionEdges = useMemo(() => {
    if (!selectedNode) return [] as { relationship: string; connectedLabel: string }[]
    return data.edges
      .filter(
        (e: GraphEdge) => e.source === selectedNode.id || e.target === selectedNode.id,
      )
      .map((e: GraphEdge) => {
        const connectedId = e.source === selectedNode.id ? e.target : e.source
        const connected = data.nodes.find((n: GraphNode) => n.id === connectedId)
        return {
          relationship: e.relationship.replace(/-/g, ' '),
          connectedLabel: connected?.label ?? connectedId,
        }
      })
  }, [selectedNode, data])

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const original = data.nodes.find((n) => n.id === node.id)
      if (original) setSelectedNode(original)
    },
    [data.nodes],
  )

  const handleToggleType = useCallback((type: BiomedicalEntityType) => {
    setVisibleTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }, [])

  const handleFitView = useCallback(() => {
    reactFlow.fitView({ padding: 0.25, duration: 400 })
  }, [reactFlow])

  const handleZoomIn = useCallback(() => {
    reactFlow.zoomIn({ duration: 200 })
  }, [reactFlow])

  const handleZoomOut = useCallback(() => {
    reactFlow.zoomOut({ duration: 200 })
  }, [reactFlow])

  const handleClearSelection = useCallback(() => {
    setSelectedNode(null)
    setNodes((nds) =>
      nds.map((n) => ({ ...n, selected: false })),
    )
  }, [setNodes])

  return (
    <div className="kg-view">
      <ReactFlow
        nodes={filteredNodes}
        edges={filteredEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handleClearSelection}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.25}
        maxZoom={3}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={26}
          size={1.4}
          color="#c8cabf"
        />
      </ReactFlow>

      <div className="kg-toolbar">
        <GraphLegend visibleTypes={visibleTypes} onToggleType={handleToggleType} />
        <div className="kg-toolbar-controls" role="group" aria-label="Graph controls">
          <button type="button" onClick={handleZoomIn} aria-label="Zoom in">
            <ZoomIn size={17} />
          </button>
          <button type="button" onClick={handleZoomOut} aria-label="Zoom out">
            <ZoomOut size={17} />
          </button>
          <button type="button" onClick={handleFitView} aria-label="Fit to screen">
            <Maximize2 size={17} />
          </button>
          <span className="kg-toolbar-label">
            Drag nodes · Pan · Scroll to zoom
          </span>
        </div>
      </div>

      <GraphDetailPanel
        node={selectedNode}
        edges={connectionEdges}
        onClose={handleClearSelection}
      />
    </div>
  )
}
