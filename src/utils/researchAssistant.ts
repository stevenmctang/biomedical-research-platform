import {
  diseases,
  genes,
} from '../data/biomedicalData'

import {
  evidenceRecords,
} from '../data/evidenceData'

import {
  generateHypotheses,
} from './generateHypotheses'

import {
  searchPubMed,
} from '../services/pubmed'

import type {
  EvidenceSource,
} from '../types/evidence'

import type {
  PubMedPaper,
} from '../types/pubmed'


export interface AssistantReference {
  label: string

  route: string

  type:
    | 'disease'
    | 'gene'
    | 'drug'
    | 'pathway'
    | 'hypothesis'
}


export interface AssistantSource {
  id: string

  title: string

  sourceType: string

  publication?: string

  year?: number

  externalId?: string

  url?: string
}


export interface AssistantHypothesis {
  id: string

  title: string

  score: number

  maxScore: number

  supportLevel: string

  summary: string

  rationale: string
}


export interface LiteratureFinding {
  pmid: string

  title: string

  finding: string

  url: string
}


export interface ResearchAnswer {
  title: string

  answer: string

  references: AssistantReference[]

  sources: AssistantSource[]

  hypotheses: AssistantHypothesis[]

  evidenceCount: number

  developmentNotice: string

  liveLiterature: PubMedPaper[]

  liveLiteratureTotal: number

  liveLiteratureQuery: string

  literatureFindings: LiteratureFinding[]

  literatureSynthesis?: string
}


type LocalResearchAnswer =
  Omit<
    ResearchAnswer,
    | 'liveLiterature'
    | 'liveLiteratureTotal'
    | 'liveLiteratureQuery'
    | 'literatureFindings'
    | 'literatureSynthesis'
  >


function normalizeQuestion(
  question: string,
) {
  return question
    .trim()
    .toLowerCase()
}


function matchesTerm(
  question: string,
  term: string,
) {
  const escaped =
    term.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    )

  const expression =
    new RegExp(
      `\\b${escaped}\\b`,
      'i',
    )

  return expression.test(
    question,
  )
}


function getSourceUrl(
  source: EvidenceSource,
) {
  if (
    !source.externalId
  ) {
    return undefined
  }

  if (
    source.sourceType ===
      'PubMed' ||
    source.sourceType ===
      'Clinical Study'
  ) {
    return (
      `https://pubmed.ncbi.nlm.nih.gov/` +
      `${source.externalId}/`
    )
  }

  if (
    source.sourceType ===
      'NCBI Gene'
  ) {
    return (
      `https://www.ncbi.nlm.nih.gov/gene/` +
      `${source.externalId}`
    )
  }

  return undefined
}


function convertSources(
  sources: EvidenceSource[],
): AssistantSource[] {
  const seen =
    new Set<string>()

  return sources
    .filter(
      (source) => {
        if (
          seen.has(
            source.id,
          )
        ) {
          return false
        }

        seen.add(
          source.id,
        )

        return true
      },
    )
    .map(
      (source) => ({
        id:
          source.id,

        title:
          source.title,

        sourceType:
          source.sourceType,

        publication:
          source.publication,

        year:
          source.year,

        externalId:
          source.externalId,

        url:
          getSourceUrl(
            source,
          ),
      }),
    )
}


function findDisease(
  question: string,
) {
  return diseases.find(
    (disease) => {
      const fullName =
        disease.name.toLowerCase()

      const abbreviation =
        disease.abbreviation
          ?.toLowerCase() ?? ''

      return (
        question.includes(
          fullName,
        ) ||
        (
          abbreviation.length > 0 &&
          matchesTerm(
            question,
            abbreviation,
          )
        )
      )
    },
  )
}


function findGene(
  question: string,
) {
  return genes.find(
    (gene) => {
      const symbol =
        gene.symbol.toLowerCase()

      const name =
        gene.name.toLowerCase()

      return (
        matchesTerm(
          question,
          symbol,
        ) ||
        question.includes(
          name,
        )
      )
    },
  )
}


