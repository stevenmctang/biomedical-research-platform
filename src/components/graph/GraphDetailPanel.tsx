import { ArrowRight, X } from 'lucide-react'
import type { GraphNode } from '../../types/biomedical'
import { entityVisuals } from './entityConfig'

interface GraphDetailPanelProps {
  node: GraphNode | null
  edges: { relationship: string; connectedLabel: string }[]
  onClose: () => void
}

export function GraphDetailPanel({
  node,
  edges,
  onClose,
}: GraphDetailPanelProps) {
  if (!node) return null

  const visual = entityVisuals[node.type]

  return (
    <aside className="kg-detail-panel" aria-live="polite">
      <div className="kg-detail-header">
        <span
          className="kg-detail-type-badge"
          style={{ background: visual.softColor, color: visual.color }}
        >
          {visual.label}
        </span>

        <button
          type="button"
          className="kg-detail-close"
          onClick={onClose}
          aria-label="Close details"
        >
          <X size={16} />
        </button>
      </div>

      <h3 className="kg-detail-title">{node.label}</h3>

      {node.description && (
        <p className="kg-detail-description">{node.description}</p>
      )}

      {edges.length > 0 && (
        <div className="kg-detail-connections">
          <p className="kg-detail-connections-heading">Connections</p>

          <ul className="kg-detail-connections-list">
            {edges.map((edge, index) => (
              <li key={index} className="kg-detail-connection-item">
                <ArrowRight size={13} />
                <span>
                  <strong>{edge.relationship}</strong> {edge.connectedLabel}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}
