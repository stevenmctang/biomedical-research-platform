import {
  AlertTriangle,
  ArrowRight,
  Beaker,
  BookOpen,
  Brain,
  CheckCircle2,
  Dna,
  FlaskConical,
  Network,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import {
  useMemo,
} from 'react'

import type {
  ResearchMap,
  ResearchNode,
} from '../types/researchMap'

import './ResearchVisualization.css'

interface ResearchVisualizationProps {
  project?: unknown
  map: ResearchMap
  onOpenMap: () => void
}

type ModelKind =
  | 'sod1-als'
  | 'tbi'
  | 'crispr'
  | 'drug-receptor'
  | 'general'

interface ModelStep {
  id: string
  label: string
  title: string
  description: string
  status: 'supported' | 'check' | 'uncertain'
}

interface ModelCard {
  title: string
  description: string
  icon: 'brain' | 'dna' | 'drug' | 'evidence' | 'network'
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getMapText(map: ResearchMap) {
  const nodes = map.nodes
    .map((node) =>
      [
        node.label,
        node.subtitle,
        node.description,
        node.type,
        node.domain,
      ]
        .filter(Boolean)
        .join(' '),
    )
    .join(' ')

  return normalizeText(`${map.question} ${map.domain} ${nodes}`)
}

function getModelKind(map: ResearchMap): ModelKind {
  const text = getMapText(map)

  if (text.includes('sod1') && text.includes('als')) {
    return 'sod1-als'
  }

  if (
    text.includes('tbi') ||
    text.includes('traumatic brain injury') ||
    text.includes('brain injury') ||
    text.includes('concussion')
  ) {
    return 'tbi'
  }

  if (
    text.includes('crispr') ||
    text.includes('cas9') ||
    text.includes('guide rna')
  ) {
    return 'crispr'
  }

  if (
    text.includes('drug') ||
    text.includes('receptor') ||
    text.includes('ligand') ||
    text.includes('binding')
  ) {
    return 'drug-receptor'
  }

  return 'general'
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

function getNodeDescription(node: ResearchNode) {
  return node.description ||
    node.subtitle ||
    `${node.label} is a concept Helix identified from the research question.`
}

function getModelTitle(kind: ModelKind, map: ResearchMap) {
  if (kind === 'sod1-als') {
    return 'SOD1–ALS mechanism model'
  }

  if (kind === 'tbi') {
    return 'Traumatic brain injury cascade model'
  }

  if (kind === 'crispr') {
    return 'CRISPR-Cas9 targeting model'
  }

  if (kind === 'drug-receptor') {
    return 'Drug–receptor interaction model'
  }

  return `Research model for: ${map.question}`
}

function getModelSubtitle(kind: ModelKind) {
  if (kind === 'sod1-als') {
    return 'A pathway-style model of how SOD1-related evidence may connect to ALS mechanisms.'
  }

  if (kind === 'tbi') {
    return 'A staged model showing primary injury, secondary injury, evidence checks, and recovery questions.'
  }

  if (kind === 'crispr') {
    return 'A mechanism model showing guide RNA targeting, PAM recognition, cleavage, and repair outcome.'
  }

  if (kind === 'drug-receptor') {
    return 'A mechanism model showing target binding, downstream effect, evidence, and validation.'
  }

  return 'A cautious model view that avoids fake anatomy or fake molecular structures when the topic is too broad.'
}

function getModelSteps(kind: ModelKind, map: ResearchMap): ModelStep[] {
  if (kind === 'sod1-als') {
    return [
      {
        id: 'sod1',
        label: 'Entity',
        title: 'SOD1 involvement',
        description:
          'The model starts with SOD1 because the user is asking whether evidence connects SOD1 to ALS.',
        status: 'supported',
      },
      {
        id: 'protein',
        label: 'Mechanism',
        title: 'Protein dysfunction or misfolding',
        description:
          'A plausible mechanism is that altered SOD1 protein behavior contributes to stress in vulnerable motor neurons.',
        status: 'check',
      },
      {
        id: 'neurons',
        label: 'System',
        title: 'Motor neuron vulnerability',
        description:
          'The disease-relevant system is motor neurons, so the evidence should connect SOD1 effects to neuron damage or degeneration.',
        status: 'check',
      },
      {
        id: 'als',
        label: 'Outcome',
        title: 'ALS disease connection',
        description:
          'The final claim should only be treated as supported if papers directly connect SOD1 biology to ALS mechanisms or cases.',
        status: 'uncertain',
      },
    ]
  }

  if (kind === 'tbi') {
    return [
      {
        id: 'impact',
        label: 'Primary event',
        title: 'Mechanical brain injury',
        description:
          'TBI begins with a physical force that can damage tissue, blood vessels, or neural connections.',
        status: 'supported',
      },
      {
        id: 'secondary',
        label: 'Secondary cascade',
        title: 'Inflammation, metabolic stress, and axonal disruption',
        description:
          'A key research question is how secondary injury processes continue after the initial impact.',
        status: 'check',
      },
      {
        id: 'symptoms',
        label: 'Functional effect',
        title: 'Cognitive, mood, movement, or memory changes',
        description:
          'The model should connect biological mechanisms to observable effects without claiming diagnosis.',
        status: 'check',
      },
      {
        id: 'recovery',
        label: 'Open question',
        title: 'Recovery and long-term outcome',
        description:
          'The unresolved part is which mechanism best predicts recovery, severity, or long-term symptoms.',
        status: 'uncertain',
      },
    ]
  }

  if (kind === 'crispr') {
    return [
      {
        id: 'guide',
        label: 'Targeting',
        title: 'Guide RNA identifies the DNA sequence',
        description:
          'The guide RNA provides sequence specificity by matching the target DNA region.',
        status: 'supported',
      },
      {
        id: 'pam',
        label: 'Constraint',
        title: 'PAM recognition allows Cas9 binding',
        description:
          'Cas9 usually requires a nearby PAM sequence before stable target engagement can happen.',
        status: 'supported',
      },
      {
        id: 'cut',
        label: 'Action',
        title: 'Cas9 cuts the DNA',
        description:
          'The complex introduces a break at or near the target sequence.',
        status: 'check',
      },
      {
        id: 'repair',
        label: 'Outcome',
        title: 'DNA repair determines the final edit',
        description:
          'The final result depends on repair pathways, not just the Cas9 cut itself.',
        status: 'check',
      },
    ]
  }

  if (kind === 'drug-receptor') {
    return [
      {
        id: 'target',
        label: 'Target',
        title: 'Protein or receptor target',
        description:
          'The model starts with a biological target that the compound may bind.',
        status: 'check',
      },
      {
        id: 'binding',
        label: 'Interaction',
        title: 'Ligand binding changes target behavior',
        description:
          'A drug-like compound may stabilize, inhibit, activate, or block a receptor or protein state.',
        status: 'check',
      },
      {
        id: 'effect',
        label: 'Effect',
        title: 'Downstream pathway effect',
        description:
          'Binding is only meaningful if it changes a pathway, signal, phenotype, or measurable response.',
        status: 'uncertain',
      },
      {
        id: 'validation',
        label: 'Validation',
        title: 'Binding and function must be tested separately',
        description:
          'A strong claim needs both binding evidence and functional evidence.',
        status: 'check',
      },
    ]
  }

  const nodes = getImportantNodes(map)

  if (nodes.length > 0) {
    return nodes.slice(0, 4).map((node, index) => ({
      id: node.id,
      label: index === 0 ? 'Concept' : 'Related concept',
      title: node.label,
      description: getNodeDescription(node),
      status: index === 0 ? 'check' : 'uncertain',
    }))
  }

  return [
    {
      id: 'question',
      label: 'Question',
      title: map.question,
      description:
        'The topic is broad, so Helix should avoid pretending it has a precise anatomical or molecular model.',
      status: 'uncertain',
    },
    {
      id: 'evidence',
      label: 'Evidence need',
      title: 'Search for named entities and mechanisms',
      description:
        'The next step is to extract specific genes, proteins, pathways, measurements, or diseases from sources.',
      status: 'check',
    },
  ]
}

function getModelCards(kind: ModelKind): ModelCard[] {
  if (kind === 'sod1-als') {
    return [
      {
        title: 'What this model can show',
        description:
          'It can show a research pathway from SOD1 to possible motor neuron stress mechanisms and ALS evidence checks.',
        icon: 'network',
      },
      {
        title: 'What it should not claim',
        description:
          'It should not claim every ALS case is caused by SOD1 or that SOD1 evidence proves a treatment.',
        icon: 'evidence',
      },
      {
        title: 'Best next evidence check',
        description:
          'Look for papers that directly connect SOD1 mutation, protein behavior, motor neuron effects, and ALS outcomes.',
        icon: 'drug',
      },
    ]
  }

  if (kind === 'tbi') {
    return [
      {
        title: 'What this model can show',
        description:
          'It can show the sequence from impact to secondary injury mechanisms and functional outcomes.',
        icon: 'brain',
      },
      {
        title: 'What it should not claim',
        description:
          'It is not a medical scan, diagnostic tool, or exact patient-specific brain model.',
        icon: 'evidence',
      },
      {
        title: 'Best next evidence check',
        description:
          'Compare which mechanisms are supported by TBI papers: inflammation, axonal injury, vascular damage, or metabolic stress.',
        icon: 'network',
      },
    ]
  }

  if (kind === 'crispr') {
    return [
      {
        title: 'What this model can show',
        description:
          'It can show targeting logic: guide RNA, PAM recognition, DNA cleavage, and repair outcome.',
        icon: 'dna',
      },
      {
        title: 'What it should not claim',
        description:
          'It should not imply every guide RNA works equally well or that editing is always precise.',
        icon: 'evidence',
      },
      {
        title: 'Best next evidence check',
        description:
          'Check sources for guide RNA specificity, off-target effects, PAM rules, and repair pathway outcomes.',
        icon: 'network',
      },
    ]
  }

  if (kind === 'drug-receptor') {
    return [
      {
        title: 'What this model can show',
        description:
          'It can show a research logic chain from binding to pathway effect to validation.',
        icon: 'drug',
      },
      {
        title: 'What it should not claim',
        description:
          'It should not imply binding alone proves therapeutic effect.',
        icon: 'evidence',
      },
      {
        title: 'Best next evidence check',
        description:
          'Check whether sources show both target engagement and downstream biological effect.',
        icon: 'network',
      },
    ]
  }

  return [
    {
      title: 'Model confidence is limited',
      description:
        'The question is too broad for a precise visual model. Helix should first identify specific entities and mechanisms.',
      icon: 'evidence',
    },
    {
      title: 'Use connections as support',
      description:
        'The connections board should show what claims need evidence instead of pretending all links are already proven.',
        icon: 'network',
    },
    {
      title: 'Next upgrade',
      description:
        'Make the backend extract named entities from papers so the model becomes source-specific.',
      icon: 'sparkles' as ModelCard['icon'],
    },
  ]
}

function getIcon(icon: ModelCard['icon']) {
  if (icon === 'brain') {
    return <Brain size={20} />
  }

  if (icon === 'dna') {
    return <Dna size={20} />
  }

  if (icon === 'drug') {
    return <FlaskConical size={20} />
  }

  if (icon === 'evidence') {
    return <BookOpen size={20} />
  }

  if (icon === 'network') {
    return <Network size={20} />
  }

  return <Sparkles size={20} />
}

function getStatusIcon(status: ModelStep['status']) {
  if (status === 'supported') {
    return <CheckCircle2 size={18} />
  }

  if (status === 'check') {
    return <Beaker size={18} />
  }

  return <AlertTriangle size={18} />
}

function getStatusText(status: ModelStep['status']) {
  if (status === 'supported') {
    return 'Reasonable starting point'
  }

  if (status === 'check') {
    return 'Needs evidence check'
  }

  return 'Unresolved'
}

export function ResearchVisualization({
  map,
  onOpenMap,
}: ResearchVisualizationProps) {
  const kind = useMemo(
    () => getModelKind(map),
    [map],
  )

  const steps = useMemo(
    () => getModelSteps(kind, map),
    [kind, map],
  )

  const cards = useMemo(
    () => getModelCards(kind),
    [kind],
  )

  return (
    <main className="helix-model-page">
      <section className="helix-model-shell">
        <header className="helix-model-hero">
          <div>
            <span className="helix-model-kicker">
              <ShieldCheck size={16} />
              Evidence-aware model view
            </span>

            <h1>
              {getModelTitle(kind, map)}
            </h1>

            <p>
              {getModelSubtitle(kind)}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenMap}
            className="helix-model-secondary-button"
          >
            Open connections
            <ArrowRight size={17} />
          </button>
        </header>

        <section className="helix-model-warning">
          <AlertTriangle size={18} />

          <p>
            This model is a research explanation, not a diagnosis, clinical
            recommendation, validated molecular simulation, or patient-specific
            anatomical model.
          </p>
        </section>

        <section className="helix-model-flow">
          {steps.map((step, index) => (
            <article
              key={step.id}
              className="helix-model-step"
            >
              <div className="helix-model-step-top">
                <span>
                  {String(index + 1).padStart(2, '0')}
                </span>

                <em className={`helix-model-status-${step.status}`}>
                  {getStatusIcon(step.status)}
                  {getStatusText(step.status)}
                </em>
              </div>

              <small>
                {step.label}
              </small>

              <h2>
                {step.title}
              </h2>

              <p>
                {step.description}
              </p>
            </article>
          ))}
        </section>

        <section className="helix-model-card-grid">
          {cards.map((card) => (
            <article
              key={card.title}
              className="helix-model-info-card"
            >
              <div>
                {getIcon(card.icon)}
              </div>

              <h3>
                {card.title}
              </h3>

              <p>
                {card.description}
              </p>
            </article>
          ))}
        </section>
      </section>
    </main>
  )
}