function getHypothesisSources(
  hypothesisIds: string[],
) {
  const hypotheses =
    generateHypotheses()
      .filter(
        (hypothesis) =>
          hypothesisIds.includes(
            hypothesis.id,
          ),
      )

  const evidenceIds =
    hypotheses.flatMap(
      (hypothesis) =>
        hypothesis.evidenceRecordIds,
    )

  const evidence =
    evidenceRecords.filter(
      (record) =>
        evidenceIds.includes(
          record.id,
        ),
    )

  return convertSources(
    evidence.flatMap(
      (record) =>
        record.sources,
    ),
  )
}


function answerDiseaseHypothesisQuestion(
  diseaseId: string,
): LocalResearchAnswer | null {
  const disease =
    diseases.find(
      (item) =>
        item.id ===
        diseaseId,
    )

  if (!disease) {
    return null
  }

  const hypotheses =
    generateHypotheses()
      .filter(
        (hypothesis) =>
          hypothesis.entities.some(
            (entity) =>
              entity.type ===
                'disease' &&
              entity.id ===
                disease.id,
          ),
      )
      .sort(
        (a, b) =>
          b.score - a.score,
      )
      .slice(
        0,
        3,
      )

  if (
    hypotheses.length === 0
  ) {
    return {
      title:
        `Hypotheses around ${
          disease.abbreviation ??
          disease.name
        }`,

      answer:
        `Helix does not currently generate computational hypotheses for ${disease.name}.`,

      references: [
        {
          label:
            disease.abbreviation ??
            disease.name,

          route:
            `/disease/${disease.id}`,

          type:
            'disease',
        },
      ],

      sources: [],

      hypotheses: [],

      evidenceCount: 0,

      developmentNotice:
        'Hypothesis generation depends on relationships currently represented in the Helix development network.',
    }
  }

  const topHypothesis =
    hypotheses[0]

  const hypothesisIds =
    hypotheses.map(
      (hypothesis) =>
        hypothesis.id,
    )

  const uniqueEvidenceIds =
    Array.from(
      new Set(
        hypotheses.flatMap(
          (hypothesis) =>
            hypothesis.evidenceRecordIds,
        ),
      ),
    )

  return {
    title:
      `Strongest generated hypotheses around ${
        disease.abbreviation ??
        disease.name
      }`,

    answer:
      `Helix currently ranks ${hypotheses.length} leading computational research candidates for ${disease.name}. ` +
      `The highest-ranked candidate is “${topHypothesis.title}” with a network-support score of ` +
      `${topHypothesis.score}/${topHypothesis.maxScore}. ` +
      `${topHypothesis.summary}`,

    references: [
      {
        label:
          'Open Hypothesis Explorer',

        route:
          '/hypotheses',

        type:
          'hypothesis',
      },
    ],

    sources:
      getHypothesisSources(
        hypothesisIds,
      ),

    hypotheses:
      hypotheses.map(
        (hypothesis) => ({
          id:
            hypothesis.id,

          title:
            hypothesis.title,

          score:
            hypothesis.score,

          maxScore:
            hypothesis.maxScore,

          supportLevel:
            hypothesis.supportLevel,

          summary:
            hypothesis.summary,

          rationale:
            hypothesis.rationale,
        }),
      ),

    evidenceCount:
      uniqueEvidenceIds.length,

    developmentNotice:
      'Generated hypotheses are computational research candidates and require independent scientific validation.',
  }
}


