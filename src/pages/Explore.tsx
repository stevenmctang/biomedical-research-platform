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
  FolderKanban,
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
  useNavigate,
  useParams,
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

import type {
  PubMedPaper,
} from '../types/pubmed'

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

type WorkspaceView =
  | 'map'
  | 'visualize'
  | 'evidence'

interface StoredResearchProject {
  version: 1
  id: string
  title: string
  question: string
  researchMap: ResearchMap
  expandedNodeIds: string[]
  createdAt: string
  updatedAt: string
}

const PROJECTS_KEY =
  'helix.researchProjects.v1'

const ACTIVE_PROJECT_ID_KEY =
  'helix.activeProjectId.v1'

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

function canUseStorage() {
  return (
    typeof window !== 'undefined' &&
    typeof window.localStorage !== 'undefined'
  )
}

function makeProjectId() {
  if (
    typeof crypto !== 'undefined' &&
    'randomUUID' in crypto
  ) {
    return crypto.randomUUID()
  }

  return `project-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`
}

function makeProjectTitle(
  question:
    string,
) {
  const cleaned =
    question.trim()

  if (
    cleaned.length <=
    72
  ) {
    return cleaned
  }

  return `${cleaned.slice(
    0,
    69,
  )}...`
}

function readProjects() {
  if (
    !canUseStorage()
  ) {
    return []
  }

  try {
    const raw =
      window.localStorage.getItem(
        PROJECTS_KEY,
      )

    if (
      !raw
    ) {
      return []
    }

    const parsed =
      JSON.parse(
        raw,
      ) as StoredResearchProject[]

    if (
      !Array.isArray(
        parsed,
      )
    ) {
      return []
    }

    return parsed.filter(
      (
        project,
      ): project is StoredResearchProject =>
        Boolean(
          project,
        ) &&
        project.version ===
          1 &&
        typeof project.id ===
          'string' &&
        Boolean(
          project.researchMap,
        ),
    )
  } catch {
    return []
  }
}

function writeProjects(
  projects:
    StoredResearchProject[],
) {
  if (
    !canUseStorage()
  ) {
    return
  }

  window.localStorage.setItem(
    PROJECTS_KEY,
    JSON.stringify(
      projects,
    ),
  )
}

function getProject(
  projectId:
    string,
) {
  return (
    readProjects().find(
      (
        project,
      ) =>
        project.id ===
        projectId,
    ) ??
    null
  )
}

function setActiveProjectId(
  projectId:
    string,
) {
  if (
    !canUseStorage()
  ) {
    return
  }

  window.localStorage.setItem(
    ACTIVE_PROJECT_ID_KEY,
    projectId,
  )
}

function clearActiveProjectId() {
  if (
    !canUseStorage()
  ) {
    return
  }

  window.localStorage.removeItem(
    ACTIVE_PROJECT_ID_KEY,
  )
}

function createProject(
  map:
    ResearchMap,
) {
  const now =
    new Date().toISOString()

  const project:
    StoredResearchProject = {
      version:
        1,

      id:
        makeProjectId(),

      title:
        makeProjectTitle(
          map.question,
        ),

      question:
        map.question,

      researchMap:
        map,

      expandedNodeIds:
        [],

      createdAt:
        now,

      updatedAt:
        now,
    }

  const projects =
    readProjects()

  writeProjects([
    project,
    ...projects,
  ])

  setActiveProjectId(
    project.id,
  )

  return project
}

