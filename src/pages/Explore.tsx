import {
  ArrowLeft,
  BookOpen,
  Brain,
  FlaskConical,
  Home,
  LoaderCircle,
  Network,
  Search,
  Sparkles,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import type {
  FormEvent,
} from 'react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import { AgentResearchWorkspace } from '../components/AgentResearchWorkspace'
import { EvidenceWorkspace } from '../components/EvidenceWorkspace'
import { ResearchVisualization } from '../components/ResearchVisualization'
import { generateResearchMap } from '../utils/generateResearchMap'

import type {
  ResearchMap,
  ResearchNode,
} from '../types/researchMap'

import './Explore.css'

type WorkspaceTab =
  | 'agent'
  | 'evidence'
  | 'visualize'
  | 'connections'

type FlexibleEdge = {
  id: string
  sourceId?: string
  targetId?: string
  sourceIds?: string[]
  targetIds?: string[]
  label?: string
  explanation?: string
  evidenceStrength?: ResearchNode['evidenceStrength']
}

function createFallbackMap(question: string): ResearchMap {
  const fallbackMap = {
    question,
    domain: 'Biomedical Science',
    nodes: [
      {
        id: 'question',
        type: 'question',
        domain: 'Biomedical Science',
        label: question,
        subtitle: 'Research question',
        description:
          'The main investigation question submitted by the user.',
        evidenceStrength: 'unknown',
        sourceIds: [],
      },
      {
        id: 'overview',
        type: 'concept',
        domain: 'Biomedical Science',
        label: 'Topic overview',
        subtitle: 'Initial explanation',
        description:
          'A plain-language summary is needed before evaluating mechanisms or evidence.',
        evidenceStrength: 'unknown',
        sourceIds: [],
      },
      {
        id: 'mechanism',
        type: 'mechanism',
        domain: 'Biomedical Science',
        label: 'Candidate mechanism',
        subtitle: 'Possible explanation',
        description:
          'A mechanism is a possible explanation for how or why the biological relationship occurs.',
        evidenceStrength: 'unknown',
        sourceIds: [],
      },
      {
        id: 'evidence',
        type: 'evidence',
        domain: 'Biomedical Science',
        label: 'Evidence base',
        subtitle: 'Scholarly sources',
        description:
          'This concept represents the papers, abstracts, citations, and source metadata used to evaluate the claim.',
        evidenceStrength: 'unknown',
        sourceIds: [],
      },
      {
        id: 'test',
        type: 'experiment',
        domain: 'Biomedical Science',
        label: 'Testable experiment',
        subtitle: 'Next experiment',
        description:
          'A useful research agent should suggest what experiment or comparison would best test the mechanism.',
        evidenceStrength: 'limited',
        sourceIds: [],
      },
    ],
    edges: [
      {
        id: 'edge-question-overview',
        sourceIds: ['question'],
        targetIds: ['overview'],
        label: 'frames',
        explanation:
          'The research question frames the topic that needs to be explained.',
        evidenceStrength: 'unknown',
      },
      {
        id: 'edge-overview-mechanism',
        sourceIds: ['overview'],
        targetIds: ['mechanism'],
        label: 'leads to',
        explanation:
          'A topic overview helps generate candidate mechanisms.',
        evidenceStrength: 'unknown',
      },
      {
        id: 'edge-mechanism-evidence',
        sourceIds: ['mechanism'],
        targetIds: ['evidence'],
        label: 'requires support from',
        explanation:
          'A mechanism should be checked against scholarly evidence before being treated as reliable.',
        evidenceStrength: 'unknown',
      },
      {
        id: 'edge-evidence-test',
        sourceIds: ['evidence'],
        targetIds: ['test'],
        label: 'suggests',
        explanation:
          'Evidence gaps can point toward the next useful experiment or test.',
        evidenceStrength: 'limited',
      },
    ],
  }

  return fallbackMap as unknown as ResearchMap
}

function getFirstSourceId(edge: FlexibleEdge) {
  return edge.sourceId || edge.sourceIds?.[0] || ''
}

function getFirstTargetId(edge: FlexibleEdge) {
  return edge.targetId || edge.targetIds?.[0] || ''
}

function getNodeIcon(node: ResearchNode) {
  const text = `${node.type} ${node.label}`.toLowerCase()

  if (
    text.includes('evidence') ||
    text.includes('paper') ||
    text.includes('source')
  ) {
    return <BookOpen size={18} />
  }

  if (
    text.includes('experiment') ||
    text.includes('test') ||
    text.includes('drug') ||
    text.includes('protein')
  ) {
    return <FlaskConical size={18} />
  }

  if (
    text.includes('brain') ||
    text.includes('disease') ||
    text.includes('neuro')
  ) {
    return <Brain size={18} />
  }

  return <Sparkles size={18} />
}

function getEvidenceLabel(value: ResearchNode['evidenceStrength']) {
  if (!value || value === 'unknown') {
    return 'Needs verification'
  }

  if (value === 'limited') {
    return 'Limited evidence'
  }

  return `${value.charAt(0).toUpperCase()}${value.slice(1)} evidence`
}

function getEvidenceClass(value: ResearchNode['evidenceStrength']) {
  if (value === 'strong') {
    return 'helix-connection-pill-strong'
  }

  if (value === 'moderate') {
    return 'helix-connection-pill-moderate'
  }

  if (value === 'limited') {
    return 'helix-connection-pill-limited'
  }

  return 'helix-connection-pill-unknown'
}

function ConnectionsView({
  map,
}: {
  map: ResearchMap
}) {
  const visibleNodes = useMemo(
    () => map.nodes.filter((node) => node.type !== 'question'),
    [map],
  )

  const relationshipClaims = useMemo(
    () => map.edges as unknown as FlexibleEdge[],
    [map],
  )

  return (
    <main className="helix-connections-page">
      <section className="helix-connections-shell">
        <header className="helix-connections-hero">
          <span className="helix-connections-kicker">
            Connections board
          </span>

          <h1>
            Evidence, mechanisms, and relationships.
          </h1>

          <p>
            This view is no longer the main experience. It is a support board
            that helps users inspect how Helix connected concepts, evidence,
            and testable research directions.
          </p>
        </header>

        <section className="helix-connections-question">
          <span>
            Research question
          </span>

          <strong>
            {map.question}
          </strong>
        </section>

        <section className="helix-connections-grid">
          <div className="helix-connections-column">
            <div className="helix-connections-section-heading">
              <span>
                Key concepts
              </span>

              <strong>
                {visibleNodes.length}
              </strong>
            </div>

            <div className="helix-connection-card-list">
              {visibleNodes.map((node, index) => (
                <article
                  key={node.id}
                  className="helix-connection-card"
                >
                  <div className="helix-connection-card-top">
                    <div className="helix-connection-icon">
                      {getNodeIcon(node)}
                    </div>

                    <span>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <small>
                    {node.type}
                  </small>

                  <h2>
                    {node.label}
                  </h2>

                  <p>
                    {node.description ||
                      node.subtitle ||
                      'Concept generated from the research question.'}
                  </p>

                  <em className={getEvidenceClass(node.evidenceStrength)}>
                    {getEvidenceLabel(node.evidenceStrength)}
                  </em>
                </article>
              ))}
            </div>
          </div>

          <div className="helix-connections-column">
            <div className="helix-connections-section-heading">
              <span>
                Relationship claims
              </span>

              <strong>
                {relationshipClaims.length}
              </strong>
            </div>

            <div className="helix-relationship-list">
              {relationshipClaims.map((edge, index) => {
                const sourceId = getFirstSourceId(edge)
                const targetId = getFirstTargetId(edge)

                const source = map.nodes.find((node) => node.id === sourceId)
                const target = map.nodes.find((node) => node.id === targetId)

                return (
                  <article
                    key={edge.id}
                    className="helix-relationship-card"
                  >
                    <div className="helix-relationship-number">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <div>
                      <h3>
                        {source?.label ?? sourceId} → {target?.label ?? targetId}
                      </h3>

                      <p>
                        {edge.explanation ||
                          edge.label ||
                          'Generated relationship claim.'}
                      </p>

                      <span>
                        Verification needed before treating this as a supported claim.
                      </span>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}

export default function Explore() {
  const navigate = useNavigate()

  const [question, setQuestion] = useState('')
  const [map, setMap] = useState<ResearchMap | null>(null)
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('agent')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanedQuestion = question.trim()

    if (!cleanedQuestion) {
      setError('Enter a research question first.')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const generatedMap = await generateResearchMap(cleanedQuestion)

      setMap(generatedMap)
      setActiveTab('agent')
    } catch (generationError) {
      console.error('Research map generation failed:', generationError)

      setMap(createFallbackMap(cleanedQuestion))
      setActiveTab('agent')
    } finally {
      setIsGenerating(false)
    }
  }

  function startNewQuestion() {
    setQuestion('')
    setMap(null)
    setActiveTab('agent')
    setError(null)
  }

  if (!map) {
    return (
      <main className="helix-explore-entry">
        <header className="helix-explore-entry-nav">
          <Link to="/" className="helix-explore-brand">
            Helix
          </Link>

          <nav>
            <Link to="/projects">
              Projects
            </Link>

            <Link to="/hypotheses">
              Hypotheses
            </Link>
          </nav>
        </header>

        <section className="helix-explore-entry-center">
          <div className="helix-explore-kicker">
            <Sparkles size={16} />

            AI research agent
          </div>

          <h1>
            Ask Helix to investigate a scientific question.
          </h1>

          <p>
            Helix turns a research question into a step-by-step investigation:
            question parsing, evidence search, mechanism generation, tests,
            and a final readout.
          </p>

          <form
            className="helix-explore-form"
            onSubmit={handleSubmit}
          >
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Example: What evidence connects SOD1 to ALS?"
              rows={5}
            />

            <button
              type="submit"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <LoaderCircle className="helix-explore-spin" size={18} />

                  Starting investigation...
                </>
              ) : (
                <>
                  <Search size={18} />

                  Start investigation
                </>
              )}
            </button>
          </form>

          {error && (
            <p className="helix-explore-error">
              {error}
            </p>
          )}

          <div className="helix-explore-examples">
            <button
              type="button"
              onClick={() => setQuestion('What evidence connects SOD1 to ALS?')}
            >
              SOD1 and ALS
            </button>

            <button
              type="button"
              onClick={() => setQuestion('How does CRISPR-Cas9 target DNA?')}
            >
              CRISPR-Cas9
            </button>

            <button
              type="button"
              onClick={() => setQuestion('How does traumatic brain injury affect the brain?')}
            >
              TBI and brain injury
            </button>

            <button
              type="button"
              onClick={() => setQuestion('How does a drug bind to a protein receptor?')}
            >
              Drug-receptor binding
            </button>
          </div>
        </section>
      </main>
    )
  }


  return (
    <main className="helix-explore-workspace">
      <header className="helix-explore-topbar">
        <div className="helix-explore-topbar-left">
          <button
            type="button"
            onClick={startNewQuestion}
          >
            <ArrowLeft size={16} />

            New question
          </button>

          <Link to="/">
            <Home size={16} />

            Home
          </Link>

          <button
            type="button"
            onClick={() => navigate('/projects')}
          >
            Projects
          </button>
        </div>

        <nav className="helix-explore-tabs">
          <button
            type="button"
            className={activeTab === 'agent' ? 'helix-explore-tab-active' : ''}
            onClick={() => setActiveTab('agent')}
          >
            <Sparkles size={16} />

            Agent
          </button>

          <button
            type="button"
            className={activeTab === 'evidence' ? 'helix-explore-tab-active' : ''}
            onClick={() => setActiveTab('evidence')}
          >
            <BookOpen size={16} />

            Evidence
          </button>

          <button
            type="button"
            className={activeTab === 'visualize' ? 'helix-explore-tab-active' : ''}
            onClick={() => setActiveTab('visualize')}
          >
            <FlaskConical size={16} />

            Model
          </button>

          <button
            type="button"
            className={activeTab === 'connections' ? 'helix-explore-tab-active' : ''}
            onClick={() => setActiveTab('connections')}
          >
            <Network size={16} />

            Connections
          </button>
        </nav>
      </header>

      <section className="helix-explore-content">
        {activeTab === 'agent' && (
          <AgentResearchWorkspace
            map={map}
            onOpenEvidence={() => setActiveTab('evidence')}
            onOpenConnections={() => setActiveTab('connections')}
            onOpenModel={() => setActiveTab('visualize')}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceWorkspace
            map={map}
            onOpenMap={() => setActiveTab('connections')}
          />
        )}

        {activeTab === 'visualize' && (
          <ResearchVisualization
            map={map}
            onOpenMap={() => setActiveTab('connections')}
          />
        )}

        {activeTab === 'connections' && (
          <ConnectionsView map={map} />
        )}
      </section>
    </main>
  )
}