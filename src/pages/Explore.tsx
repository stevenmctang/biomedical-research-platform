import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import type {
  FormEvent,
} from 'react'

import {
  ArrowLeft,
  ArrowRight,
  Atom,
  Beaker,
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  CircleDot,
  Database,
  Dna,
  ExternalLink,
  FlaskConical,
  Home,
  Lightbulb,
  LoaderCircle,
  Network,
  Orbit,
  Search,
  Sparkles,
  X,
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'

import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react'

import type {
  Edge,
  Node,
} from '@xyflow/react'

import dagre from 'dagre'

import '@xyflow/react/dist/style.css'

import {
  generateResearchMap,
} from '../utils/generateResearchMap'

import {
  expandResearchNode,
} from '../utils/expandResearchNode'

import {
  searchPubMed,
} from '../services/pubmed'

import {
  searchOpenAlex,
} from '../server/openalex'

import type {
  PubMedPaper,
} from '../types/pubmed'

import type {
  OpenAlexPaper,
} from '../types/openalex'

import type {
  ResearchEdge,
  ResearchMap,
  ResearchNode,
  ResearchNodeType,
} from '../types/researchMap'

import './Explore.css'


interface FlowNodeData
  extends Record<string, unknown> {
  researchNode: ResearchNode
}


type HelixFlowNode =
  Node<FlowNodeData>

type HelixFlowEdge =
  Edge


type LiteratureSource =
  | 'PubMed'
  | 'OpenAlex'


interface LiteraturePaper {
  id: string

  source: LiteratureSource

  title: string

  authors: string[]

  journal: string

  publicationDate: string

  doi?: string

  abstract?: string

  url: string

  citedByCount?: number

  isOpenAccess?: boolean
}


const exampleQuestions = [
  'What evidence connects SOD1 to ALS?',
  'How does CRISPR-Cas9 work?',
  'Why do lithium-ion batteries degrade?',
  'What are the leading hypotheses for dark matter?',
]


const NODE_WIDTH =
  220

const NODE_HEIGHT =
  82


function getNodeIcon(
  type: ResearchNodeType,
) {
  if (type === 'gene') {
    return (
      <Dna size={19} />
    )
  }

  if (type === 'drug') {
    return (
      <FlaskConical size={19} />
    )
  }

  if (type === 'pathway') {
    return (
      <Network size={19} />
    )
  }

  if (type === 'molecule') {
    return (
      <Beaker size={19} />
    )
  }

  if (type === 'material') {
    return (
      <CircleDot size={19} />
    )
  }

  if (type === 'technology') {
    return (
      <Atom size={19} />
    )
  }

  if (type === 'theory') {
    return (
      <Lightbulb size={19} />
    )
  }

  if (type === 'experiment') {
    return (
      <FlaskConical size={19} />
    )
  }

  if (type === 'paper') {
    return (
      <BookOpen size={19} />
    )
  }

  if (type === 'dataset') {
    return (
      <Database size={19} />
    )
  }

  if (type === 'question') {
    return (
      <Sparkles size={19} />
    )
  }

  if (
    type === 'process' ||
    type === 'mechanism'
  ) {
    return (
      <Network size={19} />
    )
  }

  return (
    <Atom size={19} />
  )
}


function getDomainIcon(
  domain: string,
) {
  if (
    domain.includes('Bio') ||
    domain.includes('Neuro')
  ) {
    return (
      <Brain size={18} />
    )
  }

  if (
    domain.includes('Chem')
  ) {
    return (
      <Beaker size={18} />
    )
  }

  if (
    domain.includes('Astronomy')
  ) {
    return (
      <Orbit size={18} />
    )
  }

  return (
    <Atom size={18} />
  )
}


function createNodeLabel(
  node: ResearchNode,
) {
  return (
    <div className="helix-flow-node-inner">
      <span className="helix-flow-node-icon">
        {
          getNodeIcon(
            node.type,
          )
        }
      </span>

      <span className="helix-flow-node-copy">
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
    </div>
  )
}


function layoutGraph(
  map: ResearchMap,
) {
  const graph =
    new dagre.graphlib.Graph()

  graph.setDefaultEdgeLabel(
    () => ({}),
  )

  graph.setGraph({
    rankdir: 'LR',
    ranksep: 125,
    nodesep: 75,
    edgesep: 30,
    marginx: 60,
    marginy: 60,
  })


  map.nodes.forEach(
    (
      researchNode,
    ) => {
      graph.setNode(
        researchNode.id,
        {
          width:
            researchNode.type ===
            'question'
              ? 285
              : NODE_WIDTH,

          height:
            researchNode.type ===
            'question'
              ? 95
              : NODE_HEIGHT,
        },
      )
    },
  )


  map.edges.forEach(
    (
      edge,
    ) => {
      graph.setEdge(
        edge.sourceId,
        edge.targetId,
      )
    },
  )


  dagre.layout(
    graph,
  )


  const nodes:
    HelixFlowNode[] =
      map.nodes.map(
        (
          researchNode,
        ) => {
          const position =
            graph.node(
              researchNode.id,
            )

          const width =
            researchNode.type ===
            'question'
              ? 285
              : NODE_WIDTH

          const height =
            researchNode.type ===
            'question'
              ? 95
              : NODE_HEIGHT


          return {
            id:
              researchNode.id,

            position: {
              x:
                position.x -
                width / 2,

              y:
                position.y -
                height / 2,
            },

            data: {
              researchNode,

              label:
                createNodeLabel(
                  researchNode,
                ),
            },

            className:
              [
                'helix-flow-node',

                `helix-flow-node-${researchNode.type}`,

                typeof researchNode
                  .metadata
                  ?.expandedFrom ===
                  'string'
                  ? 'helix-flow-node-expanded'
                  : '',
              ]
                .filter(
                  Boolean,
                )
                .join(
                  ' ',
                ),

            style: {
              width,

              minHeight:
                height,
            },
          }
        },
      )


  const edges:
    HelixFlowEdge[] =
      map.edges.map(
        (
          edge,
        ) => ({
          id:
            edge.id,

          source:
            edge.sourceId,

          target:
            edge.targetId,

          label:
            edge.label,

          type:
            'smoothstep',

          markerEnd: {
            type:
              MarkerType.ArrowClosed,

            width:
              13,

            height:
              13,

            color:
              '#a8ada4',
          },

          style: {
            stroke:
              '#b8bcb4',

            strokeWidth:
              1.35,
          },

          labelStyle: {
            fontSize:
              11,

            fontWeight:
              600,

            fill:
              '#60665d',
          },

          labelBgStyle: {
            fill:
              '#f8f7f2',

            fillOpacity:
              0.96,
          },

          labelBgPadding: [
            7,
            5,
          ],

          labelBgBorderRadius:
            6,
        }),
      )


  return {
    nodes,
    edges,
  }
}


function getEvidenceLabel(
  strength:
    ResearchNode['evidenceStrength'],
) {
  if (
    !strength ||
    strength === 'unknown'
  ) {
    return 'Not yet evaluated'
  }

  return (
    strength
      .charAt(0)
      .toUpperCase() +
    strength.slice(1)
  )
}


function getLiteratureSource(
  node: ResearchNode,
): LiteratureSource {
  const pubMedDomains = [
    'Biomedical Science',
    'Biology',
    'Neuroscience',
  ]

  return pubMedDomains.includes(
    node.domain,
  )
    ? 'PubMed'
    : 'OpenAlex'
}


function buildLiteratureQuery(
  node: ResearchNode,
  map: ResearchMap,
) {
  const label =
    node.label.trim()

  const question =
    map.question.trim()


  if (
    question
      .toLowerCase()
      .includes(
        label.toLowerCase(),
      )
  ) {
    return question
  }


  return `${label} ${question}`
}


function mapPubMedPaper(
  paper: PubMedPaper,
): LiteraturePaper {
  return {
    id:
      paper.pmid,

    source:
      'PubMed',

    title:
      paper.title,

    authors:
      paper.authors,

    journal:
      paper.journal,

    publicationDate:
      paper.publicationDate,

    doi:
      paper.doi,

    abstract:
      paper.abstract,

    url:
      paper.url,
  }
}


function mapOpenAlexPaper(
  paper: OpenAlexPaper,
): LiteraturePaper {
  return {
    id:
      paper.id,

    source:
      'OpenAlex',

    title:
      paper.title,

    authors:
      paper.authors,

    journal:
      paper.source,

    publicationDate:
      paper.publicationDate ||
      (
        paper.publicationYear
          ? String(
              paper.publicationYear,
            )
          : ''
      ),

    doi:
      paper.doi,

    abstract:
      paper.abstract,

    url:
      paper.url,

    citedByCount:
      paper.citedByCount,

    isOpenAccess:
      paper.isOpenAccess,
  }
}


export function Explore() {
  const [
    input,
    setInput,
  ] =
    useState('')


  const [
    researchMap,
    setResearchMap,
  ] =
    useState<
      ResearchMap | null
    >(null)


  if (!researchMap) {
    return (
      <QuestionScreen
        input={
          input
        }
        setInput={
          setInput
        }
        onSubmit={
          (
            question,
          ) => {
            const cleaned =
              question.trim()


            if (!cleaned) {
              return
            }


            setInput(
              cleaned,
            )


            setResearchMap(
              generateResearchMap(
                cleaned,
              ),
            )
          }
        }
      />
    )
  }


  return (
    <ReactFlowProvider>
      <ResearchWorkspace
        researchMap={
          researchMap
        }
        setResearchMap={
          setResearchMap
        }
        resetResearch={
          () => {
            setResearchMap(
              null,
            )

            setInput(
              '',
            )
          }
        }
      />
    </ReactFlowProvider>
  )
}


interface QuestionScreenProps {
  input: string

  setInput:
    (
      value: string,
    ) => void

  onSubmit:
    (
      question: string,
    ) => void
}


function QuestionScreen({
  input,
  setInput,
  onSubmit,
}: QuestionScreenProps) {
  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    onSubmit(
      input,
    )
  }


  return (
    <div className="helix-question-page">
      <header className="helix-question-nav">
        <Link
          to="/"
          className="helix-wordmark"
        >
          Helix
        </Link>

        <div className="helix-question-nav-actions">
          <Link
            to="/hypotheses"
            className="helix-nav-text-link"
          >
            Hypotheses
          </Link>

          <span className="helix-nav-divider" />

          <span className="helix-nav-product">
            Research Explorer
          </span>
        </div>
      </header>


      <main className="helix-question-main">
        <div className="helix-question-orbit helix-orbit-one" />

        <div className="helix-question-orbit helix-orbit-two" />


        <section className="helix-question-content">
          <div className="helix-question-eyebrow">
            <Sparkles size={15} />

            Scientific Research Intelligence
          </div>

          <h1>
            What are you
            <br />
            researching?
          </h1>

          <p className="helix-question-intro">
            Ask a scientific question and
            explore the concepts,
            mechanisms, evidence, and
            research behind it.
          </p>


          <form
            className="helix-primary-question-form"
            onSubmit={
              handleSubmit
            }
          >
            <Search size={23} />

            <input
              autoFocus
              value={
                input
              }
              onChange={
                (
                  event,
                ) =>
                  setInput(
                    event.target.value,
                  )
              }
              placeholder="Ask any scientific research question..."
            />

            <button
              type="submit"
              aria-label="Explore research"
            >
              <ArrowRight size={20} />
            </button>
          </form>


          <div className="helix-example-area">
            <span>
              Explore an example
            </span>

            <div className="helix-example-buttons">
              {
                exampleQuestions.map(
                  (
                    question,
                  ) => (
                    <button
                      key={
                        question
                      }
                      type="button"
                      onClick={
                        () =>
                          onSubmit(
                            question,
                          )
                      }
                    >
                      {
                        question
                      }

                      <ChevronRight size={14} />
                    </button>
                  ),
                )
              }
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}


interface ResearchWorkspaceProps {
  researchMap: ResearchMap

  setResearchMap:
    (
      map:
        ResearchMap | null,
    ) => void

  resetResearch:
    () => void
}


function ResearchWorkspace({
  researchMap,
  setResearchMap,
  resetResearch,
}: ResearchWorkspaceProps) {
  const {
    fitView,
  } =
    useReactFlow()


  const initialFlow =
    useMemo(
      () =>
        layoutGraph(
          researchMap,
        ),
      [researchMap],
    )


  const [
    nodes,
    setNodes,
    onNodesChange,
  ] =
    useNodesState(
      initialFlow.nodes,
    )


  const [
    edges,
    setEdges,
    onEdgesChange,
  ] =
    useEdgesState(
      initialFlow.edges,
    )


  const [
    selectedNodeId,
    setSelectedNodeId,
  ] =
    useState<
      string | null
    >(
      null,
    )


  const [
    selectedEdgeId,
    setSelectedEdgeId,
  ] =
    useState<
      string | null
    >(
      null,
    )


  const [
    expandedNodeIds,
    setExpandedNodeIds,
  ] =
    useState<
      Set<string>
    >(
      new Set(),
    )


  const selectedNode =
    useMemo(
      () =>
        researchMap.nodes.find(
          (
            node,
          ) =>
            node.id ===
            selectedNodeId,
        ) ??
        null,
      [
        researchMap,
        selectedNodeId,
      ],
    )


  const selectedEdge =
    useMemo(
      () =>
        researchMap.edges.find(
          (
            edge,
          ) =>
            edge.id ===
            selectedEdgeId,
        ) ??
        null,
      [
        researchMap,
        selectedEdgeId,
      ],
    )


  useEffect(
    () => {
      const flow =
        layoutGraph(
          researchMap,
        )

      setNodes(
        flow.nodes,
      )

      setEdges(
        flow.edges,
      )


      window.setTimeout(
        () => {
          fitView({
            padding:
              0.2,

            duration:
              650,

            maxZoom:
              1.05,
          })
        },
        80,
      )
    },
    [
      researchMap,
      fitView,
      setEdges,
      setNodes,
    ],
  )


  const expandNode =
    useCallback(
      (
        node:
          ResearchNode,
      ) => {
        if (
          expandedNodeIds.has(
            node.id,
          )
        ) {
          return
        }


        const expansion =
          expandResearchNode(
            node,
          )


        const existingNodeIds =
          new Set(
            researchMap.nodes.map(
              (
                existing,
              ) =>
                existing.id,
            ),
          )


        const existingEdgeIds =
          new Set(
            researchMap.edges.map(
              (
                edge,
              ) =>
                edge.id,
            ),
          )


        const newNodes =
          expansion.nodes.filter(
            (
              candidate,
            ) =>
              !existingNodeIds.has(
                candidate.id,
              ),
          )


        const newEdges =
          expansion.edges.filter(
            (
              candidate,
            ) =>
              !existingEdgeIds.has(
                candidate.id,
              ),
          )


        setExpandedNodeIds(
          (
            previous,
          ) => {
            const next =
              new Set(
                previous,
              )

            next.add(
              node.id,
            )

            return next
          },
        )


        setResearchMap({
          ...researchMap,

          nodes: [
            ...researchMap.nodes,
            ...newNodes,
          ],

          edges: [
            ...researchMap.edges,
            ...newEdges,
          ],
        })
      },
      [
        expandedNodeIds,
        researchMap,
        setResearchMap,
      ],
    )


  function selectNode(
    id: string,
  ) {
    setSelectedEdgeId(
      null,
    )

    setSelectedNodeId(
      id,
    )
  }


  function selectEdge(
    id: string,
  ) {
    setSelectedNodeId(
      null,
    )

    setSelectedEdgeId(
      id,
    )
  }


  function clearSelection() {
    setSelectedNodeId(
      null,
    )

    setSelectedEdgeId(
      null,
    )
  }


  return (
    <div className="helix-workspace">
      <header className="helix-workspace-header">
        <div className="helix-workspace-header-left">
          <Link
            to="/"
            className="helix-wordmark"
          >
            Helix
          </Link>

          <span className="helix-workspace-divider" />

          <button
            type="button"
            className="helix-new-question"
            onClick={
              resetResearch
            }
          >
            <ArrowLeft size={17} />

            New question
          </button>
        </div>


        <div className="helix-workspace-question">
          <Sparkles size={16} />

          <span>
            {
              researchMap.question
            }
          </span>
        </div>


        <div className="helix-workspace-header-right">
          <Link
            to="/"
            className="helix-header-text-button"
          >
            <Home size={17} />

            Home
          </Link>

          <Link
            to="/hypotheses"
            className="helix-header-text-button"
          >
            <Lightbulb size={17} />

            Hypotheses
          </Link>
        </div>
      </header>


      <main
        className={
          selectedNode ||
          selectedEdge
            ? 'helix-map-workspace helix-map-workspace-inspecting'
            : 'helix-map-workspace'
        }
      >
        <section className="helix-map-area">
          <div className="helix-map-toolbar">
            <div>
              <span className="helix-map-domain">
                {
                  getDomainIcon(
                    researchMap.domain,
                  )
                }

                {
                  researchMap.domain
                }
              </span>

              <span className="helix-map-count">
                {
                  researchMap.nodes.length
                }{' '}
                concepts

                <i />

                {
                  researchMap.edges.length
                }{' '}
                relationships
              </span>
            </div>

            <span className="helix-map-instruction">
              Drag to move · Scroll to zoom · Click to explore
            </span>
          </div>


          <div className="helix-react-flow-wrapper">
            <ReactFlow
              nodes={
                nodes
              }
              edges={
                edges
              }
              onNodesChange={
                onNodesChange
              }
              onEdgesChange={
                onEdgesChange
              }
              onNodeClick={
                (
                  _event,
                  node,
                ) =>
                  selectNode(
                    node.id,
                  )
              }
              onEdgeClick={
                (
                  _event,
                  edge,
                ) =>
                  selectEdge(
                    edge.id,
                  )
              }
              onPaneClick={
                clearSelection
              }
              fitView
              fitViewOptions={{
                padding:
                  0.2,

                maxZoom:
                  1.05,
              }}
              minZoom={
                0.2
              }
              maxZoom={
                1.8
              }
              panOnDrag
              zoomOnScroll
              zoomOnPinch
              zoomOnDoubleClick={
                false
              }
              nodesDraggable
              nodesConnectable={
                false
              }
              elementsSelectable
              proOptions={{
                hideAttribution:
                  true,
              }}
            >
              <Background
                variant={
                  BackgroundVariant.Dots
                }
                gap={
                  24
                }
                size={
                  1
                }
                color="#d9dcd5"
              />

              <Controls
                position="bottom-left"
                showInteractive={
                  false
                }
              />
            </ReactFlow>


            <div className="helix-map-help">
              <span>
                Drag canvas
              </span>

              <span>
                Scroll to zoom
              </span>

              <button
                type="button"
                onClick={
                  () =>
                    fitView({
                      padding:
                        0.2,

                      duration:
                        650,

                      maxZoom:
                        1.05,
                    })
                }
              >
                Fit map
              </button>
            </div>
          </div>
        </section>


        {
          (
            selectedNode ||
            selectedEdge
          ) && (
            <aside className="helix-research-inspector">
              {
                selectedNode && (
                  <NodeInspector
                    node={
                      selectedNode
                    }
                    map={
                      researchMap
                    }
                    isExpanded={
                      expandedNodeIds.has(
                        selectedNode.id,
                      )
                    }
                    onClose={
                      clearSelection
                    }
                    onOpenNode={
                      selectNode
                    }
                    onExpand={
                      () =>
                        expandNode(
                          selectedNode,
                        )
                    }
                  />
                )
              }


              {
                selectedEdge && (
                  <EdgeInspector
                    edge={
                      selectedEdge
                    }
                    map={
                      researchMap
                    }
                    onClose={
                      clearSelection
                    }
                    onOpenNode={
                      selectNode
                    }
                  />
                )
              }
            </aside>
          )
        }
      </main>
    </div>
  )
}


interface NodeInspectorProps {
  node: ResearchNode

  map: ResearchMap

  isExpanded: boolean

  onClose:
    () => void

  onOpenNode:
    (
      id: string,
    ) => void

  onExpand:
    () => void
}


function NodeInspector({
  node,
  map,
  isExpanded,
  onClose,
  onOpenNode,
  onExpand,
}: NodeInspectorProps) {
  const [
    papers,
    setPapers,
  ] =
    useState<
      LiteraturePaper[]
    >(
      [],
    )


  const [
    loadingPapers,
    setLoadingPapers,
  ] =
    useState(
      false,
    )


  const [
    paperError,
    setPaperError,
  ] =
    useState<
      string | null
    >(
      null,
    )


  const connections =
    map.edges.filter(
      (
        edge,
      ) =>
        edge.sourceId ===
          node.id ||
        edge.targetId ===
          node.id,
    )


  const literatureSource =
    getLiteratureSource(
      node,
    )


  useEffect(
    () => {
      let cancelled =
        false


      if (
        node.type ===
        'question'
      ) {
        setPapers(
          [],
        )

        setPaperError(
          null,
        )

        setLoadingPapers(
          false,
        )

        return
      }


      async function loadLiterature() {
        setLoadingPapers(
          true,
        )

        setPaperError(
          null,
        )

        setPapers(
          [],
        )


        try {
          const query =
            buildLiteratureQuery(
              node,
              map,
            )


          if (
            literatureSource ===
            'PubMed'
          ) {
            const result =
              await searchPubMed(
                query,
                5,
              )


            if (
              cancelled
            ) {
              return
            }


            setPapers(
              result.papers.map(
                mapPubMedPaper,
              ),
            )
          } else {
            const result =
              await searchOpenAlex(
                query,
                5,
              )


            if (
              cancelled
            ) {
              return
            }


            setPapers(
              result.papers.map(
                mapOpenAlexPaper,
              ),
            )
          }
        } catch (
          error
        ) {
          if (
            cancelled
          ) {
            return
          }


          setPaperError(
            error instanceof
              Error
              ? error.message
              : 'Literature retrieval failed.',
          )
        } finally {
          if (
            !cancelled
          ) {
            setLoadingPapers(
              false,
            )
          }
        }
      }


      loadLiterature()


      return () => {
        cancelled =
          true
      }
    },
    [
      node.id,
      node.label,
      node.type,
      map.question,
      literatureSource,
    ],
  )


  return (
    <div className="helix-inspector-content">
      <div className="helix-inspector-header">
        <div className="helix-inspector-type">
          <span>
            {
              getNodeIcon(
                node.type,
              )
            }
          </span>

          {
            node.subtitle
          }
        </div>

        <button
          type="button"
          onClick={
            onClose
          }
          aria-label="Close inspector"
        >
          <X size={18} />
        </button>
      </div>


      <div className="helix-inspector-title">
        <h2>
          {
            node.label
          }
        </h2>

        <span>
          {
            node.domain
          }
        </span>
      </div>


      <p className="helix-inspector-description">
        {
          node.description
        }
      </p>


      <div className="helix-inspector-section">
        <span className="helix-inspector-section-label">
          Evidence
        </span>

        <div className="helix-evidence-status">
          <span
            className={
              `helix-evidence-dot helix-evidence-${node.evidenceStrength ?? 'unknown'}`
            }
          />

          <strong>
            {
              getEvidenceLabel(
                node.evidenceStrength,
              )
            }
          </strong>
        </div>
      </div>


      {
        connections.length >
          0 && (
          <div className="helix-inspector-section">
            <span className="helix-inspector-section-label">
              Related concepts
            </span>

            <div className="helix-related-connections">
              {
                connections.map(
                  (
                    edge,
                  ) => {
                    const otherId =
                      edge.sourceId ===
                      node.id
                        ? edge.targetId
                        : edge.sourceId

                    const related =
                      map.nodes.find(
                        (
                          candidate,
                        ) =>
                          candidate.id ===
                          otherId,
                      )


                    if (
                      !related
                    ) {
                      return null
                    }


                    return (
                      <button
                        key={
                          edge.id
                        }
                        type="button"
                        onClick={
                          () =>
                            onOpenNode(
                              related.id,
                            )
                        }
                      >
                        <span>
                          {
                            edge.label
                          }
                        </span>

                        <strong>
                          {
                            related.label
                          }
                        </strong>

                        <ChevronRight size={16} />
                      </button>
                    )
                  },
                )
              }
            </div>
          </div>
        )
      }


      {
        node.type !==
          'question' && (
          <div className="helix-inspector-section">
            <div className="helix-literature-heading">
              <div>
                <span className="helix-inspector-section-label">
                  Scientific literature
                </span>

                <p>
                  Live results from {
                    literatureSource
                  }.
                </p>
              </div>

              <BookOpen size={18} />
            </div>


            {
              loadingPapers && (
                <div className="helix-literature-loading">
                  <LoaderCircle
                    size={18}
                    className="helix-spinner"
                  />

                  Searching {
                    literatureSource
                  }...
                </div>
              )
            }


            {
              paperError && (
                <div className="helix-literature-error">
                  {
                    paperError
                  }
                </div>
              )
            }


            {
              !loadingPapers &&
              !paperError &&
              papers.length ===
                0 && (
                <div className="helix-literature-empty">
                  No matching literature
                  was returned.
                </div>
              )
            }


            {
              papers.length >
                0 && (
                <div className="helix-literature-list">
                  {
                    papers.map(
                      (
                        paper,
                      ) => (
                        <article
                          key={
                            `${paper.source}-${paper.id}`
                          }
                          className="helix-paper-card"
                        >
                          <div className="helix-paper-meta">
                            <span className="helix-source-badge">
                              {
                                paper.source
                              }
                            </span>

                            {
                              paper.publicationDate && (
                                <span>
                                  {
                                    paper.publicationDate
                                  }
                                </span>
                              )
                            }

                            {
                              typeof paper.citedByCount ===
                                'number' && (
                                <span>
                                  {
                                    paper.citedByCount
                                  } citations
                                </span>
                              )
                            }
                          </div>


                          <h4>
                            {
                              paper.title
                            }
                          </h4>


                          {
                            paper.journal && (
                              <p className="helix-paper-journal">
                                {
                                  paper.journal
                                }
                              </p>
                            )
                          }


                          {
                            paper.authors.length >
                              0 && (
                              <p className="helix-paper-authors">
                                {
                                  paper.authors
                                    .slice(
                                      0,
                                      3,
                                    )
                                    .join(
                                      ', ',
                                    )
                                }

                                {
                                  paper.authors.length >
                                    3
                                    ? ' et al.'
                                    : ''
                                }
                              </p>
                            )
                          }


                          {
                            paper.abstract && (
                              <p className="helix-paper-abstract">
                                {
                                  paper.abstract.length >
                                  300
                                    ? `${paper.abstract.slice(
                                        0,
                                        300,
                                      )}…`
                                    : paper.abstract
                                }
                              </p>
                            )
                          }


                          <div className="helix-paper-actions">
                            <div>
                              {
                                paper.doi && (
                                  <span>
                                    DOI {
                                      paper.doi
                                    }
                                  </span>
                                )
                              }

                              {
                                paper.isOpenAccess && (
                                  <span className="helix-open-access">
                                    Open access
                                  </span>
                                )
                              }
                            </div>

                            <a
                              href={
                                paper.url
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              View source

                              <ExternalLink size={12} />
                            </a>
                          </div>
                        </article>
                      ),
                    )
                  }
                </div>
              )
            }
          </div>
        )
      }


      {
        node.type !==
          'question' && (
          <div className="helix-inspector-action-area">
            <button
              type="button"
              className={
                isExpanded
                  ? 'helix-expand-button helix-expand-button-complete'
                  : 'helix-expand-button'
              }
              disabled={
                isExpanded
              }
              onClick={
                onExpand
              }
            >
              {
                isExpanded
                  ? (
                    <>
                      <Check size={17} />

                      Explored
                    </>
                  )
                  : (
                    <>
                      <Sparkles size={17} />

                      Explore this concept

                      <ArrowRight size={15} />
                    </>
                  )
              }
            </button>

            <p>
              {
                isExpanded
                  ? 'Related research branches have been added to the canvas.'
                  : 'Reveal related mechanisms, evidence, and research directions.'
              }
            </p>
          </div>
        )
      }
    </div>
  )
}


interface EdgeInspectorProps {
  edge: ResearchEdge

  map: ResearchMap

  onClose:
    () => void

  onOpenNode:
    (
      id: string,
    ) => void
}


function EdgeInspector({
  edge,
  map,
  onClose,
  onOpenNode,
}: EdgeInspectorProps) {
  const source =
    map.nodes.find(
      (
        node,
      ) =>
        node.id ===
        edge.sourceId,
    )


  const target =
    map.nodes.find(
      (
        node,
      ) =>
        node.id ===
        edge.targetId,
    )


  return (
    <div className="helix-inspector-content">
      <div className="helix-inspector-header">
        <div className="helix-inspector-type">
          <span>
            <Network size={18} />
          </span>

          Relationship
        </div>

        <button
          type="button"
          onClick={
            onClose
          }
          aria-label="Close inspector"
        >
          <X size={18} />
        </button>
      </div>


      <div className="helix-edge-pair">
        <button
          type="button"
          onClick={
            () => {
              if (
                source
              ) {
                onOpenNode(
                  source.id,
                )
              }
            }
          }
        >
          {
            source?.label
          }
        </button>

        <span>
          {
            edge.label
          }
        </span>

        <button
          type="button"
          onClick={
            () => {
              if (
                target
              ) {
                onOpenNode(
                  target.id,
                )
              }
            }
          }
        >
          {
            target?.label
          }
        </button>
      </div>


      <div className="helix-inspector-section">
        <span className="helix-inspector-section-label">
          Why they are connected
        </span>

        <p className="helix-edge-explanation">
          {
            edge.explanation
          }
        </p>
      </div>


      <div className="helix-inspector-section">
        <span className="helix-inspector-section-label">
          Evidence
        </span>

        <div className="helix-evidence-status">
          <span
            className={
              `helix-evidence-dot helix-evidence-${edge.evidenceStrength}`
            }
          />

          <strong>
            {
              edge.evidenceStrength ===
              'unknown'
                ? 'Awaiting source verification'
                : edge.evidenceStrength
            }
          </strong>
        </div>
      </div>
    </div>
  )
}