function answerGeneHypothesisQuestion(
  geneId: string,
): LocalResearchAnswer | null {
  const gene =
    genes.find(
      (item) =>
        item.id ===
        geneId,
    )

  if (!gene) {
    return null
  }

  const hypotheses =
    generateHypotheses()
      .filter(
        (hypothesis) =>
          hypothesis.entities.some(
            (entity) =>
              entity.type ===
                'gene' &&
              entity.id ===
                gene.id,
          ),
      )
      .sort(
        (a, b) =>
          b.score - a.score,
      )
      .slice(
        0,
        3,
      )

  if (
    hypotheses.length === 0
  ) {
    return {
      title:
        `Research connections around ${gene.symbol}`,

      answer:
        `Helix does not currently generate a computational hypothesis containing ${gene.symbol}.`,

      references: [
        {
          label:
            gene.symbol,

          route:
            `/gene/${gene.id}`,

          type:
            'gene',
        },
      ],

      sources: [],

      hypotheses: [],

      evidenceCount: 0,

      developmentNotice:
        'The hypothesis engine can only surface relationships represented in the current Helix development network.',
    }
  }

  const evidenceIds =
    Array.from(
      new Set(
        hypotheses.flatMap(
          (hypothesis) =>
            hypothesis.evidenceRecordIds,
        ),
      ),
    )

  return {
    title:
      `Research connections around ${gene.symbol}`,

    answer:
      `Helix found ${hypotheses.length} generated research candidate${hypotheses.length === 1 ? '' : 's'} involving ${gene.symbol}.`,

    references: [
      {
        label:
          gene.symbol,

        route:
          `/gene/${gene.id}`,

        type:
          'gene',
      },

      {
        label:
          'Open Hypothesis Explorer',

        route:
          '/hypotheses',

        type:
          'hypothesis',
      },
    ],

    sources:
      getHypothesisSources(
        hypotheses.map(
          (hypothesis) =>
            hypothesis.id,
        ),
      ),

    hypotheses:
      hypotheses.map(
        (hypothesis) => ({
          id:
            hypothesis.id,

          title:
            hypothesis.title,

          score:
            hypothesis.score,

          maxScore:
            hypothesis.maxScore,

          supportLevel:
            hypothesis.supportLevel,

          summary:
            hypothesis.summary,

          rationale:
            hypothesis.rationale,
        }),
      ),

    evidenceCount:
      evidenceIds.length,

    developmentNotice:
      'Generated research connections are computational hypotheses and require independent scientific validation.',
  }
}


function answerDiseaseGeneQuestion(
  diseaseId: string,
): LocalResearchAnswer | null {
  const disease =
    diseases.find(
      (item) =>
        item.id ===
        diseaseId,
    )

  if (!disease) {
    return null
  }

  const connectedGenes =
    genes.filter(
      (gene) =>
        disease.genes.includes(
          gene.id,
        ),
    )

  const evidence =
    evidenceRecords.filter(
      (record) =>
        record.diseaseId ===
          disease.id &&
        record.entityType ===
          'gene',
    )

  return {
    title:
      `Genes associated with ${
        disease.abbreviation ??
        disease.name
      }`,

    answer:
      `In the current Helix dataset, ${disease.name} is connected to ` +
      `${connectedGenes.map(
        (gene) =>
          gene.symbol,
      ).join(', ')}.`,

    references:
      connectedGenes.map(
        (gene) => ({
          label:
            gene.symbol,

          route:
            `/gene/${gene.id}`,

          type:
            'gene',
        }),
      ),

    sources:
      convertSources(
        evidence.flatMap(
          (record) =>
            record.sources,
        ),
      ),

    hypotheses: [],

    evidenceCount:
      evidence.length,

    developmentNotice:
      'This answer is generated from the current Helix dataset and should not be treated as comprehensive scientific evidence.',
  }
}


function answerGeneEvidenceQuestion(
  geneId: string,
): LocalResearchAnswer | null {
  const gene =
    genes.find(
      (item) =>
        item.id ===
        geneId,
    )

  if (!gene) {
    return null
  }

  const evidence =
    evidenceRecords.filter(
      (record) =>
        record.entityType ===
          'gene' &&
        record.entityId ===
          gene.id,
    )

  const sources =
    convertSources(
      evidence.flatMap(
        (record) =>
          record.sources,
      ),
    )

  return {
    title:
      `Evidence involving ${gene.symbol}`,

    answer:
      `Helix currently contains ${evidence.length} structured evidence ` +
      `record${evidence.length === 1 ? '' : 's'} involving ${gene.symbol}. ` +
      `${sources.length} traceable source${sources.length === 1 ? '' : 's'} are attached to these records.`,

    references: [
      {
        label:
          gene.symbol,

        route:
          `/gene/${gene.id}`,

        type:
          'gene',
      },
    ],

    sources,

    hypotheses: [],

    evidenceCount:
      evidence.length,

    developmentNotice:
      'Evidence summaries help navigate research sources and do not establish scientific conclusions on their own.',
  }
}


