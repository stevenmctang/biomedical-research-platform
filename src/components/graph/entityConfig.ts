import type { BiomedicalEntityType } from '../../types/biomedical'

export interface EntityVisualConfig {
  color: string
  softColor: string
  icon: string
  label: string
  shape: 'rect' | 'pill'
}

export const entityVisuals: Record<BiomedicalEntityType, EntityVisualConfig> = {
  disease: {
    color: '#3157d5',
    softColor: '#e6ebff',
    icon: 'disease',
    label: 'Disease',
    shape: 'rect',
  },
  gene: {
    color: '#2d8659',
    softColor: '#e0f3e8',
    icon: 'gene',
    label: 'Gene',
    shape: 'pill',
  },
  pathway: {
    color: '#b06a1f',
    softColor: '#f7ecd9',
    icon: 'pathway',
    label: 'Pathway',
    shape: 'pill',
  },
  drug: {
    color: '#9333b0',
    softColor: '#f0e0f7',
    icon: 'drug',
    label: 'Drug',
    shape: 'rect',
  },
}

export const relationshipLabels: Record<string, string> = {
  'associated-with': 'associated with',
  'participates-in': 'participates in',
  involves: 'involves',
  treats: 'treats',
  targets: 'targets',
}
