import {
  ArrowRight,
  Atom,
  Beaker,
  BookOpen,
  Brain,
  CircleDot,
  Dna,
  FlaskConical,
  Network,
  Orbit,
  Sparkles,
} from 'lucide-react'

import type {
  ResearchMap,
  ResearchNode,
  ResearchNodeType,
} from '../types/researchMap'

import './ResearchVisualization.css'

interface ResearchVisualizationProject {
  title: string
  question: string
  expandedNodeIds: string[]
}

interface ResearchVisualizationProps {
  project: ResearchVisualizationProject
  map: ResearchMap
  onOpenMap: () => void
}

function getNodeIcon(
  type:
    ResearchNodeType,
) {
  if (
    type ===
    'gene'
  ) {
    return (
      <Dna size={22} />
    )
  }

  if (
    type ===
    'drug'
  ) {
    return (
      <FlaskConical size={22} />
    )
  }

  if (
    type ===
      'pathway' ||
    type ===
      'process' ||
    type ===
      'mechanism'
  ) {
    return (
      <Network size={22} />
    )
  }

  if (
    type ===
    'molecule'
  ) {
    return (
      <Beaker size={22} />
    )
  }

  if (
    type ===
    'material'
  ) {
    return (
      <CircleDot size={22} />
    )
  }

  if (
    type ===
      'technology' ||
    type ===
      'theory'
  ) {
    return (
      <Atom size={22} />
    )
  }

  if (
    type ===
    'paper'
  ) {
    return (
      <BookOpen size={22} />
    )
  }

  return (
    <Sparkles size={22} />
  )
}

function getDomainIcon(
  domain:
    string,
) {
  if (
    domain.includes(
      'Bio',
    ) ||
    domain.includes(
      'Neuro',
    )
  ) {
    return (
      <Brain size={26} />
    )
  }

  if (
    domain.includes(
      'Chem',
    )
  ) {
    return (
      <Beaker size={26} />
    )
  }

  if (
    domain.includes(
      'Astronomy',
    )
  ) {
    return (
      <Orbit size={26} />
    )
  }

  return (
    <Atom size={26} />
  )
}

function getPrimaryNodes(
  map:
    ResearchMap,
) {
  return map.nodes
    .filter(
      (
        node,
      ) =>
        node.type !==
        'question',
    )
    .slice(
      0,
      7,
    )
}

function getMainFocus(
  map:
    ResearchMap,
) {
  return (
    map.nodes.find(
      (
        node,
      ) =>
        node.type ===
        'question',
    ) ??
    map.nodes[0]
  )
}

function getNodeById(
  map:
    ResearchMap,
  id:
    string,
) {
  return map.nodes.find(
    (
      node,
    ) =>
      node.id ===
      id,
  )
}

function getStrongEvidenceCount(
  map:
    ResearchMap,
) {
  return map.nodes.filter(
    (
      node,
    ) =>
      node.evidenceStrength ===
        'strong',
  ).length
}

function getLimitedEvidenceCount(
  map:
    ResearchMap,
) {
  return map.nodes.filter(
    (
      node,
    ) =>
      node.evidenceStrength ===
        'limited',
  ).length
}

function getMechanismEdges(
  map:
    ResearchMap,
) {
  return map.edges.slice(
    0,
    6,
  )
}

function getEvidenceLabel(
  node:
    ResearchNode,
) {
  if (
    node.evidenceStrength ===
    'strong'
  ) {
    return 'Strong support'
  }

  if (
    node.evidenceStrength ===
    'moderate'
  ) {
    return 'Moderate support'
  }

  if (
    node.evidenceStrength ===
    'limited'
  ) {
    return 'Limited support'
  }

  return 'Needs verification'
}

