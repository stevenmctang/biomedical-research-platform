import {
    diseases,
    drugs,
    genes,
    pathways,
  } from '../data/biomedicalData'
  
  import {
    evidenceRecords,
  } from '../data/evidenceData'
  
  import type {
    GeneratedHypothesis,
    HypothesisSignal,
    HypothesisStatus,
    HypothesisSupportLevel,
  } from '../types/hypothesis'
  
  
  function getEvidenceRecordCount(
    recordIds: string[],
  ) {
    return evidenceRecords.filter(
      (record) =>
        recordIds.includes(record.id),
    ).length
  }
  
  
  function getTraceableSourceCount(
    recordIds: string[],
  ) {
    return evidenceRecords
      .filter(
        (record) =>
          recordIds.includes(record.id),
      )
      .reduce(
        (total, record) =>
          total + record.sources.length,
        0,
      )
  }
  
  
  function getSupportLevel(
    score: number,
  ): HypothesisSupportLevel {
    if (score >= 8) {
      return 'High network support'
    }
  
    if (score >= 5) {
      return 'Moderate network support'
    }
  
    return 'Early network signal'
  }
  
  
  function getStatus(
    score: number,
  ): HypothesisStatus {
    if (score >= 8) {
      return 'Candidate'
    }
  
    if (score >= 5) {
      return 'Emerging'
    }
  
    return 'Exploratory'
  }
  
  
  function generateDiseasePathwayHypotheses() {
    const hypotheses: GeneratedHypothesis[] = []
  
  
    diseases.forEach(
      (disease) => {
  
        const diseaseGenes =
          genes.filter(
            (gene) =>
              disease.genes.includes(
                gene.id,
              ),
          )
  
  
        pathways.forEach(
          (pathway) => {
  
            const connectedGenes =
              diseaseGenes.filter(
                (gene) =>
                  gene.pathways.includes(
                    pathway.id,
                  ),
              )
  
  
            if (
              connectedGenes.length === 0
            ) {
              return
            }
  
  
            const geneEvidenceIds =
              connectedGenes
                .map(
                  (gene) =>
                    evidenceRecords.find(
                      (record) =>
                        record.diseaseId ===
                          disease.id &&
  
                        record.entityType ===
                          'gene' &&
  
                        record.entityId ===
                          gene.id,
                    ),
                )
                .filter(
                  (
                    record,
                  ): record is NonNullable<
                    typeof record
                  > =>
                    Boolean(record),
                )
                .map(
                  (record) =>
                    record.id,
                )
  
  
            const pathwayEvidence =
              evidenceRecords.find(
                (record) =>
                  record.diseaseId ===
                    disease.id &&
  
                  record.entityType ===
                    'pathway' &&
  
                  record.entityId ===
                    pathway.id,
              )
  
  
            const evidenceRecordIds = [
              ...geneEvidenceIds,
  
              ...(
                pathwayEvidence
                  ? [
                      pathwayEvidence.id,
                    ]
                  : []
              ),
            ]
  
  
            const evidenceRecordCount =
              getEvidenceRecordCount(
                evidenceRecordIds,
              )
  
  
            const traceableSourceCount =
              getTraceableSourceCount(
                evidenceRecordIds,
              )
  
  
            let score = 0
  
            const scoreBreakdown = []
  
  
            score += 2
  
            scoreBreakdown.push({
              label:
                'Disease-pathway connection',
  
              points: 2,
  
              description:
                `${pathway.name} is connected to genes already represented in the ${disease.abbreviation ?? disease.name} network.`,
            })
  
  
            const convergencePoints =
              Math.min(
                connectedGenes.length,
                3,
              )
  
  
            score += convergencePoints
  
            scoreBreakdown.push({
              label:
                'Gene convergence',
  
              points:
                convergencePoints,
  
              description:
                `${connectedGenes.length} disease-associated gene${connectedGenes.length === 1 ? '' : 's'} connect to this pathway.`,
            })
  
  
            const evidencePoints =
              Math.min(
                evidenceRecordCount,
                3,
              )
  
  
            if (
              evidencePoints > 0
            ) {
              score += evidencePoints
  
              scoreBreakdown.push({
                label:
                  'Evidence records',
  
                points:
                  evidencePoints,
  
                description:
                  `${evidenceRecordCount} structured evidence record${evidenceRecordCount === 1 ? '' : 's'} support relationships used in this candidate.`,
              })
            }
  
  
            const sourcePoints =
              Math.min(
                traceableSourceCount,
                2,
              )
  
  
            if (
              sourcePoints > 0
            ) {
              score += sourcePoints
  
              scoreBreakdown.push({
                label:
                  'Traceable sources',
  
                points:
                  sourcePoints,
  
                description:
                  `${traceableSourceCount} traceable research source${traceableSourceCount === 1 ? '' : 's'} are attached to the underlying evidence.`,
              })
            }
  
  
            const signals:
              HypothesisSignal[] = [
                {
                  type:
                    'Shared disease context',
  
                  description:
                    `${connectedGenes.map((gene) => gene.symbol).join(', ')} are represented within the ${disease.abbreviation ?? disease.name} disease network.`,
                },
  
                {
                  type:
                    'Pathway convergence',
  
                  description:
                    `${connectedGenes.length} disease-linked gene${connectedGenes.length === 1 ? '' : 's'} converge on ${pathway.name}.`,
                },
              ]
  
  
            if (
              evidenceRecordCount > 0
            ) {
              signals.push({
                type:
                  'Literature evidence',
  
                description:
                  'Structured evidence records exist for one or more relationships used to generate this candidate.',
              })
            }
  
  
            if (
              traceableSourceCount > 0
            ) {
              signals.push({
                type:
                  'Traceable sources',
  
                description:
                  `${traceableSourceCount} source${traceableSourceCount === 1 ? '' : 's'} can be traced from the evidence layer.`,
              })
            }
  
  
            const geneLabels =
              connectedGenes
                .map(
                  (gene) =>
                    gene.symbol,
                )
                .join(', ')
  
  
            hypotheses.push({
              id:
                `${disease.id}-${pathway.id}`,
  
              title:
                `${disease.abbreviation ?? disease.name} ↔ ${pathway.name}`,
  
              question:
                connectedGenes.length > 1
                  ? (
                    `Could convergence of ${geneLabels} on ${pathway.name} help organize research around ${disease.abbreviation ?? disease.name}?`
                  )
                  : (
                    `How might ${connectedGenes[0].symbol}-associated biology intersect with ${pathway.name} in ${disease.abbreviation ?? disease.name} research?`
                  ),
  
              summary:
                connectedGenes.length > 1
                  ? (
                    `Helix identified ${connectedGenes.length} disease-associated genes that converge on ${pathway.name}.`
                  )
                  : (
                    `Helix identified a disease-gene-pathway connection linking ${disease.abbreviation ?? disease.name}, ${connectedGenes[0].symbol}, and ${pathway.name}.`
                  ),
  
              rationale:
                `This candidate was generated because ${geneLabels} are connected to ${disease.name} and also participate in ${pathway.name} within the current Helix network. The ranking reflects network convergence and available evidence, not experimental validation.`,
  
              status:
                getStatus(score),
  
              supportLevel:
                getSupportLevel(
                  score,
                ),
  
              score,
  
              maxScore:
                10,
  
              entities: [
                {
                  id:
                    disease.id,
  
                  type:
                    'disease',
  
                  label:
                    disease.abbreviation ??
                    disease.name,
                },
  
                {
                  id:
                    pathway.id,
  
                  type:
                    'pathway',
  
                  label:
                    pathway.name,
                },
  
                ...connectedGenes.map(
                  (gene) => ({
                    id:
                      gene.id,
  
                    type:
                      'gene' as const,
  
                    label:
                      gene.symbol,
                  }),
                ),
              ],
  
              signals,
  
              evidenceRecordIds,
  
              evidenceRecordCount,
  
              traceableSourceCount,
  
              scoreBreakdown,
  
              validationNotice:
                'This candidate is generated from network structure and available evidence in Helix. The score ranks computational support only and does not represent scientific certainty, causal evidence, or experimental validation.',
            })
          },
        )
      },
    )
  
  
    return hypotheses
  }
  
  
  function generateDiseaseDrugContextHypotheses() {
    const hypotheses: GeneratedHypothesis[] = []
  
  
    diseases.forEach(
      (disease) => {
  
        const connectedDrugs =
          drugs.filter(
            (drug) =>
              disease.drugs.includes(
                drug.id,
              ),
          )
  
  
        const connectedGenes =
          genes.filter(
            (gene) =>
              disease.genes.includes(
                gene.id,
              ),
          )
  
  
        connectedDrugs.forEach(
          (drug) => {
  
            if (
              connectedGenes.length === 0
            ) {
              return
            }
  
  
            const drugEvidence =
              evidenceRecords.find(
                (record) =>
                  record.diseaseId ===
                    disease.id &&
  
                  record.entityType ===
                    'drug' &&
  
                  record.entityId ===
                    drug.id,
              )
  
  
            const geneEvidence =
              evidenceRecords.filter(
                (record) =>
                  record.diseaseId ===
                    disease.id &&
  
                  record.entityType ===
                    'gene',
              )
  
  
            const evidenceRecordIds = [
              ...geneEvidence.map(
                (record) =>
                  record.id,
              ),
  
              ...(
                drugEvidence
                  ? [
                      drugEvidence.id,
                    ]
                  : []
              ),
            ]
  
  
            const evidenceRecordCount =
              getEvidenceRecordCount(
                evidenceRecordIds,
              )
  
  
            const traceableSourceCount =
              getTraceableSourceCount(
                evidenceRecordIds,
              )
  
  
            let score = 2
  
            const scoreBreakdown = [
              {
                label:
                  'Shared disease context',
  
                points:
                  2,
  
                description:
                  `${drug.name} and ${connectedGenes.length} disease-associated gene${connectedGenes.length === 1 ? '' : 's'} share the ${disease.abbreviation ?? disease.name} research context.`,
              },
            ]
  
  
            const geneticsPoints =
              Math.min(
                geneEvidence.length,
                2,
              )
  
  
            if (
              geneticsPoints > 0
            ) {
              score += geneticsPoints
  
              scoreBreakdown.push({
                label:
                  'Genetic evidence',
  
                points:
                  geneticsPoints,
  
                description:
                  `${geneEvidence.length} disease-gene evidence record${geneEvidence.length === 1 ? '' : 's'} are represented.`,
              })
            }
  
  
            if (
              drugEvidence
            ) {
              score += 2
  
              scoreBreakdown.push({
                label:
                  'Therapeutic evidence',
  
                points:
                  2,
  
                description:
                  `Helix contains a structured therapeutic evidence record for ${drug.name}.`,
              })
            }
  
  
            const sourcePoints =
              Math.min(
                traceableSourceCount,
                2,
              )
  
  
            if (
              sourcePoints > 0
            ) {
              score += sourcePoints
  
              scoreBreakdown.push({
                label:
                  'Traceable sources',
  
                points:
                  sourcePoints,
  
                description:
                  `${traceableSourceCount} traceable source${traceableSourceCount === 1 ? '' : 's'} support the underlying disease relationships.`,
              })
            }
  
  
            hypotheses.push({
              id:
                `${disease.id}-${drug.id}-research-context`,
  
              title:
                `${disease.abbreviation ?? disease.name} ↔ ${drug.name} Research Context`,
  
              question:
                `How can ${drug.name} therapeutic evidence be explored alongside genetic and biological research in ${disease.abbreviation ?? disease.name}?`,
  
              summary:
                `Helix identified a shared disease context connecting ${drug.name} therapeutic research with ${connectedGenes.length} disease-associated gene${connectedGenes.length === 1 ? '' : 's'}.`,
  
              rationale:
                `This candidate connects therapeutic and genetic layers through their shared ${disease.name} context. It is intended to support cross-domain research navigation and does not imply that ${drug.name} directly targets the associated genes.`,
  
              status:
                getStatus(score),
  
              supportLevel:
                getSupportLevel(
                  score,
                ),
  
              score,
  
              maxScore:
                8,
  
              entities: [
                {
                  id:
                    disease.id,
  
                  type:
                    'disease',
  
                  label:
                    disease.abbreviation ??
                    disease.name,
                },
  
                {
                  id:
                    drug.id,
  
                  type:
                    'drug',
  
                  label:
                    drug.name,
                },
  
                ...connectedGenes
                  .slice(0, 3)
                  .map(
                    (gene) => ({
                      id:
                        gene.id,
  
                      type:
                        'gene' as const,
  
                      label:
                        gene.symbol,
                    }),
                  ),
              ],
  
              signals: [
                {
                  type:
                    'Shared disease context',
  
                  description:
                    `${drug.name} and the displayed genes are all connected to ${disease.abbreviation ?? disease.name}.`,
                },
  
                {
                  type:
                    'Genetic convergence',
  
                  description:
                    `${connectedGenes.length} genetic relationship${connectedGenes.length === 1 ? '' : 's'} are represented in this disease network.`,
                },
  
                {
                  type:
                    'Clinical evidence',
  
                  description:
                    drugEvidence
                      ? (
                        `A therapeutic evidence record exists for ${drug.name}.`
                      )
                      : (
                        `The drug is represented in the development network, but source integration is still pending.`
                      ),
                },
              ],
  
              evidenceRecordIds,
  
              evidenceRecordCount,
  
              traceableSourceCount,
  
              scoreBreakdown,
  
              validationNotice:
                `This is a research-context hypothesis only. It does not imply that ${drug.name} directly interacts with, targets, or modifies the displayed genes.`,
            })
          },
        )
      },
    )
  
  
    return hypotheses
  }
  
  
  export function generateHypotheses() {
    const generated = [
      ...generateDiseasePathwayHypotheses(),
      ...generateDiseaseDrugContextHypotheses(),
    ]
  
  
    return generated.sort(
      (a, b) => {
  
        if (
          b.score !== a.score
        ) {
          return b.score - a.score
        }
  
  
        return (
          b.traceableSourceCount -
          a.traceableSourceCount
        )
      },
    )
  }
  