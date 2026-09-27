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
        6,
      )
  }
  
  function getCoreNode(
    nodes:
      ResearchNode[],
  ) {
    return (
      nodes.find(
        (
          node,
        ) =>
          node.evidenceStrength ===
          'strong',
      ) ??
      nodes[0] ??
      null
    )
  }
  
  function getOrbitalClass(
    index:
      number,
  ) {
    const classes = [
      'helix-visual-orbital-one',
      'helix-visual-orbital-two',
      'helix-visual-orbital-three',
      'helix-visual-orbital-four',
      'helix-visual-orbital-five',
      'helix-visual-orbital-six',
    ]
  
    return classes[
      index % classes.length
    ]
  }
  
  export function ResearchVisualization({
    project,
    map,
    onOpenMap,
  }: ResearchVisualizationProps) {
    const primaryNodes =
      getPrimaryNodes(
        map,
      )
  
    const coreNode =
      getCoreNode(
        primaryNodes,
      )
  
    const strongCount =
      map.nodes.filter(
        (
          node,
        ) =>
          node.evidenceStrength ===
          'strong',
      ).length
  
    const uncertainCount =
      map.nodes.filter(
        (
          node,
        ) =>
          !node.evidenceStrength ||
          node.evidenceStrength ===
            'unknown',
      ).length
  
    return (
      <main className="helix-visual-page">
        <section className="helix-visual-shell">
          <div className="helix-visual-hero">
            <div>
              <span className="helix-visual-eyebrow">
                <Atom size={16} />
  
                Scientific visualization
              </span>
  
              <h2>
                A 3D-style model of your research question.
              </h2>
  
              <p>
                This view transforms the research map into a spatial
                conceptual model. The center represents the main
                research focus, while orbiting nodes represent related
                mechanisms, evidence areas, and scientific concepts.
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
                    Conceptual mechanism space
                  </strong>
                </div>
  
                <span>
                  Rotating model
                </span>
              </div>
  
              <div className="helix-visual-scene">
                <div className="helix-visual-grid" />
  
                <div className="helix-visual-depth-ring helix-ring-one" />
                <div className="helix-visual-depth-ring helix-ring-two" />
                <div className="helix-visual-depth-ring helix-ring-three" />
  
                <div className="helix-visual-axis helix-axis-horizontal" />
                <div className="helix-visual-axis helix-axis-vertical" />
  
                <div className="helix-visual-core">
                  <div className="helix-visual-core-glow" />
  
                  <div className="helix-visual-core-object">
                    {
                      coreNode
                        ? getNodeIcon(
                            coreNode.type,
                          )
                        : getDomainIcon(
                            map.domain,
                          )
                    }
                  </div>
  
                  <div className="helix-visual-core-label">
                    <span>
                      Main focus
                    </span>
  
                    <strong>
                      {
                        coreNode?.label ??
                        map.question
                      }
                    </strong>
                  </div>
                </div>
  
                {
                  primaryNodes.map(
                    (
                      node,
                      index,
                    ) => (
                      <button
                        key={
                          node.id
                        }
                        type="button"
                        className={`helix-visual-orbital-node ${getOrbitalClass(
                          index,
                        )}`}
                        title={
                          node.label
                        }
                      >
                        <span>
                          {
                            getNodeIcon(
                              node.type,
                            )
                          }
                        </span>
  
                        <strong>
                          {
                            node.label
                          }
                        </strong>
                      </button>
                    ),
                  )
                }
              </div>
  
              <p className="helix-visual-disclaimer">
                This is a visual research model, not proof of causation,
                diagnosis, treatment effect, or experimental validation.
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
                      uncertainCount
                    }
                  </strong>
  
                  <span>
                    Need review
                  </span>
                </div>
              </div>
  
              <div className="helix-visual-concept-card">
                <h3>
                  Model layers
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
                  What this view is for
                </h3>
  
                <p>
                  Use this tab to explain your investigation visually
                  during a demo: central idea, surrounding mechanisms,
                  and the evidence areas that need more research.
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
  