function answerResearchQuestionLocal(
  question: string,
): LocalResearchAnswer {
  const normalized =
    normalizeQuestion(
      question,
    )

  const disease =
    findDisease(
      normalized,
    )

  const gene =
    findGene(
      normalized,
    )

  const mentionsHypothesis =
    normalized.includes(
      'hypothesis',
    ) ||
    normalized.includes(
      'hypotheses',
    ) ||
    normalized.includes(
      'investigate',
    ) ||
    normalized.includes(
      'strongest',
    )

  const mentionsGene =
    normalized.includes(
      'gene',
    ) ||
    normalized.includes(
      'genes',
    )

  const mentionsEvidence =
    normalized.includes(
      'evidence',
    ) ||
    normalized.includes(
      'research',
    ) ||
    normalized.includes(
      'source',
    )

  if (
    disease &&
    mentionsHypothesis
  ) {
    const result =
      answerDiseaseHypothesisQuestion(
        disease.id,
      )

    if (result) {
      return result
    }
  }

  if (
    gene &&
    mentionsHypothesis
  ) {
    const result =
      answerGeneHypothesisQuestion(
        gene.id,
      )

    if (result) {
      return result
    }
  }

  if (
    disease &&
    gene &&
    mentionsEvidence
  ) {
    const result =
      answerGeneEvidenceQuestion(
        gene.id,
      )

    if (result) {
      return result
    }
  }

  if (
    disease &&
    mentionsGene
  ) {
    const result =
      answerDiseaseGeneQuestion(
        disease.id,
      )

    if (result) {
      return result
    }
  }

  if (
    gene &&
    mentionsEvidence
  ) {
    const result =
      answerGeneEvidenceQuestion(
        gene.id,
      )

    if (result) {
      return result
    }
  }

  if (disease) {
    const evidence =
      evidenceRecords.filter(
        (record) =>
          record.diseaseId ===
          disease.id,
      )

    return {
      title:
        disease.name,

      answer:
        `${disease.description}`,

      references: [
        {
          label:
            disease.abbreviation ??
            disease.name,

          route:
            `/disease/${disease.id}`,

          type:
            'disease',
        },
      ],

      sources:
        convertSources(
          evidence.flatMap(
            (record) =>
              record.sources,
          ),
        ),

      hypotheses: [],

      evidenceCount:
        evidence.length,

      developmentNotice:
        'This answer summarizes the current Helix development dataset.',
    }
  }

  if (gene) {
    const evidence =
      evidenceRecords.filter(
        (record) =>
          record.entityId ===
          gene.id,
      )

    return {
      title:
        gene.symbol,

      answer:
        `${gene.symbol} (${gene.name}) is represented in the current Helix biomedical network.`,

      references: [
        {
          label:
            gene.symbol,

          route:
            `/gene/${gene.id}`,

          type:
            'gene',
        },
      ],

      sources:
        convertSources(
          evidence.flatMap(
            (record) =>
              record.sources,
          ),
        ),

      hypotheses: [],

      evidenceCount:
        evidence.length,

      developmentNotice:
        'This answer summarizes the current Helix development dataset.',
    }
  }

  return {
    title:
      'Research question not yet supported',

    answer:
      'Helix could not map this question to the current biomedical network.',

    references: [],

    sources: [],

    hypotheses: [],

    evidenceCount: 0,

    developmentNotice:
      'The Research Assistant currently reasons over structured Helix data and live PubMed literature.',
  }
}


