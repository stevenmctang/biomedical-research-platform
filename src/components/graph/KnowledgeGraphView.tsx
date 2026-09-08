import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { AlertCircle, Maximize2, ZoomIn, ZoomOut } from 'lucide-react'
import '@xyflow/react/dist/style.css'

import type {
  BiomedicalEntityType,
  GraphEdge,
  GraphNode,
  KnowledgeGraph,
} from '../../types/biomedical'
import { toFlowEdges, toFlowNodes } from './graphAdapter'
import BiomedicalNode from './BiomedicalNode'
import { BiomedicalEdge } from './BiomedicalEdge'
import { GraphDetailPanel } from './GraphDetailPanel'
import { GraphLegend } from './GraphLegend'
import './graph.css'

const nodeTypes: NodeTypes = { biomedicalNode: BiomedicalNode }
const edgeTypes: EdgeTypes = { biomedicalEdge: BiomedicalEdge }

interface KnowledgeGraphViewProps {
  graph: KnowledgeGraph | null
  loading: boolean
  error: string | null
  empty: boolean
  onNodeExpand: (entityId: string) => void
}

export function KnowledgeGraphView({
  graph,
  loading,
  error,
  empty,
  onNodeExpand,
}: KnowledgeGraphViewProps) {
  return (
    <ReactFlowProvider>
      <KnowledgeGraphInner
        graph={graph}
        loading={loading}
        error={error}
        empty={empty}
        onNodeExpand={onNodeExpand}
      />
    </ReactFlowProvider>
  )
}

function KnowledgeGraphInner({
  graph,
  loading,
  error,
  empty,
  onNodeExpand,
}: KnowledgeGraphViewProps) {
  const flowNodes = useMemo(() => (graph ? toFlowNodes(graph) : []), [graph])
  const flowEdges = useMemo(() => (graph ? toFlowEdges(graph) : []), [graph])

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes)
  const [_edges, setEdges, onEdgesChange] = useEdgesState(flowEdges)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [visibleTypes, setVisibleTypes] = useState<Set<BiomedicalEntityType>>(
    new Set(['disease', 'gene', 'pathway', 'drug', 'phenotype', 'anatomy', 'function', 'variant']),
  )
  const reactFlow = useReactFlow()
  const fitTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync React Flow state when graph data changes
  useEffect(() => {
    setNodes(flowNodes)
  }, [flowNodes, setNodes])

  useEffect(() => {
    setEdges(flowEdges)
  }, [flowEdges, setEdges])

  // Fit view when graph changes
  useEffect(() => {
    if (!graph || graph.nodes.length === 0) return
    if (fitTimeout.current) clearTimeout(fitTimeout.current)
    fitTimeout.current = setTimeout(() => {
      reactFlow.fitView({ padding: 0.25, duration: 300 })
    }, 80)
    return () => {
      if (fitTimeout.current) clearTimeout(fitTimeout.current)
    }
  }, [reactFlow, graph])

  const availableTypes = useMemo(() => {
    if (!graph) return []
    const types = new Set<BiomedicalEntityType>()
    graph.nodes.forEach((n) => types.add(n.type))
    return [...types]
  }, [graph])

  const filteredNodes = useMemo(
    () => nodes.filter((n) => visibleTypes.has(n.data.entityType)),
    [nodes, visibleTypes],
  )
  const visibleNodeIds = useMemo(
    () => new Set(filteredNodes.map((n) => n.id)),
    [filteredNodes],
  )
  const filteredEdges = useMemo(() => {
    if (!graph) return []
    return flowEdges.filter(
      (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target),
    )
  }, [flowEdges, visibleNodeIds])

  const connections = useMemo(() => {
    if (!selectedNode || !graph) return []
    return graph.edges
      .filter(
        (e: GraphEdge) =>
          e.source === selectedNode.id || e.target === selectedNode.id,
      )
      .map((e: GraphEdge) => {
        const connectedId =
          e.source === selectedNode.id ? e.target : e.source
        const connected = graph.nodes.find(
          (n: GraphNode) => n.id === connectedId,
        )
        return {
          relationship: e.relationship.replace(/-/g, ' '),
          connectedLabel: connected?.label ?? connectedId,
          connectedType: connected?.type ?? '',
        }
      })
  }, [selectedNode, graph])

  const handleNodeClick = useCallback(
    (_e: React.MouseEvent, node: Node) => {
      if (!graph) return
      const original = graph.nodes.find((n) => n.id === node.id)
      if (original) setSelectedNode(original)
    },
    [graph],
  )

  const handleNodeDoubleClick = useCallback(
    (_e: React.MouseEvent, node: Node) => {
      onNodeExpand(node.id)
    },
    [onNodeExpand],
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
    reactFlow.fitView({ padding: 0.25, duration: 300 })
  }, [reactFlow])

  const handleClearSelection = useCallback(() => {
    setSelectedNode(null)
    setNodes((nds) => nds.map((n) => ({ ...n, selected: false })))
  }, [setNodes])

  if (loading && !graph) {
    return (
      <div className="kg-view">
        <div className="kg-status">
          <div className="kg-spinner" />
          <p className="kg-status-text">Loading biomedical knowledge graph…</p>
        </div>
      </div>
    )
  }

  if (error && !graph) {
    return (
      <div className="kg-view">
        <div className="kg-status kg-status--error">
          <AlertCircle size={20} />
          <p className="kg-status-text">{error}</p>
          <p className="kg-status-hint">
            The Monarch Initiative API may be temporarily unavailable.
          </p>
        </div>
      </div>
    )
  }

  if (empty && !graph) {
    return (
      <div className="kg-view">
        <div className="kg-status">
          <p className="kg-status-text">No results found.</p>
          <p className="kg-status-hint">
            Try searching for a different disease, gene, or drug.
          </p>
        </div>
      </div>
    )
  }

  if (!graph || graph.nodes.length === 0) {
    return (
      <div className="kg-view">
        <div className="kg-status">
          <p className="kg-status-text">Search for a biomedical entity to begin.</p>
        </div>
      </div>
    )
  }

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
        onNodeDoubleClick={handleNodeDoubleClick}
        onPaneClick={handleClearSelection}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.2}
        maxZoom={3}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ type: 'biomedicalEdge' }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.2}
          color="#d1d3ca"
        />
      </ReactFlow>

      {loading && graph && (
        <div className="kg-loading-bar" />
      )}

      <div className="kg-toolbar">
        <GraphLegend
          visibleTypes={visibleTypes}
          onToggleType={handleToggleType}
          availableTypes={availableTypes}
        />
        <div className="kg-controls" role="group" aria-label="Graph controls">
          <button type="button" onClick={() => reactFlow.zoomIn({ duration: 200 })} aria-label="Zoom in">
            <ZoomIn size={15} />
          </button>
          <button type="button" onClick={() => reactFlow.zoomOut({ duration: 200 })} aria-label="Zoom out">
            <ZoomOut size={15} />
          </button>
          <button type="button" onClick={handleFitView} aria-label="Fit to screen">
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      <div className="kg-hint">Click to inspect · Double-click to expand · Drag to rearrange</div>

      <GraphDetailPanel
        node={selectedNode}
        connections={connections}
        onClose={handleClearSelection}
      />
    </div>
  )
}
