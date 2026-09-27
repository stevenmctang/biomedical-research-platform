import {
    AlertTriangle,
    ArrowRight,
    BookOpen,
    CheckCircle2,
    CircleHelp,
    Database,
    FlaskConical,
    Network,
    Search,
    ShieldCheck,
    Sparkles,
  } from 'lucide-react'
  
  import type {
    ResearchEdge,
    ResearchMap,
    ResearchNode,
  } from '../types/researchMap'
  
  import './EvidenceWorkspace.css'
  
  interface EvidenceWorkspaceProps {
    map: ResearchMap
    onOpenMap: () => void
  }
  
  type EvidenceStrength =
    | ResearchNode['evidenceStrength']
    | ResearchEdge['evidenceStrength']
  
  function getEvidenceLabel(
    strength:
      EvidenceStrength,
  ) {
    if (
      !strength ||
      strength ===
        'unknown'
    ) {
      return 'Needs verification'
    }
  
    if (
      strength ===
      'limited'
    ) {
      return 'Limited'
    }
  
    return strength
      .charAt(
        0,
      )
      .toUpperCase() +
      strength.slice(
        1,
      )
  }
  
  function getEvidenceIcon(
    strength:
      EvidenceStrength,
  ) {
    if (
      strength ===
      'strong'
    ) {
      return (
        <CheckCircle2 size={18} />
      )
    }
  
    if (
      strength ===
        'moderate' ||
      strength ===
        'limited'
    ) {
      return (
        <AlertTriangle size={18} />
      )
    }
  
    return (
      <CircleHelp size={18} />
    )
  }
  
  function getEvidenceClass(
    strength:
      EvidenceStrength,
  ) {
    if (
      strength ===
      'strong'
    ) {
      return 'helix-evidence-status-strong'
    }
  
    if (
      strength ===
      'moderate'
    ) {
      return 'helix-evidence-status-moderate'
    }
  
    if (
      strength ===
      'limited'
    ) {
      return 'helix-evidence-status-weak'
    }
  
    return 'helix-evidence-status-unknown'
  }
  
  function filterNodesByEvidence(
    nodes:
      ResearchNode[],
  
    strength:
      ResearchNode['evidenceStrength'],
  ) {
    return nodes.filter(
      (
        node,
      ) =>
        node.type !==
          'question' &&
        node.evidenceStrength ===
          strength,
    )
  }
  
  function getUnknownNodes(
    nodes:
      ResearchNode[],
  ) {
    return nodes.filter(
      (
        node,
      ) =>
        node.type !==
          'question' &&
        (
          !node.evidenceStrength ||
          node.evidenceStrength ===
            'unknown'
        ),
    )
  }
  
  function findNode(
    nodes:
      ResearchNode[],
  
    id:
      string,
  ) {
    return nodes.find(
      (
        node,
      ) =>
        node.id ===
        id,
    )
  }
  
  export function EvidenceWorkspace({
    map,
    onOpenMap,
  }: EvidenceWorkspaceProps) {
    const conceptNodes =
      map.nodes.filter(
        (
          node,
        ) =>
          node.type !==
          'question',
      )
  
    const strongNodes =
      filterNodesByEvidence(
        map.nodes,
        'strong',
      )
  
    const moderateNodes =
      filterNodesByEvidence(
        map.nodes,
        'moderate',
      )
  
    const limitedNodes =
      filterNodesByEvidence(
        map.nodes,
        'limited',
      )
  
    const unknownNodes =
      getUnknownNodes(
        map.nodes,
      )
  
    const verifiableEdges =
      map.edges.slice(
        0,
        10,
      )
  
    const reviewQueue = [
      ...unknownNodes,
      ...limitedNodes,
    ].slice(
      0,
      6,
    )
  
    return (
      <main className="helix-evidence-page">
        <section className="helix-evidence-shell">
          <div className="helix-evidence-hero">
            <div className="helix-evidence-hero-copy">
              <span className="helix-evidence-eyebrow">
                <ShieldCheck size={16} />
  
                Evidence workspace
              </span>
  
              <h2>
                Separate what is supported from what needs review.
              </h2>
  
              <p>
                This workspace is different from the map. It organizes
                concepts into evidence levels, highlights relationship
                claims, and creates a verification queue for anything
                that should be checked against real scientific sources.
              </p>
            </div>
  
            <aside className="helix-evidence-command-card">
              <span>
                Research question
              </span>
  
              <strong>
                {
                  map.question
                }
              </strong>
  
              <button
                type="button"
                onClick={
                  onOpenMap
                }
              >
                Inspect on map
  
                <ArrowRight size={16} />
              </button>
            </aside>
          </div>
  
          <div className="helix-evidence-scoreboard">
            <article className="helix-evidence-score-card helix-score-strong">
              <CheckCircle2 size={21} />
  
              <strong>
                {
                  strongNodes.length
                }
              </strong>
  
              <span>
                Strong evidence
              </span>
            </article>
  
            <article className="helix-evidence-score-card helix-score-moderate">
              <AlertTriangle size={21} />
  
              <strong>
                {
                  moderateNodes.length
                }
              </strong>
  
              <span>
                Moderate evidence
              </span>
            </article>
  
            <article className="helix-evidence-score-card helix-score-weak">
              <FlaskConical size={21} />
  
              <strong>
                {
                  limitedNodes.length
                }
              </strong>
  
              <span>
                Limited evidence
              </span>
            </article>
  
            <article className="helix-evidence-score-card helix-score-review">
              <CircleHelp size={21} />
  
              <strong>
                {
                  unknownNodes.length
                }
              </strong>
  
              <span>
                Needs review
              </span>
            </article>
          </div>
  
          <div className="helix-evidence-layout">
            <section className="helix-evidence-column">
              <div className="helix-evidence-section-heading">
                <div>
                  <span>
                    Concept evidence
                  </span>
  
                  <h3>
                    Evidence by scientific concept
                  </h3>
                </div>
  
                <BookOpen size={20} />
              </div>
  
              <div className="helix-evidence-concept-list">
                {
                  conceptNodes.map(
                    (
                      node,
                    ) => (
                      <article
                        key={
                          node.id
                        }
                        className="helix-evidence-concept-card"
                      >
                        <div className="helix-evidence-concept-top">
                          <div>
                            <strong>
                              {
                                node.label
                              }
                            </strong>
  
                            <span>
                              {
                                node.subtitle
                              }
                            </span>
                          </div>
  
                          <span
                            className={`helix-evidence-status-pill ${getEvidenceClass(
                              node.evidenceStrength,
                            )}`}
                          >
                            {
                              getEvidenceIcon(
                                node.evidenceStrength,
                              )
                            }
  
                            {
                              getEvidenceLabel(
                                node.evidenceStrength,
                              )
                            }
                          </span>
                        </div>
  
                        <p>
                          {
                            node.description
                          }
                        </p>
  
                        <div className="helix-evidence-source-row">
                          <Search size={14} />
  
                          <span>
                            Suggested verification query: “
                            {
                              node.label
                            }{' '}
                            {
                              map.question
                            }
                            ”
                          </span>
                        </div>
                      </article>
                    ),
                  )
                }
              </div>
            </section>
  
            <aside className="helix-evidence-side">
              <div className="helix-evidence-panel-card">
                <div className="helix-evidence-section-heading">
                  <div>
                    <span>
                      Relationship claims
                    </span>
  
                    <h3>
                      What the map is claiming
                    </h3>
                  </div>
  
                  <Network size={20} />
                </div>
  
                <div className="helix-evidence-claim-list">
                  {
                    verifiableEdges.map(
                      (
                        edge,
                      ) => {
                        const source =
                          findNode(
                            map.nodes,
                            edge.sourceId,
                          )
  
                        const target =
                          findNode(
                            map.nodes,
                            edge.targetId,
                          )
  
                        return (
                          <article
                            key={
                              edge.id
                            }
                            className="helix-evidence-claim-card"
                          >
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
  
                            <span
                              className={`helix-evidence-status-pill ${getEvidenceClass(
                                edge.evidenceStrength,
                              )}`}
                            >
                              {
                                getEvidenceLabel(
                                  edge.evidenceStrength,
                                )
                              }
                            </span>
  
                            <p>
                              {
                                edge.explanation
                              }
                            </p>
                          </article>
                        )
                      },
                    )
                  }
                </div>
              </div>
  
              <div className="helix-evidence-panel-card">
                <div className="helix-evidence-section-heading">
                  <div>
                    <span>
                      Verification queue
                    </span>
  
                    <h3>
                      Check these next
                    </h3>
                  </div>
  
                  <Database size={20} />
                </div>
  
                {
                  reviewQueue.length >
                    0
                    ? (
                      <div className="helix-evidence-review-list">
                        {
                          reviewQueue.map(
                            (
                              node,
                            ) => (
                              <article
                                key={
                                  node.id
                                }
                                className="helix-evidence-review-card"
                              >
                                <Sparkles size={16} />
  
                                <div>
                                  <strong>
                                    {
                                      node.label
                                    }
                                  </strong>
  
                                  <p>
                                    Needs stronger source support before
                                    being presented as a confident
                                    research connection.
                                  </p>
                                </div>
                              </article>
                            ),
                          )
                        }
                      </div>
                    )
                    : (
                      <p className="helix-evidence-empty">
                        No limited or unknown concepts are currently in
                        the review queue.
                      </p>
                    )
                }
              </div>
            </aside>
          </div>
        </section>
      </main>
    )
  }
  