function createPubMedQuery(
  question: string,
) {
  return question
    .replace(
      /[?]/g,
      '',
    )
    .replace(
      /\bwhat\b/gi,
      '',
    )
    .replace(
      /\bare\b/gi,
      '',
    )
    .replace(
      /\bis\b/gi,
      '',
    )
    .replace(
      /\bthe\b/gi,
      '',
    )
    .replace(
      /\bevidence\b/gi,
      '',
    )
    .replace(
      /\bconnects?\b/gi,
      '',
    )
    .replace(
      /\bassociated\b/gi,
      '',
    )
    .replace(
      /\bstrongest\b/gi,
      '',
    )
    .replace(
      /\bhypotheses\b/gi,
      '',
    )
    .replace(
      /\bhypothesis\b/gi,
      '',
    )
    .replace(
      /\baround\b/gi,
      '',
    )
    .replace(
      /\bwith\b/gi,
      '',
    )
    .replace(
      /\bto\b/gi,
      '',
    )
    .replace(
      /\s+/g,
      ' ',
    )
    .trim()
}


function firstUsefulSentence(
  abstract: string,
) {
  const cleaned =
    abstract
      .replace(
        /^(BACKGROUND|OBJECTIVE|METHODS|RESULTS|CONCLUSION|CONCLUSIONS):\s*/i,
        '',
      )
      .trim()

  const sentences =
    cleaned.match(
      /[^.!?]+[.!?]+/g,
    )

  if (
    !sentences ||
    sentences.length === 0
  ) {
    return cleaned.length > 260
      ? `${cleaned.slice(0, 257)}...`
      : cleaned
  }

  const preferred =
    sentences.find(
      (sentence) =>
        /results|found|showed|associated|mutation|variant|risk|mechanism|clinical|survival|disease/i.test(
          sentence,
        ),
    )

  const selected =
    preferred ??
    sentences[0]

  return selected
    .trim()
    .slice(
      0,
      320,
    )
}


function createLiteratureFindings(
  papers: PubMedPaper[],
): LiteratureFinding[] {
  return papers
    .filter(
      (paper) =>
        Boolean(
          paper.abstract,
        ),
    )
    .slice(
      0,
      5,
    )
    .map(
      (paper) => ({
        pmid:
          paper.pmid,

        title:
          paper.title,

        finding:
          firstUsefulSentence(
            paper.abstract ?? '',
          ),

        url:
          paper.url,
      }),
    )
}


function createLiteratureSynthesis(
  papers: PubMedPaper[],
) {
  const papersWithAbstracts =
    papers.filter(
      (paper) =>
        Boolean(
          paper.abstract,
        ),
    )

  if (
    papersWithAbstracts.length === 0
  ) {
    return undefined
  }

  const findings =
    createLiteratureFindings(
      papersWithAbstracts,
    )

  if (
    findings.length === 0
  ) {
    return undefined
  }

  const combined =
    findings
      .slice(
        0,
        3,
      )
      .map(
        (finding) =>
          finding.finding,
      )
      .join(' ')

  return (
    `Helix retrieved ${papersWithAbstracts.length} PubMed record` +
    `${papersWithAbstracts.length === 1 ? '' : 's'} with available abstracts. ` +
    `Across the highest-ranked results, the literature describes the following evidence: ${combined} ` +
    `This is an automated research synthesis of PubMed abstracts and should be checked against the original publications.`
  )
}


export async function answerResearchQuestion(
  question: string,
): Promise<ResearchAnswer> {
  const localAnswer =
    answerResearchQuestionLocal(
      question,
    )

  const liveLiteratureQuery =
    createPubMedQuery(
      question,
    ) ||
    question.trim()

  try {
    const pubMedResponse =
      await searchPubMed(
        liveLiteratureQuery,
        5,
      )

    const literatureFindings =
      createLiteratureFindings(
        pubMedResponse.papers,
      )

    const literatureSynthesis =
      createLiteratureSynthesis(
        pubMedResponse.papers,
      )

    return {
      ...localAnswer,

      liveLiterature:
        pubMedResponse.papers,

      liveLiteratureTotal:
        pubMedResponse.total,

      liveLiteratureQuery,

      literatureFindings,

      literatureSynthesis,
    }

  } catch (error) {
    console.error(
      'Live PubMed grounding failed:',
      error,
    )

    return {
      ...localAnswer,

      liveLiterature: [],

      liveLiteratureTotal: 0,

      liveLiteratureQuery,

      literatureFindings: [],

      literatureSynthesis:
        undefined,
    }
  }
}
