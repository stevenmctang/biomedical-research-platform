import type {
  BiomedicalEntityType,
} from './biomedical'


export type HypothesisStatus =
  | 'Candidate'
  | 'Emerging'
  | 'Exploratory'


export type HypothesisSupportLevel =
  | 'High network support'
  | 'Moderate network support'
  | 'Early network signal'


export type HypothesisSignalType =
  | 'Shared disease context'
  | 'Genetic convergence'
  | 'Pathway convergence'
  | 'Literature evidence'
  | 'Clinical evidence'
  | 'Traceable sources'
  | 'Network proximity'


export interface HypothesisEntity {
  id: string

  type: BiomedicalEntityType

  label: string
}


export interface HypothesisSignal {
  type: HypothesisSignalType

  description: string
}


export interface GeneratedHypothesis {
  id: string

  title: string

  question: string

  summary: string

  rationale: string

  status: HypothesisStatus

  supportLevel: HypothesisSupportLevel

  score: number

  maxScore: number

  entities: HypothesisEntity[]

  signals: HypothesisSignal[]

  evidenceRecordIds: string[]

  evidenceRecordCount: number

  traceableSourceCount: number

  scoreBreakdown: {
    label: string
    points: number
    description: string
  }[]

  validationNotice: string
}
