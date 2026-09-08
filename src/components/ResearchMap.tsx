import {
    useMemo,
    useState,
  } from 'react'
  
  import {
    ArrowRight,
    BookOpen,
    Dna,
    FlaskConical,
    Network,
    Search,
    Sparkles,
  } from 'lucide-react'
  
  import {
    Link,
  } from 'react-router-dom'
  
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
    BiomedicalEntityType,
  } from '../types/biomedical'
  
  import './ResearchMap.css'
  
  
  type MapNodeType =
    | BiomedicalEntityType
    | 'question'
  
  
  interface MapNode {
    id: string
    entityId?: string
    type: MapNodeType
    label: string
    subtitle: string
    description: string
    x: number
    y: number
  }
  
  interface MapEdge {
    id: string
    from: string
    to: string
    label: string
  }
  
  
  interface ResearchMapProps {
    question: string
  }
  
  
  function questionIncludes(
    question: string,
    value: string,
  ) {
    return question
      .toLowerCase()
      .includes(
        value.toLowerCase(),
      )
  }
  
  
  function getDiseaseFromQuestion(
    question: string,
  ) {
    return diseases.find(
      (disease) =>
        questionIncludes(
          question,
          disease.name,
        ) ||
        (
          disease.abbreviation &&
          questionIncludes(
            question,
            disease.abbreviation,
          )
        ),
    )
  }
  
  
  function getGeneFromQuestion(
    question: string,
  ) {
    return genes.find(
      (gene) =>
        questionIncludes(
          question,
          gene.symbol,
        ) ||
        questionIncludes(
          question,
          gene.name,
        ),
    )
  }
  
  
  function buildResearchMap(
    question: string,
  ) {
    const nodes: MapNode[] = []
    const edges: MapEdge[] = []
  
    nodes.push({
      id: 'question',
      type: 'question',
      label: question,
      subtitle:
        'Research question',
      description:
        'The starting point for this biomedical investigation.',
      x: 50,
      y: 50,
    })
  
  
    const detectedDisease =
      getDiseaseFromQuestion(
        question,
      ) ??
      diseases[0]
  
  
    const detectedGene =
      getGeneFromQuestion(
        question,
      )
  
  
    if (detectedDisease) {
      nodes.push({
        id:
          `disease-${detectedDisease.id}`,
        entityId:
          detectedDisease.id,
        type: 'disease',
        label:
          detectedDisease.abbreviation ??
          detectedDisease.name,
        subtitle:
          'Disease',
        description:
          detectedDisease.description,
        x: 27,
        y: 33,
      })
  
      edges.push({
        id:
          `question-disease-${detectedDisease.id}`,
        from: 'question',
        to:
          `disease-${detectedDisease.id}`,
        label:
          'research context',
      })
    }
  
  
    const primaryGene =
      detectedGene ??
      genes.find(
        (gene) =>
          detectedDisease?.genes.includes(
            gene.id,
          ),
      )
  
  
    if (primaryGene) {
      nodes.push({
        id:
          `gene-${primaryGene.id}`,
        entityId:
          primaryGene.id,
        type: 'gene',
        label:
          primaryGene.symbol,
        subtitle:
          'Gene / Target',
        description:
          primaryGene.description,
        x: 72,
        y: 33,
      })
  
      edges.push({
        id:
          `question-gene-${primaryGene.id}`,
        from: 'question',
        to:
          `gene-${primaryGene.id}`,
        label:
          'target',
      })
  
      if (detectedDisease) {
        edges.push({
          id:
            `disease-gene-${detectedDisease.id}-${primaryGene.id}`,
          from:
            `disease-${detectedDisease.id}`,
          to:
            `gene-${primaryGene.id}`,
          label:
            'associated',
        })
      }
    }
  
  
    const connectedPathways =
      pathways
        .filter(
          (pathway) =>
            (
              primaryGene &&
              pathway.genes.includes(
                primaryGene.id,
              )
            ) ||
            (
              detectedDisease &&
              detectedDisease.pathways.includes(
                pathway.id,
              )
            ),
        )
        .slice(
          0,
          2,
        )
  
  
    connectedPathways.forEach(
      (
        pathway,
        index,
      ) => {
        const nodeId =
          `pathway-${pathway.id}`
  
        nodes.push({
          id: nodeId,
          entityId:
            pathway.id,
          type:
            'pathway',
          label:
            pathway.name,
          subtitle:
            'Biological pathway',
          description:
            pathway.description,
          x:
            index === 0
              ? 22
              : 78,
          y: 72,
        })
  
        edges.push({
          id:
            `question-${nodeId}`,
          from:
            'question',
          to:
            nodeId,
          label:
            'mechanism',
        })
      },
    )
  
  
    const connectedDrug =
      drugs.find(
        (drug) =>
          detectedDisease &&
          drug.associatedDiseases.includes(
            detectedDisease.id,
          ),
      )
  
  
    if (connectedDrug) {
      nodes.push({
        id:
          `drug-${connectedDrug.id}`,
        entityId:
          connectedDrug.id,
        type:
          'drug',
        label:
          connectedDrug.name,
        subtitle:
          'Therapeutic',
        description:
          connectedDrug.description,
        x: 50,
        y: 84,
      })
  
      edges.push({
        id:
          `question-drug-${connectedDrug.id}`,
        from:
          'question',
        to:
          `drug-${connectedDrug.id}`,
        label:
          'therapeutic context',
      })
    }
  
  
    return {
      nodes,
      edges,
    }
  }
  
  
  function getNodeIcon(
    type: MapNodeType,
  ) {
    if (
      type === 'gene'
    ) {
      return (
        <Dna size={15} />
      )
    }
  
    if (
      type === 'drug'
    ) {
      return (
        <FlaskConical size={15} />
      )
    }
  
    if (
      type === 'pathway'
    ) {
      return (
        <Network size={15} />
      )
    }
  
    if (
      type === 'question'
    ) {
      return (
        <Sparkles size={15} />
      )
    }
  
    return (
      <Search size={15} />
    )
  }
  
  
  function getEntityRoute(
    node: MapNode,
  ) {
    if (
      !node.entityId ||
      node.type === 'question'
    ) {
      return undefined
    }
  
    return (
      `/${node.type}/${node.entityId}`
    )
  }
  
  
  export function ResearchMap({
    question,
  }: ResearchMapProps) {
    const {
      nodes,
      edges,
    } =
      useMemo(
        () =>
          buildResearchMap(
            question,
          ),
        [question],
      )
  
  
    const [
      selectedNodeId,
      setSelectedNodeId,
    ] =
      useState(
        'question',
      )
  
  
    const selectedNode =
      nodes.find(
        (node) =>
          node.id ===
          selectedNodeId,
      ) ??
      nodes[0]
  
  
    const entityEvidence =
      useMemo(
        () => {
          if (
            !selectedNode.entityId
          ) {
            return []
          }
  
          if (
            selectedNode.type ===
            'disease'
          ) {
            return evidenceRecords
              .filter(
                (record) =>
                  record.diseaseId ===
                  selectedNode.entityId,
              )
          }
  
          return evidenceRecords
            .filter(
              (record) =>
                record.entityId ===
                selectedNode.entityId,
            )
        },
        [
          selectedNode.entityId,
          selectedNode.type,
        ],
      )
  
  
    const sourceCount =
      new Set(
        entityEvidence
          .flatMap(
            (record) =>
              record.sources,
          )
          .map(
            (source) =>
              source.id,
          ),
      ).size
  
  
    const entityRoute =
      getEntityRoute(
        selectedNode,
      )
  
  
    function getNode(
      id: string,
    ) {
      return nodes.find(
        (node) =>
          node.id === id,
      )
    }
  
  
    return (
      <div className="research-map-shell">
  
        <div className="research-map-stage">
  
          <svg
            className="research-map-connections"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
  
            {
              edges.map(
                (edge) => {
                  const start =
                    getNode(
                      edge.from,
                    )
  
                  const end =
                    getNode(
                      edge.to,
                    )
  
                  if (
                    !start ||
                    !end
                  ) {
                    return null
                  }
  
                  return (
                    <g
                      key={
                        edge.id
                      }
                    >
  
                      <line
                        x1={
                          start.x
                        }
                        y1={
                          start.y
                        }
                        x2={
                          end.x
                        }
                        y2={
                          end.y
                        }
                      />
  
                    </g>
                  )
                },
              )
            }
  
          </svg>
  
  
          {
            nodes.map(
              (node) => (
  
                <button
                  key={
                    node.id
                  }
                  type="button"
                  className={
                    [
                      'research-map-node',
                      `research-map-node-${node.type}`,
                      selectedNode.id ===
                      node.id
                        ? 'research-map-node-selected'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')
                  }
                  style={{
                    left:
                      `${node.x}%`,
                    top:
                      `${node.y}%`,
                  }}
                  onClick={
                    () =>
                      setSelectedNodeId(
                        node.id,
                      )
                  }
                >
  
                  <span className="research-map-node-icon">
  
                    {
                      getNodeIcon(
                        node.type,
                      )
                    }
  
                  </span>
  
  
                  <span className="research-map-node-copy">
  
                    <small>
                      {
                        node.subtitle
                      }
                    </small>
  
                    <strong>
                      {
                        node.label
                      }
                    </strong>
  
                  </span>
  
                </button>
  
              ),
            )
          }
  
  
          <div className="research-map-key">
  
            <span>
              <i className="map-key-dot disease-dot" />
              Disease
            </span>
  
            <span>
              <i className="map-key-dot gene-dot" />
              Gene
            </span>
  
            <span>
              <i className="map-key-dot pathway-dot" />
              Pathway
            </span>
  
            <span>
              <i className="map-key-dot drug-dot" />
              Drug
            </span>
  
          </div>
  
        </div>
  
  
        <aside className="research-map-inspector">
  
          <div className="research-map-inspector-top">
  
            <span>
              {
                selectedNode
                  .subtitle
                  .toUpperCase()
              }
            </span>
  
            <div>
              {
                getNodeIcon(
                  selectedNode.type,
                )
              }
            </div>
  
          </div>
  
  
          <h3>
            {
              selectedNode.label
            }
          </h3>
  
  
          <p className="research-map-description">
            {
              selectedNode.description
            }
          </p>
  
  
          {
            selectedNode.type !==
            'question' && (
              <>
  
                <div className="research-map-metrics">
  
                  <div>
  
                    <span>
                      Evidence
                    </span>
  
                    <strong>
                      {
                        entityEvidence.length
                      }
                    </strong>
  
                  </div>
  
  
                  <div>
  
                    <span>
                      Sources
                    </span>
  
                    <strong>
                      {
                        sourceCount
                      }
                    </strong>
  
                  </div>
  
                </div>
  
  
                {
                  entityEvidence.length >
                  0 && (
                    <div className="research-map-evidence-preview">
  
                      <div className="research-map-section-label">
  
                        <BookOpen size={13} />
  
                        EVIDENCE SIGNALS
  
                      </div>
  
  
                      {
                        entityEvidence
                          .slice(
                            0,
                            3,
                          )
                          .map(
                            (record) => (
  
                              <article
                                key={
                                  record.id
                                }
                              >
  
                                <strong>
                                  {
                                    record.title
                                  }
                                </strong>
  
                                <span>
                                  {
                                    record.strength
                                  }{' '}
                                  support
                                </span>
  
                              </article>
  
                            ),
                          )
                      }
  
                    </div>
                  )
                }
  
  
                {
                  entityRoute && (
                    <Link
                      to={
                        entityRoute
                      }
                      className="research-map-open"
                    >
  
                      Open full profile
  
                      <ArrowRight size={14} />
  
                    </Link>
                  )
                }
  
              </>
            )
          }
  
        </aside>
  
      </div>
    )
  }
  