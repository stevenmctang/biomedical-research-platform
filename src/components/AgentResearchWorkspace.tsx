import {
  ArrowRight,
  Beaker,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  LoaderCircle,
  Network,
  Sparkles,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import type {
  ResearchMap,
  ResearchNode,
} from '../types/researchMap'

import './AgentResearchWorkspace.css'

interface AgentResearchWorkspaceProps {
  map: ResearchMap
  onOpenEvidence: () => void
  onOpenConnections: () => void
  onOpenModel: () => void
}

interface EvidenceArticle {
  id: string
  title: string
  source: string
  year: string
  abstract: string
  authors: string[]
  url: string
  doi: string
  pubmedId: string
  citationCount: number
  provider: string
  type: string
  openAccessPdf: string
}

interface EvidenceApiResponse {
  ok?: boolean
  query: string
  articles: EvidenceArticle[]
  errors: string[]
}

type AgentStage =
  | 'understand'
  | 'evidence'
  | 'mechanisms'
  | 'tests'
  | 'summary'

interface MechanismCard {
  id: string
  title: string
  summary: string
  confidence: number
  test: string
}

const stageOrder: AgentStage[] = [
  'understand',
  'evidence',
  'mechanisms',
  'tests',
  'summary',
]

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanQuestion(question: string) {
  return question
    .replace(/\?/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function getApiBaseUrl() {
  return 'http://localhost:3001'
}

function getImportantNodes(map: ResearchMap) {
  return map.nodes
    .filter((node) => node.type !== 'question')
    .filter((node) => {
      const label = normalizeText(node.label)

      return (
        label !== 'topic overview' &&
        label !== 'key mechanisms' &&
        label !== 'evidence' &&
        label !== 'open questions'
      )
    })
    .slice(0, 5)
}

function getDomainLabel(map: ResearchMap) {
  const text = normalizeText(`${map.question} ${map.domain}`)

  if (
    text.includes('tbi') ||
    text.includes('brain') ||
    text.includes('concussion') ||
    text.includes('neuro') ||
    text.includes('als') ||
    text.includes('alzheimer') ||
    text.includes('parkinson')
  ) {
    return 'Neuroscience'
  }

  if (
    text.includes('crispr') ||
    text.includes('dna') ||
    text.includes('rna') ||
    text.includes('gene') ||
    text.includes('mutation')
  ) {
    return 'Genetics'
  }

  if (
    text.includes('drug') ||
    text.includes('protein') ||
    text.includes('receptor') ||
    text.includes('enzyme') ||
    text.includes('ligand')
  ) {
    return 'Molecular biology'
  }

  if (
    text.includes('cell') ||
    text.includes('cancer') ||
    text.includes('tumor') ||
    text.includes('immune')
  ) {
    return 'Cell biology'
  }

  return map.domain || 'Biomedical research'
}

function getInvestigationGoal(map: ResearchMap) {
  const text = normalizeText(map.question)

  if (
    text.includes('evidence') ||
    text.includes('connects') ||
    text.includes('link') ||
    text.includes('relationship')
  ) {
    return 'Determine whether the literature supports the proposed relationship.'
  }

  if (
    text.includes('how') ||
    text.includes('why') ||
    text.includes('mechanism')
  ) {
    return 'Identify the most likely mechanism and explain how it works.'
  }

  if (
    text.includes('drug') ||
    text.includes('treatment') ||
    text.includes('therapy')
  ) {
    return 'Evaluate a therapeutic hypothesis and what evidence would support it.'
  }

  return 'Turn the question into a testable research investigation.'
}

function buildEvidenceQuery(map: ResearchMap) {
  const concepts = getImportantNodes(map)
    .slice(0, 3)
    .map((node) => node.label)
    .join(' ')

  if (concepts) {
    return `${cleanQuestion(map.question)} ${concepts}`
  }

  return cleanQuestion(map.question)
}

function getTopicPhrase(map: ResearchMap) {
  const cleaned = cleanQuestion(map.question)

  if (cleaned.length <= 90) {
    return cleaned
  }

  return `${cleaned.slice(0, 90)}…`
}

function getNodeDescription(node: ResearchNode) {
  return node.description ||
    node.subtitle ||
    `${node.label} is a candidate concept in this investigation.`
}

function buildMechanisms(map: ResearchMap): MechanismCard[] {
  const nodes = getImportantNodes(map)

  if (nodes.length > 0) {
    return nodes.slice(0, 3).map((node, index) => ({
      id: node.id,
      title:
        index === 0
          ? `${node.label} is the leading explanation to test.`
          : `${node.label} is an alternative explanation.`,
      summary: getNodeDescription(node),
      confidence: [74, 63, 55][index] ?? 50,
      test:
        `Check whether papers about ${node.label} directly support the user's question instead of only mentioning the topic.`,
    }))
  }

  const text = normalizeText(map.question)

  if (
    text.includes('sod1') &&
    text.includes('als')
  ) {
    return [
      {
        id: 'sod1-toxic-gain',
        title: 'SOD1 may contribute to ALS through toxic protein behavior.',
        summary:
          'The strongest starting hypothesis is that SOD1 mutations can alter protein behavior, creating cellular stress that contributes to motor neuron degeneration.',
        confidence: 76,
        test:
          'Compare papers on mutant SOD1 aggregation, oxidative stress, and motor neuron toxicity.',
      },
      {
        id: 'sod1-oxidative-stress',
        title: 'Oxidative stress may connect SOD1 dysfunction to neuron damage.',
        summary:
          'Because SOD1 normally helps handle reactive oxygen species, altered SOD1 function may increase vulnerability to cellular stress.',
        confidence: 68,
        test:
          'Look for evidence that oxidative stress markers change in SOD1-linked ALS models.',
      },
      {
        id: 'sod1-proteostasis',
        title: 'Protein misfolding and clearance failure may be another route.',
        summary:
          'A competing explanation is that misfolded SOD1 overwhelms protein quality-control systems in vulnerable neurons.',
        confidence: 61,
        test:
          'Compare studies on SOD1 aggregation, proteasome stress, and autophagy.',
      },
    ]
  }

  if (
    text.includes('tbi') ||
    text.includes('traumatic brain injury') ||
    text.includes('brain injury')
  ) {
    return [
      {
        id: 'tbi-inflammation',
        title: 'Neuroinflammation may drive secondary injury after TBI.',
        summary:
          'After the initial mechanical injury, inflammatory signaling can amplify damage and affect recovery.',
        confidence: 73,
        test:
          'Compare papers measuring inflammatory markers after TBI with outcome or symptom severity.',
      },
      {
        id: 'tbi-axonal-injury',
        title: 'Axonal disruption may explain cognitive and neurological symptoms.',
        summary:
          'Mechanical force can disrupt neural connections, which may help explain memory, attention, and movement symptoms.',
        confidence: 70,
        test:
          'Look for studies linking diffuse axonal injury to cognitive or behavioral outcomes.',
        },
      {
        id: 'tbi-metabolic-stress',
        title: 'Metabolic stress may worsen recovery after injury.',
        summary:
          'Brain injury can disrupt energy balance, ion gradients, and cellular repair processes.',
        confidence: 62,
        test:
          'Search for evidence connecting mitochondrial dysfunction or metabolic crisis to TBI outcomes.',
      },
    ]
  }

  if (
    text.includes('crispr') ||
    text.includes('cas9')
  ) {
    return [
      {
        id: 'crispr-guide-rna',
        title: 'Guide RNA targeting is the central CRISPR mechanism.',
        summary:
          'The guide RNA directs Cas9 to a matching DNA sequence, allowing the complex to bind and cut at a specific genomic site.',
        confidence: 80,
        test:
          'Check papers explaining guide RNA complementarity, PAM recognition, and Cas9 cleavage.',
      },
      {
        id: 'crispr-pam',
        title: 'PAM recognition controls where Cas9 can bind.',
        summary:
          'Cas9 does not bind any DNA sequence randomly; it requires a nearby PAM sequence before guide matching can occur.',
        confidence: 74,
        test:
          'Compare sources on PAM requirements for different Cas proteins.',
      },
      {
        id: 'crispr-repair',
        title: 'DNA repair determines the final edit outcome.',
        summary:
          'After Cas9 cuts DNA, repair pathways such as NHEJ or HDR determine whether the result is disruption or precise editing.',
        confidence: 69,
        test:
          'Review studies comparing NHEJ and HDR outcomes after Cas9 cleavage.',
      },
    ]
  }

  return [
    {
      id: 'general-primary',
      title: `${getTopicPhrase(map)} needs a mechanism-first explanation.`,
      summary:
        'Helix found the question, but the current concept map is too generic. The next step is to use evidence and named entities to make the answer more specific.',
      confidence: 52,
      test:
        'Search for review papers, extract recurring mechanisms, and compare them against the original question.',
    },
  ]
}

function getTopArticle(articles: EvidenceArticle[]) {
  return [...articles].sort(
    (a, b) => Number(b.citationCount || 0) - Number(a.citationCount || 0),
  )[0]
}

function getShortAbstract(abstract: string) {
  if (!abstract) {
    return 'No abstract was returned. Open the paper to inspect the source directly.'
  }

  if (abstract.length <= 260) {
    return abstract
  }

  return `${abstract.slice(0, 260)}…`
}

function getStageTitle(stage: AgentStage) {
  if (stage === 'understand') {
    return 'Understand the question'
  }

  if (stage === 'evidence') {
    return 'Search evidence'
  }

  if (stage === 'mechanisms') {
    return 'Generate mechanisms'
  }

  if (stage === 'tests') {
    return 'Choose next tests'
  }

  return 'Final readout'
}

function getStageProgress(stage: AgentStage) {
  if (stage === 'understand') {
    return 20
  }

  if (stage === 'evidence') {
    return 45
  }

  if (stage === 'mechanisms') {
    return 68
  }

  if (stage === 'tests') {
    return 86
  }

  return 100
}

function getNextStage(stage: AgentStage) {
  const index = stageOrder.indexOf(stage)
  return stageOrder[Math.min(index + 1, stageOrder.length - 1)]
}

export function AgentResearchWorkspace({
  map,
  onOpenEvidence,
  onOpenConnections,
  onOpenModel,
}: AgentResearchWorkspaceProps) {
  const [stage, setStage] = useState<AgentStage>('understand')
  const [completedStages, setCompletedStages] = useState<AgentStage[]>([])
  const [isRunningStage, setIsRunningStage] = useState(true)
  const [articles, setArticles] = useState<EvidenceArticle[]>([])
  const [isLoadingEvidence, setIsLoadingEvidence] = useState(false)
  const [evidenceError, setEvidenceError] = useState<string | null>(null)

  const evidenceQuery = useMemo(
    () => buildEvidenceQuery(map),
    [map],
  )

  const mechanisms = useMemo(
    () => buildMechanisms(map),
    [map],
  )

  const topArticle = getTopArticle(articles)
  const bestMechanism = mechanisms[0]
  const domainLabel = getDomainLabel(map)
  const goal = getInvestigationGoal(map)
  const progress = getStageProgress(stage)

  useEffect(() => {
    let cancelled = false

    async function loadEvidence() {
      setIsLoadingEvidence(true)
      setEvidenceError(null)

      try {
        const response = await fetch(
          `${getApiBaseUrl()}/api/evidence?q=${encodeURIComponent(evidenceQuery)}`,
        )

        if (!response.ok) {
          throw new Error(`Evidence API returned ${response.status}`)
        }

        const data = await response.json() as EvidenceApiResponse

        if (!cancelled) {
          setArticles(data.articles || [])
        }
      } catch (error) {
        if (!cancelled) {
          setEvidenceError(
            error instanceof Error
              ? error.message
              : 'Evidence search failed.',
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoadingEvidence(false)
        }
      }
    }

    if (evidenceQuery) {
      loadEvidence()
    }

    return () => {
      cancelled = true
    }
  }, [evidenceQuery])

  useEffect(() => {
    setIsRunningStage(true)

    const finishTimer = window.setTimeout(() => {
      setIsRunningStage(false)
      setCompletedStages((current) =>
        current.includes(stage)
          ? current
          : [...current, stage],
      )
    }, 1200)

    return () => {
      window.clearTimeout(finishTimer)
    }
  }, [stage])

  useEffect(() => {
    if (isRunningStage || stage === 'summary') {
      return
    }

    const nextTimer = window.setTimeout(() => {
      setStage(getNextStage(stage))
    }, 850)

    return () => {
      window.clearTimeout(nextTimer)
    }
  }, [isRunningStage, stage])

  return (
    <main className="helix-agent-page">
      <aside className="helix-agent-sidebar">
        <div className="helix-agent-brand">
          <Sparkles size={18} />
          <span>Helix</span>
        </div>

        <div className="helix-agent-sidebar-question">
          <span>Current investigation</span>
          <strong>{map.question}</strong>
        </div>

        <div className="helix-agent-stage-list">
          {stageOrder.map((item, index) => {
            const isActive = item === stage
            const isComplete = completedStages.includes(item)

            return (
              <button
                key={item}
                type="button"
                className={
                  isActive
                    ? 'helix-agent-stage-item helix-agent-stage-item-active'
                    : 'helix-agent-stage-item'
                }
                onClick={() => setStage(item)}
              >
                <span>
                  {isComplete ? <CheckCircle2 size={15} /> : String(index + 1).padStart(2, '0')}
                </span>

                <div>
                  <strong>{getStageTitle(item)}</strong>
                  <small>{isActive && isRunningStage ? 'Running…' : isComplete ? 'Complete' : 'Queued'}</small>
                </div>
              </button>
            )
          })}
        </div>

        <nav className="helix-agent-nav">
          <button type="button" onClick={onOpenEvidence}>
            <BookOpen size={15} />
            Evidence
          </button>

          <button type="button" onClick={onOpenModel}>
            <FlaskConical size={15} />
            Model
          </button>

          <button type="button" onClick={onOpenConnections}>
            <Network size={15} />
            Connections
          </button>
        </nav>

        <div className="helix-agent-sidebar-footer">
          <span>{domainLabel}</span>
          <span>{articles.length} sources found</span>
        </div>
      </aside>

      <section className="helix-agent-main">
        <header className="helix-agent-header">
          <div>
            <span>Helix research agent</span>
            <h1>{getStageTitle(stage)}</h1>
          </div>

          <div className="helix-agent-status">
            {isRunningStage ? (
              <>
                <LoaderCircle className="helix-agent-spin" size={16} />
                Running
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                Complete
              </>
            )}
          </div>
        </header>

        <section className="helix-agent-progress-section">
          <div className="helix-agent-progress-top">
            <span>Investigation progress</span>
            <strong>{progress}%</strong>
          </div>

          <div className="helix-agent-progress-track">
            <i style={{ width: `${progress}%` }} />
          </div>
        </section>

        <section className="helix-agent-content">
          {stage === 'understand' && (
            <article className="helix-agent-panel helix-agent-panel-large">
              <span className="helix-agent-label">Question analysis</span>

              <h2>I’m turning this into a focused research task.</h2>

              <p>
                The question is about <strong>{domainLabel}</strong>. The goal is to {goal.toLowerCase()}
              </p>

              <div className="helix-agent-grid">
                <div>
                  <span>Research question</span>
                  <strong>{map.question}</strong>
                </div>

                <div>
                  <span>Search query</span>
                  <strong>{evidenceQuery}</strong>
                </div>

                <div>
                  <span>Concepts detected</span>
                  <strong>{getImportantNodes(map).length}</strong>
                </div>

                <div>
                  <span>Relation claims</span>
                  <strong>{map.edges.length}</strong>
                </div>
              </div>
            </article>
          )}

          {stage === 'evidence' && (
            <article className="helix-agent-panel helix-agent-panel-large">
              <span className="helix-agent-label">Evidence search</span>

              <h2>I’m checking whether sources support the claim.</h2>

              {isLoadingEvidence && (
                <p>Searching scholarly metadata from the backend...</p>
              )}

              {evidenceError && (
                <p className="helix-agent-error">
                  Evidence error: {evidenceError}
                </p>
              )}

              {!isLoadingEvidence && !evidenceError && (
                <>
                  <p>
                    I found <strong>{articles.length}</strong> candidate sources. The next step is not just listing papers; it is checking whether the papers actually support the relationship in the question.
                  </p>

                  {topArticle && (
                    <div className="helix-agent-paper">
                      <span>{topArticle.provider} · {topArticle.year} · {topArticle.citationCount} citations</span>

                      <h3>{topArticle.title}</h3>

                      <p>{getShortAbstract(topArticle.abstract)}</p>

                      <a href={topArticle.url} target="_blank" rel="noreferrer">
                        Open source
                        <ArrowRight size={15} />
                      </a>
                    </div>
                  )}
                </>
              )}
            </article>
          )}

          {stage === 'mechanisms' && (
            <article className="helix-agent-panel">
              <span className="helix-agent-label">Hypothesis portfolio</span>

              <h2>I’m separating possible mechanisms.</h2>

              <div className="helix-agent-mechanism-list">
                {mechanisms.map((mechanism, index) => (
                  <div key={mechanism.id} className="helix-agent-mechanism-card">
                    <span>H{index + 1} · {mechanism.confidence}% confidence</span>
                    <h3>{mechanism.title}</h3>
                    <p>{mechanism.summary}</p>
                  </div>
                ))}
              </div>
            </article>
          )}

          {stage === 'tests' && (
            <article className="helix-agent-panel helix-agent-panel-large">
              <span className="helix-agent-label">Next best test</span>

              <h2>Now I’m choosing what would reduce uncertainty fastest.</h2>

              <p>
                The strongest next step is: <strong>{bestMechanism?.test}</strong>
              </p>

              <div className="helix-agent-grid">
                <div>
                  <span>Evidence check</span>
                  <strong>Do papers directly support the claim?</strong>
                </div>

                <div>
                  <span>Alternative check</span>
                  <strong>Could another mechanism explain the same result?</strong>
                </div>

                <div>
                  <span>Model check</span>
                  <strong>Does the visual model match the biology?</strong>
                </div>

                <div>
                  <span>Decision rule</span>
                  <strong>Advance only if multiple sources agree.</strong>
                </div>
              </div>
            </article>
          )}

          {stage === 'summary' && (
            <article className="helix-agent-panel helix-agent-panel-large">
              <span className="helix-agent-label">Final research readout</span>

              <h2>{bestMechanism?.title}</h2>

              <p>{bestMechanism?.summary}</p>

              <div className="helix-agent-grid">
                <div>
                  <span>Papers found</span>
                  <strong>{articles.length}</strong>
                </div>

                <div>
                  <span>Mechanisms generated</span>
                  <strong>{mechanisms.length}</strong>
                </div>

                <div>
                  <span>Confidence</span>
                  <strong>{bestMechanism?.confidence ?? 0}%</strong>
                </div>

                <div>
                  <span>Next action</span>
                  <strong>Inspect evidence and model.</strong>
                </div>
              </div>

              <div className="helix-agent-actions">
                <button type="button" onClick={onOpenEvidence}>
                  <BookOpen size={17} />
                  Evidence
                </button>

                <button type="button" onClick={onOpenModel}>
                  <Beaker size={17} />
                  Model
                </button>

                <button type="button" onClick={onOpenConnections}>
                  <Network size={17} />
                  Connections
                </button>
              </div>
            </article>
          )}
        </section>
      </section>
    </main>
  )
}