export function ResearchVisualization({
  project,
  map,
  onOpenMap,
}: ResearchVisualizationProps) {
  const focusNode =
    getMainFocus(
      map,
    )

  const primaryNodes =
    getPrimaryNodes(
      map,
    )

  const mechanismEdges =
    getMechanismEdges(
      map,
    )

  const strongCount =
    getStrongEvidenceCount(
      map,
    )

  const limitedCount =
    getLimitedEvidenceCount(
      map,
    )

  return (
    <main className="helix-visual-page">
      <section className="helix-visual-shell">
        <div className="helix-visual-hero">
          <div>
            <span className="helix-visual-eyebrow">
              <Network size={16} />

              Mechanism diagram
            </span>

            <h2>
              A visual explanation of the research pathway.
            </h2>

            <p>
              This view converts the research map into a mechanism-style
              diagram. Instead of only showing floating nodes, it shows
              how concepts connect into a possible scientific explanation
              that can be checked against evidence.
            </p>
          </div>

          <aside className="helix-visual-summary-card">
            <span>
              Current investigation
            </span>

            <strong>
              {
                project.title
              }
            </strong>

            <p>
              {
                project.question
              }
            </p>
          </aside>
        </div>

        <div className="helix-visual-layout">
          <section className="helix-visual-model-card">
            <div className="helix-visual-model-toolbar">
              <div>
                <span className="helix-visual-domain">
                  {
                    getDomainIcon(
                      map.domain,
                    )
                  }

                  {
                    map.domain
                  }
                </span>

                <strong>
                  Research mechanism flow
                </strong>
              </div>

              <span>
                Diagram view
              </span>
            </div>

            <div className="helix-mechanism-diagram">
              <div className="helix-mechanism-center">
                <div className="helix-mechanism-core-icon">
                  {
                    focusNode
                      ? getNodeIcon(
                          focusNode.type,
                        )
                      : getDomainIcon(
                          map.domain,
                        )
                  }
                </div>

                <span>
                  Main question
                </span>

                <strong>
                  {
                    map.question
                  }
                </strong>
              </div>

              <div className="helix-mechanism-ring">
                {
                  primaryNodes.map(
                    (
                      node,
                      index,
                    ) => (
                      <article
                        key={
                          node.id
                        }
                        className={`helix-mechanism-node helix-mechanism-node-${index + 1}`}
                      >
                        <div className="helix-mechanism-node-icon">
                          {
                            getNodeIcon(
                              node.type,
                            )
                          }
                        </div>

                        <div>
                          <span>
                            {
                              node.subtitle
                            }
                          </span>

                          <strong>
                            {
                              node.label
                            }
                          </strong>

                          <p>
                            {
                              getEvidenceLabel(
                                node,
                              )
                            }
                          </p>
                        </div>
                      </article>
                    ),
                  )
                }
              </div>

              <svg
                className="helix-mechanism-lines"
                viewBox="0 0 900 620"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M450 310 C210 110, 210 110, 150 150" />
                <path d="M450 310 C690 110, 690 110, 750 150" />
                <path d="M450 310 C150 310, 150 310, 115 310" />
                <path d="M450 310 C785 310, 785 310, 805 310" />
                <path d="M450 310 C210 515, 210 515, 150 480" />
                <path d="M450 310 C690 515, 690 515, 750 480" />
                <path d="M450 310 C450 520, 450 520, 450 540" />
              </svg>
            </div>

            <div className="helix-mechanism-flow-list">
              <h3>
                Relationship pathway
              </h3>

              {
                mechanismEdges.map(
                  (
                    edge,
                    index,
                  ) => {
                    const source =
                      getNodeById(
                        map,
                        edge.sourceId,
                      )

                    const target =
                      getNodeById(
                        map,
                        edge.targetId,
                      )

                    return (
                      <article
                        key={
                          edge.id
                        }
                        className="helix-mechanism-step"
                      >
                        <span>
                          {
                            String(
                              index + 1,
                            ).padStart(
                              2,
                              '0',
                            )
                          }
                        </span>

                        <div>
                          <strong>
                            {
                              source?.label ??
                              edge.sourceId
                            }{' '}
                            →{' '}
                            {
                              target?.label ??
                              edge.targetId
                            }
                          </strong>

                          <p>
                            {
                              edge.explanation ||
                              edge.label
                            }
                          </p>
                        </div>
                      </article>
                    )
                  },
                )
              }
            </div>

            <p className="helix-visual-disclaimer">
              This is a research explanation diagram, not proof of
              causation, diagnosis, treatment effect, or experimental
              validation.
            </p>
          </section>

          <aside className="helix-visual-right-panel">
            <div className="helix-visual-stat-grid">
              <div className="helix-visual-stat">
                <strong>
                  {
                    map.nodes.length
                  }
                </strong>

                <span>
                  Concepts
                </span>
              </div>

              <div className="helix-visual-stat">
                <strong>
                  {
                    map.edges.length
                  }
                </strong>

                <span>
                  Links
                </span>
              </div>

              <div className="helix-visual-stat">
                <strong>
                  {
                    strongCount
                  }
                </strong>

                <span>
                  Strong evidence
                </span>
              </div>

              <div className="helix-visual-stat">
                <strong>
                  {
                    limitedCount
                  }
                </strong>

                <span>
                  Limited evidence
                </span>
              </div>
            </div>

            <div className="helix-visual-concept-card">
              <h3>
                What this diagram shows
              </h3>

              <p>
                The diagram turns the map into an explanation: what the
                central question is, which concepts surround it, and what
                relationships need to be checked in the Evidence tab.
              </p>
            </div>

            <div className="helix-visual-concept-card">
              <h3>
                Diagram layers
              </h3>

              <div className="helix-visual-layer-list">
                {
                  primaryNodes.map(
                    (
                      node,
                    ) => (
                      <article
                        key={
                          node.id
                        }
                        className="helix-visual-layer-item"
                      >
                        <span>
                          {
                            getNodeIcon(
                              node.type,
                            )
                          }
                        </span>

                        <div>
                          <strong>
                            {
                              node.label
                            }
                          </strong>

                          <p>
                            {
                              node.description
                            }
                          </p>
                        </div>
                      </article>
                    ),
                  )
                }
              </div>
            </div>

            <div className="helix-visual-concept-card">
              <h3>
                Next step
              </h3>

              <p>
                Open the map to add more branches, then return here to see
                a richer mechanism diagram.
              </p>

              <button
                type="button"
                className="helix-visual-map-button"
                onClick={
                  onOpenMap
                }
              >
                Return to interactive map

                <ArrowRight size={16} />
              </button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
