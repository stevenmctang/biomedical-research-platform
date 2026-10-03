import type {
    ResearchMap,
  } from './researchMap'
  
  export interface ResearchProject {
    version: 1
    id: string
    title: string
    question: string
    researchMap: ResearchMap
    expandedNodeIds: string[]
    createdAt: string
    updatedAt: string
  }
  
  export interface ResearchProjectSummary {
    id: string
    title: string
    question: string
    conceptCount: number
    relationshipCount: number
    sourceCount: number
    trialCount: number
    createdAt: string
    updatedAt: string
  }
  