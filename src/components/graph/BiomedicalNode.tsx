import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Dna, FlaskConical, Network, Stethoscope } from 'lucide-react'
import type { BiomedicalNodeData } from './graphAdapter'
import { entityVisuals } from './entityConfig'

function getEntityIcon(icon: string) {
  if (icon === 'disease') return <Stethoscope size={16} />
  if (icon === 'gene') return <Dna size={16} />
  if (icon === 'pathway') return <Network size={16} />
  if (icon === 'drug') return <FlaskConical size={16} />
  return null
}

function BiomedicalNode({ data, selected }: NodeProps) {
  const nodeData = data as BiomedicalNodeData
  const visual = entityVisuals[nodeData.entityType]

  const className = [
    'kg-node',
    `kg-node--${nodeData.entityType}`,
    `kg-node--${visual.shape}`,
    selected ? 'kg-node--selected' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={className}
      style={{
        borderColor: visual.color,
        background: visual.softColor,
      }}
    >
      <Handle type="target" position={Position.Top} className="kg-handle" />

      <div className="kg-node-inner">
        <span
          className="kg-node-icon"
          style={{ color: visual.color, background: 'white' }}
        >
          {getEntityIcon(visual.icon)}
        </span>

        <span className="kg-node-type">{visual.label}</span>
        <span className="kg-node-label">{nodeData.label}</span>
      </div>

      <Handle type="source" position={Position.Bottom} className="kg-handle" />
    </div>
  )
}

export default memo(BiomedicalNode)