function saveProject({
  projectId,
  map,
  expandedNodeIds,
}: {
  projectId:
    string

  map:
    ResearchMap

  expandedNodeIds:
    string[]
}) {
  const projects =
    readProjects()

  const existingProject =
    projects.find(
      (
        project,
      ) =>
        project.id ===
        projectId,
    )

  if (
    !existingProject
  ) {
    return null
  }

  const updatedProject:
    StoredResearchProject = {
      ...existingProject,

      question:
        map.question,

      researchMap:
        map,

      expandedNodeIds,

      updatedAt:
        new Date().toISOString(),
    }

  writeProjects(
    projects.map(
      (
        project,
      ) =>
        project.id ===
        projectId
          ? updatedProject
          : project,
    ),
  )

  return updatedProject
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
      <Dna size={19} />
    )
  }

  if (
    type ===
    'drug'
  ) {
    return (
      <FlaskConical size={19} />
    )
  }

  if (
    type ===
    'pathway'
  ) {
    return (
      <Network size={19} />
    )
  }

  if (
    type ===
    'molecule'
  ) {
    return (
      <Beaker size={19} />
    )
  }

  if (
    type ===
    'material'
  ) {
    return (
      <CircleDot size={19} />
    )
  }

  if (
    type ===
    'technology'
  ) {
    return (
      <Atom size={19} />
    )
  }

  if (
    type ===
    'theory'
  ) {
    return (
      <Lightbulb size={19} />
    )
  }

  if (
    type ===
    'experiment'
  ) {
    return (
      <FlaskConical size={19} />
    )
  }

  if (
    type ===
    'paper'
  ) {
    return (
      <BookOpen size={19} />
    )
  }

  if (
    type ===
    'dataset'
  ) {
    return (
      <Database size={19} />
    )
  }

  if (
    type ===
    'question'
  ) {
    return (
      <Sparkles size={19} />
    )
  }

  if (
    type ===
      'process' ||
    type ===
      'mechanism'
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
      <Brain size={18} />
    )
  }

  if (
    domain.includes(
      'Chem',
    )
  ) {
    return (
      <Beaker size={18} />
    )
  }

  if (
    domain.includes(
      'Astronomy',
    )
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
  node:
    ResearchNode,
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
  map:
    ResearchMap,
) {
  const graph =
    new dagre.graphlib.Graph()

  graph.setDefaultEdgeLabel(
    () => ({}),
  )

  graph.setGraph({
    rankdir:
      'LR',

    ranksep:
      125,

    nodesep:
      75,

    edgesep:
      30,

    marginx:
      60,

    marginy:
      60,
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
    strength ===
      'unknown'
  ) {
    return 'Not yet evaluated'
  }

  return (
    strength
      .charAt(
        0,
      )
      .toUpperCase() +
    strength.slice(
      1,
    )
  )
}

function shouldSearchPubMed(
  node:
    ResearchNode,
) {
  const biomedicalDomains = [
    'Biomedical Science',
    'Biology',
    'Neuroscience',
  ]

  return (
    biomedicalDomains.includes(
      node.domain,
    ) &&
    node.type !==
      'question'
  )
}

function buildPubMedQuery(
  node:
    ResearchNode,

  map:
    ResearchMap,
) {
  const question =
    map.question.trim()

  const label =
    node.label.trim()

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

function getUnverifiedEvidenceCount(
  map:
    ResearchMap,
) {
  return map.nodes.filter(
    (
      node,
    ) =>
      !node.evidenceStrength ||
      node.evidenceStrength ===
        'unknown',
  ).length
}

export function Explore() {
  const navigate =
    useNavigate()

  const {
    projectId,
  } =
    useParams<{
      projectId:
        string
    }>()

  const loadedProject =
    useMemo(
      () => {
        if (
          !projectId
        ) {
          return null
        }

        return getProject(
          projectId,
        )
      },
      [
        projectId,
      ],
    )

  const [
    input,
    setInput,
  ] =
    useState(
      loadedProject?.question ??
        '',
    )

  const [
    researchMap,
    setResearchMap,
  ] =
    useState<
      ResearchMap | null
    >(
      loadedProject?.researchMap ??
        null,
    )

  const [
    activeProject,
    setActiveProject,
  ] =
    useState<
      StoredResearchProject | null
    >(
      loadedProject,
    )

  const [
    expandedNodeIds,
    setExpandedNodeIds,
  ] =
    useState<
      string[]
    >(
      loadedProject?.expandedNodeIds ??
        [],
    )

  useEffect(
    () => {
      if (
        projectId
      ) {
        const project =
          getProject(
            projectId,
          )

        if (
          !project
        ) {
          clearActiveProjectId()

          navigate(
            '/projects',
            {
              replace:
                true,
            },
          )

          return
        }

        setActiveProjectId(
          project.id,
        )

        setActiveProject(
          project,
        )

        setResearchMap(
          project.researchMap,
        )

        setExpandedNodeIds(
          project.expandedNodeIds,
        )

        setInput(
          project.question,
        )

        return
      }

      setActiveProject(
        null,
      )

      setResearchMap(
        null,
      )

      setExpandedNodeIds(
        [],
      )

      setInput(
        '',
      )

      clearActiveProjectId()
    },
    [
      projectId,
      navigate,
    ],
  )

  useEffect(
    () => {
      if (
        !activeProject ||
        !researchMap
      ) {
        return
      }

      const timeout =
        window.setTimeout(
          () => {
            const saved =
              saveProject({
                projectId:
                  activeProject.id,

                map:
                  researchMap,

                expandedNodeIds,
              })

            if (
              saved
            ) {
              setActiveProject(
                saved,
              )
            }
          },
          250,
        )

      return () => {
        window.clearTimeout(
          timeout,
        )
      }
    },
    [
      activeProject?.id,
      researchMap,
      expandedNodeIds,
    ],
  )

  function startResearch(
    question:
      string,
  ) {
    const cleaned =
      question.trim()

    if (
      !cleaned
    ) {
      return
    }

    const map =
      generateResearchMap(
        cleaned,
      )

    const project =
      createProject(
        map,
      )

    setInput(
      cleaned,
    )

    setResearchMap(
      map,
    )

    setActiveProject(
      project,
    )

    setExpandedNodeIds(
      [],
    )

    navigate(
      `/explore/${project.id}`,
      {
        replace:
          true,
      },
    )
  }

  function resetResearch() {
    clearActiveProjectId()

    setActiveProject(
      null,
    )

    setResearchMap(
      null,
    )

    setExpandedNodeIds(
      [],
    )

    setInput(
      '',
    )

    navigate(
      '/explore',
    )
  }

  if (
    !researchMap ||
    !activeProject
  ) {
    return (
      <QuestionScreen
        input={
          input
        }
        setInput={
          setInput
        }
        onSubmit={
          startResearch
        }
      />
    )
  }

  return (
    <ReactFlowProvider>
      <ResearchWorkspace
        project={
          activeProject
        }
        researchMap={
          researchMap
        }
        setResearchMap={
          setResearchMap
        }
        expandedNodeIds={
          expandedNodeIds
        }
        setExpandedNodeIds={
          setExpandedNodeIds
        }
        resetResearch={
          resetResearch
        }
      />
    </ReactFlowProvider>
  )
}

interface QuestionScreenProps {
  input:
    string

  setInput:
    (
      value:
        string,
    ) => void

  onSubmit:
    (
      question:
        string,
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
            to="/projects"
            className="helix-nav-text-link"
          >
            Projects
          </Link>

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
            relationships behind it.
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
  project:
    StoredResearchProject

  researchMap:
    ResearchMap

  setResearchMap:
    (
      map:
        ResearchMap,
    ) => void

  expandedNodeIds:
    string[]

  setExpandedNodeIds:
    (
      ids:
        string[],
    ) => void

  resetResearch:
    () => void
}

function ResearchWorkspace({
  project,
  researchMap,
  setResearchMap,
  expandedNodeIds,
  setExpandedNodeIds,
  resetResearch,
}: ResearchWorkspaceProps) {
  const {
    fitView,
  } =
    useReactFlow()

  const [
    activeView,
    setActiveView,
  ] =
    useState<WorkspaceView>(
      'map',
    )

  const initialFlow =
    useMemo(
      () =>
        layoutGraph(
          researchMap,
        ),
      [
        researchMap,
      ],
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

  const expandedNodeIdSet =
    useMemo(
      () =>
        new Set(
          expandedNodeIds,
        ),
      [
        expandedNodeIds,
      ],
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

      if (
        activeView ===
        'map'
      ) {
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
      }
    },
    [
      researchMap,
      activeView,
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
          expandedNodeIdSet.has(
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

        setExpandedNodeIds([
          ...expandedNodeIds,
          node.id,
        ])

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
        expandedNodeIdSet,
        expandedNodeIds,
        researchMap,
        setExpandedNodeIds,
        setResearchMap,
      ],
    )

  function selectNode(
    id:
      string,
  ) {
    setSelectedEdgeId(
      null,
    )

    setSelectedNodeId(
      id,
    )
  }

  function selectEdge(
    id:
      string,
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
      <style>
        {`
          .helix-workspace {
            height: 100vh;
            min-height: 100vh;
            overflow: hidden;
          }

          .helix-workspace-tabs {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px;
            border: 1px solid #e2e6dc;
            border-radius: 999px;
            background: rgba(255, 254, 249, 0.88);
          }

          .helix-workspace-tab {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            min-height: 34px;
            padding: 0 12px;
            border: 0;
            border-radius: 999px;
            background: transparent;
            color: #657060;
            font-size: 12px;
            font-weight: 800;
            cursor: pointer;
          }

          .helix-workspace-tab-active {
            background: #253b75;
            color: #ffffff;
            box-shadow: 0 8px 22px rgba(37, 59, 117, 0.2);
          }

          .helix-panel-page {
            height: calc(100vh - 72px);
            min-height: calc(100vh - 72px);
            box-sizing: border-box;
            padding: 34px;
            background:
              radial-gradient(circle at 18% 8%, rgba(82, 105, 210, 0.12), transparent 28%),
              #f8f7f2;
            overflow-y: auto;
            overflow-x: hidden;
            overscroll-behavior: contain;
          }

          .helix-panel-shell {
            width: min(1120px, 100%);
            margin: 0 auto;
            padding-bottom: 44px;
          }

          .helix-panel-hero {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 300px;
            gap: 18px;
            margin-bottom: 18px;
          }

          .helix-panel-copy,
          .helix-panel-card {
            border: 1px solid #e2e6dc;
            border-radius: 24px;
            background: rgba(255, 254, 249, 0.9);
            box-shadow: 0 20px 55px rgba(29, 36, 27, 0.06);
          }

          .helix-panel-copy {
            padding: 28px;
          }

          .helix-panel-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #3655a5;
            font-size: 12px;
            font-weight: 850;
            letter-spacing: 0.6px;
            text-transform: uppercase;
          }

          .helix-panel-copy h2 {
            margin: 14px 0 10px;
            font-size: clamp(32px, 5vw, 54px);
            line-height: 0.98;
            letter-spacing: -2px;
            color: #242923;
          }

          .helix-panel-copy p {
            max-width: 690px;
            margin: 0;
            color: #687066;
            font-size: 15px;
            line-height: 1.65;
          }

          .helix-panel-card {
            padding: 22px;
          }

          .helix-panel-card h3 {
            margin: 0 0 12px;
            font-size: 18px;
            letter-spacing: -0.4px;
          }

          .helix-panel-card p {
            color: #687066;
            font-size: 14px;
            line-height: 1.6;
          }

          .helix-panel-stat-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .helix-panel-stat {
            padding: 14px;
            border: 1px solid #e8ebe3;
            border-radius: 16px;
            background: #fbfbf6;
          }

          .helix-panel-stat strong {
            display: block;
            font-size: 24px;
            color: #242923;
          }

          .helix-panel-stat span {
            display: block;
            margin-top: 5px;
            color: #767f72;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
          }

          .helix-visual-stage {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 18px;
          }

          .helix-visual-canvas {
            min-height: 430px;
            position: relative;
            overflow: hidden;
            border: 1px solid #e2e6dc;
            border-radius: 28px;
            background:
              radial-gradient(circle at 50% 50%, rgba(61, 90, 170, 0.18), transparent 34%),
              radial-gradient(circle at 25% 30%, rgba(45, 95, 130, 0.12), transparent 24%),
              #fffef9;
          }

          .helix-orbit-ring {
            position: absolute;
            inset: 78px;
            border: 1px solid rgba(86, 103, 157, 0.22);
            border-radius: 50%;
          }

          .helix-orbit-ring:nth-child(2) {
            inset: 122px;
            transform: rotate(18deg);
          }

          .helix-orbit-ring:nth-child(3) {
            inset: 166px;
            transform: rotate(-22deg);
          }

          .helix-visual-node {
            position: absolute;
            display: grid;
            place-items: center;
            width: 88px;
            height: 88px;
            border-radius: 24px;
            border: 1px solid #dbe1d8;
            background: rgba(255, 254, 249, 0.95);
            color: #253b75;
            box-shadow: 0 18px 45px rgba(31, 38, 28, 0.12);
          }

          .helix-visual-node-main {
            left: calc(50% - 44px);
            top: calc(50% - 44px);
          }

          .helix-visual-node-one {
            left: 14%;
            top: 22%;
          }

          .helix-visual-node-two {
            right: 13%;
            top: 26%;
          }

          .helix-visual-node-three {
            left: 22%;
            bottom: 18%;
          }

          .helix-visual-node-four {
            right: 22%;
            bottom: 17%;
          }

          .helix-visual-side {
            display: grid;
            gap: 14px;
          }

          .helix-mini-list {
            display: grid;
            gap: 10px;
          }

          .helix-mini-item {
            display: grid;
            grid-template-columns: 34px 1fr;
            gap: 10px;
            align-items: start;
            padding: 13px;
            border: 1px solid #e8ebe3;
            border-radius: 16px;
            background: #fffef9;
          }

          .helix-mini-item span {
            display: grid;
            place-items: center;
            width: 34px;
            height: 34px;
            border-radius: 12px;
            background: #edf1ff;
            color: #3655a5;
          }

          .helix-mini-item strong {
            display: block;
            color: #242923;
            font-size: 14px;
          }

          .helix-mini-item p {
            margin: 4px 0 0;
            color: #687066;
            font-size: 12px;
            line-height: 1.45;
          }

          .helix-evidence-grid {
            display: grid;
            grid-template-columns: 0.9fr 1.1fr;
            gap: 18px;
          }

          .helix-evidence-list {
            display: grid;
            gap: 10px;
            max-height: none;
            overflow: visible;
            padding-right: 4px;
          }

          .helix-evidence-row {
            padding: 14px;
            border: 1px solid #e8ebe3;
            border-radius: 16px;
            background: #fffef9;
          }

          .helix-evidence-row-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }

          .helix-evidence-row strong {
            color: #242923;
            font-size: 14px;
          }

          .helix-evidence-row p {
            margin: 8px 0 0;
            color: #687066;
            font-size: 12px;
            line-height: 1.45;
          }

          .helix-evidence-pill {
            flex: none;
            padding: 5px 8px;
            border-radius: 999px;
            background: #edf1ff;
            color: #3655a5;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
          }

          .helix-link-list {
            display: grid;
            gap: 10px;
          }

          .helix-link-row {
            padding: 13px;
            border: 1px solid #e8ebe3;
            border-radius: 15px;
            background: #fbfbf6;
          }

          .helix-link-row strong {
            display: block;
            color: #242923;
            font-size: 13px;
          }

          .helix-link-row span {
            display: block;
            margin-top: 5px;
            color: #687066;
            font-size: 12px;
            line-height: 1.4;
          }

          @media (max-width: 950px) {
            .helix-panel-hero,
            .helix-visual-stage,
            .helix-evidence-grid {
              grid-template-columns: 1fr;
            }

            .helix-workspace-tabs {
              max-width: 100%;
              overflow-x: auto;
            }
          }
        `}
      </style>

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

          <Link
            to="/projects"
            className="helix-new-question"
          >
            <FolderKanban size={16} />

            Projects
          </Link>
        </div>

        <div className="helix-workspace-tabs">
          <button
            type="button"
            className={
              activeView ===
              'map'
                ? 'helix-workspace-tab helix-workspace-tab-active'
                : 'helix-workspace-tab'
            }
            onClick={
              () =>
                setActiveView(
                  'map',
                )
            }
          >
            <Network size={15} />

            Map
          </button>

          <button
            type="button"
            className={
              activeView ===
              'visualize'
                ? 'helix-workspace-tab helix-workspace-tab-active'
                : 'helix-workspace-tab'
            }
            onClick={
              () =>
                setActiveView(
                  'visualize',
                )
            }
          >
            <Atom size={15} />

            Visualize
          </button>

          <button
            type="button"
            className={
              activeView ===
              'evidence'
                ? 'helix-workspace-tab helix-workspace-tab-active'
                : 'helix-workspace-tab'
            }
            onClick={
              () =>
                setActiveView(
                  'evidence',
                )
            }
          >
            <BookOpen size={15} />

            Evidence
          </button>
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

      {
        activeView ===
          'map' && (
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
                    Auto-saved
                  </span>

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
                          expandedNodeIdSet.has(
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
        )
      }

      {
        activeView ===
          'visualize' && (
          <VisualizationPanel
            project={
              project
            }
            map={
              researchMap
            }
            onOpenMap={
              () =>
                setActiveView(
                  'map',
                )
            }
          />
        )
      }

      {
        activeView ===
          'evidence' && (
          <EvidencePanel
            map={
              researchMap
            }
            onOpenMap={
              () =>
                setActiveView(
                  'map',
                )
            }
          />
        )
      }
    </div>
  )
}

interface VisualizationPanelProps {
  project:
    StoredResearchProject

  map:
    ResearchMap

  onOpenMap:
    () => void
}

function VisualizationPanel({
  project,
  map,
  onOpenMap,
}: VisualizationPanelProps) {
  const primaryNodes =
    map.nodes.filter(
      (
        node,
      ) =>
        node.type !==
        'question',
    )

  const previewNodes =
    primaryNodes.slice(
      0,
      4,
    )

  return (
    <main className="helix-panel-page">
      <section className="helix-panel-shell">
        <div className="helix-panel-hero">
          <div className="helix-panel-copy">
            <span className="helix-panel-eyebrow">
              <Atom size={15} />

              Scientific visualization
            </span>

            <h2>
              Visual model for this investigation.
            </h2>

            <p>
              This view turns the research map into a simplified
              conceptual model. It is not a medical or experimental
              validation tool, but it helps explain how the major
              concepts in the investigation connect.
            </p>
          </div>

          <aside className="helix-panel-card">
            <h3>
              Project snapshot
            </h3>

            <div className="helix-panel-stat-grid">
              <div className="helix-panel-stat">
                <strong>
                  {
                    map.nodes.length
                  }
                </strong>

                <span>
                  Concepts
                </span>
              </div>

              <div className="helix-panel-stat">
                <strong>
                  {
                    map.edges.length
                  }
                </strong>

                <span>
                  Links
                </span>
              </div>

              <div className="helix-panel-stat">
                <strong>
                  {
                    getStrongEvidenceCount(
                      map,
                    )
                  }
                </strong>

                <span>
                  Strong
                </span>
              </div>

              <div className="helix-panel-stat">
                <strong>
                  {
                    project.expandedNodeIds.length
                  }
                </strong>

                <span>
                  Expanded
                </span>
              </div>
            </div>
          </aside>
        </div>

        <div className="helix-visual-stage">
          <div className="helix-visual-canvas">
            <div className="helix-orbit-ring" />
            <div className="helix-orbit-ring" />
            <div className="helix-orbit-ring" />

            <div className="helix-visual-node helix-visual-node-main">
              {
                getDomainIcon(
                  map.domain,
                )
              }
            </div>

            <div className="helix-visual-node helix-visual-node-one">
              <Network size={30} />
            </div>

            <div className="helix-visual-node helix-visual-node-two">
              <BookOpen size={30} />
            </div>

            <div className="helix-visual-node helix-visual-node-three">
              <Sparkles size={30} />
            </div>

            <div className="helix-visual-node helix-visual-node-four">
              <Beaker size={30} />
            </div>
          </div>

          <div className="helix-visual-side">
            <div className="helix-panel-card">
              <h3>
                Model focus
              </h3>

              <div className="helix-mini-list">
                {
                  previewNodes.length >
                    0
                    ? previewNodes.map(
                        (
                          node,
                        ) => (
                          <div
                            key={
                              node.id
                            }
                            className="helix-mini-item"
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
                          </div>
                        ),
                      )
                    : (
                      <div className="helix-mini-item">
                        <span>
                          <Sparkles size={18} />
                        </span>

                        <div>
                          <strong>
                            Question node
                          </strong>

                          <p>
                            Start expanding concepts on the map to
                            enrich the visualization.
                          </p>
                        </div>
                      </div>
                    )
                }
              </div>
            </div>

            <div className="helix-panel-card">
              <h3>
                Next improvement
              </h3>

              <p>
                Later, this can become a true topic-specific renderer:
                molecules for chemistry, pathways for biology, neural
                circuits for neuroscience, and mechanism diagrams for
                engineering or physics.
              </p>

              <button
                type="button"
                className="helix-expand-button"
                onClick={
                  onOpenMap
                }
              >
                <Network size={16} />

                Return to map

                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

interface EvidencePanelProps {
  map:
    ResearchMap

  onOpenMap:
    () => void
}

function EvidencePanel({
  map,
  onOpenMap,
}: EvidencePanelProps) {
  const evidenceNodes =
    map.nodes.filter(
      (
        node,
      ) =>
        node.type !==
        'question',
    )

  const previewEdges =
    map.edges.slice(
      0,
      8,
    )

  return (
    <main className="helix-panel-page">
      <section className="helix-panel-shell">
        <div className="helix-panel-hero">
          <div className="helix-panel-copy">
            <span className="helix-panel-eyebrow">
              <BookOpen size={15} />

              Evidence workspace
            </span>

            <h2>
              Review the evidence behind the map.
            </h2>

            <p>
              This view summarizes the concepts and relationships that
              Helix generated. For biomedical concepts, clicking a node
              on the map can also pull live PubMed literature into the
              inspector panel.
            </p>
          </div>

          <aside className="helix-panel-card">
            <h3>
              Evidence status
            </h3>

            <div className="helix-panel-stat-grid">
              <div className="helix-panel-stat">
                <strong>
                  {
                    evidenceNodes.length
                  }
                </strong>

                <span>
                  Concepts
                </span>
              </div>

              <div className="helix-panel-stat">
                <strong>
                  {
                    map.edges.length
                  }
                </strong>

                <span>
                  Links
                </span>
              </div>

              <div className="helix-panel-stat">
                <strong>
                  {
                    getStrongEvidenceCount(
                      map,
                    )
                  }
                </strong>

                <span>
                  Strong
                </span>
              </div>

              <div className="helix-panel-stat">
                <strong>
                  {
                    getUnverifiedEvidenceCount(
                      map,
                    )
                  }
                </strong>

                <span>
                  Review
                </span>
              </div>
            </div>
          </aside>
        </div>

        <div className="helix-evidence-grid">
          <div className="helix-panel-card">
            <h3>
              Concept evidence
            </h3>

            <div className="helix-evidence-list">
              {
                evidenceNodes.map(
                  (
                    node,
                  ) => (
                    <article
                      key={
                        node.id
                      }
                      className="helix-evidence-row"
                    >
                      <div className="helix-evidence-row-top">
                        <strong>
                          {
                            node.label
                          }
                        </strong>

                        <span className="helix-evidence-pill">
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
                    </article>
                  ),
                )
              }
            </div>
          </div>

          <div className="helix-panel-card">
            <h3>
              Relationship evidence
            </h3>

            <div className="helix-link-list">
              {
                previewEdges.map(
                  (
                    edge,
                  ) => {
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
                      <article
                        key={
                          edge.id
                        }
                        className="helix-link-row"
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

                        <span>
                          {
                            edge.explanation
                          }
                        </span>
                      </article>
                    )
                  },
                )
              }
            </div>

            <button
              type="button"
              className="helix-expand-button"
              onClick={
                onOpenMap
              }
            >
              <Network size={16} />

              Inspect on map

              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

interface NodeInspectorProps {
  node:
    ResearchNode

  map:
    ResearchMap

  isExpanded:
    boolean

  onClose:
    () => void

  onOpenNode:
    (
      id:
        string,
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
      PubMedPaper[]
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

  const pubMedEnabled =
    shouldSearchPubMed(
      node,
    )

  useEffect(
    () => {
      let cancelled =
        false

      if (
        !pubMedEnabled
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

      async function loadPapers() {
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
            buildPubMedQuery(
              node,
              map,
            )

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
            result.papers,
          )
        } catch (
          error
        ) {
          if (
            cancelled
          ) {
            return
          }

          setPapers(
            [],
          )

          setPaperError(
            error instanceof
              Error
              ? error.message
              : 'Could not retrieve PubMed literature.',
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

      loadPapers()

      return () => {
        cancelled =
          true
      }
    },
    [
      node.id,
      node.label,
      node.domain,
      node.type,
      map.question,
      pubMedEnabled,
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
        pubMedEnabled && (
          <div className="helix-inspector-section">
            <div className="helix-literature-heading">
              <div>
                <span className="helix-inspector-section-label">
                  Live literature
                </span>

                <p>
                  Live PubMed results
                  related to this concept.
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

                  Searching PubMed...
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
                  No matching PubMed
                  papers were returned.
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
                            paper.pmid
                          }
                          className="helix-paper-card"
                        >
                          <div className="helix-paper-meta">
                            <span>
                              PMID {
                                paper.pmid
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
                                  260
                                    ? `${paper.abstract.slice(
                                        0,
                                        260,
                                      )}…`
                                    : paper.abstract
                                }
                              </p>
                            )
                          }

                          <div className="helix-paper-actions">
                            {
                              paper.doi && (
                                <span>
                                  DOI {
                                    paper.doi
                                  }
                                </span>
                              )
                            }

                            <a
                              href={
                                paper.url
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              PubMed

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
  edge:
    ResearchEdge

  map:
    ResearchMap

  onClose:
    () => void

  onOpenNode:
    (
      id:
        string,
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
