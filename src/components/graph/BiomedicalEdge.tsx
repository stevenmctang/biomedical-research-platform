import { memo } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react'
import { relationshipLabels } from './entityConfig'
import type { BiomedicalEdgeData } from './graphAdapter'

function BiomedicalEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps) {
  const edgeData = data as BiomedicalEdgeData | undefined
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const evidenceClass = edgeData?.evidence
    ? `kg-edge--${edgeData.evidence}`
    : ''
  const label = edgeData
    ? relationshipLabels[edgeData.relationship] ?? edgeData.relationship
    : ''

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        className={`kg-edge ${evidenceClass} ${selected ? 'kg-edge--selected' : ''}`}
      />

      <EdgeLabelRenderer>
        <div
          className="kg-edge-label"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export const BiomedicalEdge = memo(BiomedicalEdgeComponent)
