import {
    detectResearchDomain,
  } from './detectResearchDomain'
  
  import type {
    ResearchDomain,
    ResearchMap,
    ResearchNode,
    ResearchNodeType,
  } from '../types/researchMap'
  
  
  interface TopicTemplate {
    keywords: string[]
  
    nodes: Array<{
      id: string
      label: string
      subtitle: string
      description: string
      type: ResearchNodeType
    }>
  
    relationships: Array<{
      source: string
      target: string
      label: string
      explanation: string
    }>
  }
  
  
  const templates:
    TopicTemplate[] = [
      {
        keywords: [
          'crispr',
          'cas9',
        ],
  
        nodes: [
          {
            id: 'crispr',
            label:
              'CRISPR',
            subtitle:
              'Genome-editing system',
            description:
              'A family of biological systems adapted for targeted genome editing.',
            type:
              'technology',
          },
  
          {
            id: 'cas9',
            label:
              'Cas9',
            subtitle:
              'Protein',
            description:
              'A programmable nuclease used in many CRISPR genome-editing systems.',
            type:
              'mechanism',
          },
  
          {
            id: 'guide-rna',
            label:
              'Guide RNA',
            subtitle:
              'Molecular component',
            description:
              'RNA that helps direct a CRISPR-associated protein toward a target sequence.',
            type:
              'molecule',
          },
  
          {
            id: 'dna-target',
            label:
              'Target DNA',
            subtitle:
              'Genetic target',
            description:
              'The DNA region selected for investigation or editing.',
            type:
              'concept',
          },
  
          {
            id: 'dna-repair',
            label:
              'DNA Repair',
            subtitle:
              'Cellular process',
            description:
              'Cellular repair processes influence the result after DNA is altered.',
            type:
              'process',
          },
        ],
  
        relationships: [
          {
            source:
              'guide-rna',
            target:
              'cas9',
            label:
              'guides',
            explanation:
              'Guide RNA provides sequence-specific targeting information to the editing complex.',
          },
  
          {
            source:
              'cas9',
            target:
              'dna-target',
            label:
              'acts on',
            explanation:
              'Cas9 can act at a DNA target specified by the guide sequence.',
          },
  
          {
            source:
              'dna-target',
            target:
              'dna-repair',
            label:
              'followed by',
            explanation:
              'Cellular DNA-repair processes influence what happens after the target site is altered.',
          },
  
          {
            source:
              'crispr',
            target:
              'cas9',
            label:
              'can use',
            explanation:
              'Cas9 is one of the proteins used in CRISPR-based genome-editing systems.',
          },
        ],
      },
  
      {
        keywords: [
          'battery',
          'lithium',
          'lithium-ion',
        ],
  
        nodes: [
          {
            id: 'battery',
            label:
              'Lithium-ion Battery',
            subtitle:
              'Energy technology',
            description:
              'A rechargeable electrochemical energy-storage system.',
            type:
              'technology',
          },
  
          {
            id: 'cathode',
            label:
              'Cathode',
            subtitle:
              'Electrode material',
            description:
              'One of the principal electrodes whose chemistry affects battery performance.',
            type:
              'material',
          },
  
          {
            id: 'anode',
            label:
              'Anode',
            subtitle:
              'Electrode material',
            description:
              'An electrode that participates in reversible ion-storage processes.',
            type:
              'material',
          },
  
          {
            id: 'electrolyte',
            label:
              'Electrolyte',
            subtitle:
              'Ion-transport medium',
            description:
              'The medium through which ions move between electrodes.',
            type:
              'material',
          },
  
          {
            id: 'sei',
            label:
              'SEI Formation',
            subtitle:
              'Interfacial process',
            description:
              'Formation and evolution of an interphase can influence performance and degradation.',
            type:
              'process',
          },
  
          {
            id: 'capacity-fade',
            label:
              'Capacity Fade',
            subtitle:
              'Degradation',
            description:
              'Loss of usable storage capacity as a battery ages.',
            type:
              'mechanism',
          },
        ],
  
        relationships: [
          {
            source:
              'battery',
            target:
              'cathode',
            label:
              'contains',
            explanation:
              'Cathode chemistry is a major component of lithium-ion cell behavior.',
          },
  
          {
            source:
              'battery',
            target:
              'anode',
            label:
              'contains',
            explanation:
              'The anode stores and releases ions during battery cycling.',
          },
  
          {
            source:
              'battery',
            target:
              'electrolyte',
            label:
              'uses',
            explanation:
              'The electrolyte enables ion transport between electrodes.',
          },
  
          {
            source:
              'anode',
            target:
              'sei',
            label:
              'interface',
            explanation:
              'Interphase formation at electrode surfaces is an important battery-aging process.',
          },
  
          {
            source:
              'sei',
            target:
              'capacity-fade',
            label:
              'can contribute to',
            explanation:
              'Interphase growth and related reactions can contribute to degradation mechanisms.',
          },
        ],
      },
  
      {
        keywords: [
          'dark matter',
        ],
  
        nodes: [
          {
            id: 'dark-matter',
            label:
              'Dark Matter',
            subtitle:
              'Scientific concept',
            description:
              'A term for matter inferred from gravitational observations but not yet directly identified.',
            type:
              'concept',
          },
  
          {
            id: 'galaxy-rotation',
            label:
              'Galaxy Rotation',
            subtitle:
              'Observation',
            description:
              'Galaxy rotation measurements are one source of evidence used in dark-matter research.',
            type:
              'evidence',
          },
  
          {
            id: 'lensing',
            label:
              'Gravitational Lensing',
            subtitle:
              'Observation',
            description:
              'Gravitational lensing can be used to infer the distribution of mass.',
            type:
              'evidence',
          },
  
          {
            id: 'wimp',
            label:
              'WIMP Models',
            subtitle:
              'Candidate model',
            description:
              'A broad historical class of hypothetical particle candidates for dark matter.',
            type:
              'theory',
          },
  
          {
            id: 'axion',
            label:
              'Axion Models',
            subtitle:
              'Candidate model',
            description:
              'Hypothetical light particles are another class of dark-matter candidates.',
            type:
              'theory',
          },
  
          {
            id: 'detection',
            label:
              'Direct Detection',
            subtitle:
              'Experiment',
            description:
              'Experiments attempt to detect possible interactions involving dark-matter candidates.',
            type:
              'experiment',
          },
        ],
  
        relationships: [
          {
            source:
              'galaxy-rotation',
            target:
              'dark-matter',
            label:
              'supports inference',
            explanation:
              'Observed galaxy dynamics contributed historically to the inference of unseen mass.',
          },
  
          {
            source:
              'lensing',
            target:
              'dark-matter',
            label:
              'maps mass',
            explanation:
              'Lensing observations provide information about mass distributions.',
          },
  
          {
            source:
              'wimp',
            target:
              'dark-matter',
            label:
              'candidate',
            explanation:
              'WIMPs represent one proposed class of dark-matter particle candidates.',
          },
  
          {
            source:
              'axion',
            target:
              'dark-matter',
            label:
              'candidate',
            explanation:
              'Axion-like particles represent another proposed candidate class.',
          },
  
          {
            source:
              'detection',
            target:
              'wimp',
            label:
              'tests',
            explanation:
              'Direct-detection experiments can test portions of candidate parameter space.',
          },
        ],
      },
    ]
  
  
  function findTemplate(
    question: string,
  ) {
    const normalized =
      question.toLowerCase()
  
  
    return templates.find(
      (template) =>
        template.keywords.some(
          (keyword) =>
            normalized.includes(
              keyword,
            ),
        ),
    )
  }
  
  
  function createQuestionNode(
    question: string,
    domain: ResearchDomain,
  ): ResearchNode {
    return {
      id:
        'research-question',
  
      type:
        'question',
  
      label:
        question,
  
      subtitle:
        'Research question',
  
      description:
        'The starting point for this scientific investigation.',
  
      domain,
  
      sourceIds: [],
  
      evidenceStrength:
        'unknown',
    }
  }
  
  
  function createFallbackMap(
    question: string,
    domain: ResearchDomain,
  ): ResearchMap {
    const questionNode =
      createQuestionNode(
        question,
        domain,
      )
  
  
    const overviewNode:
      ResearchNode = {
        id:
          'topic-overview',
  
        type:
          'concept',
  
        label:
          'Topic Overview',
  
        subtitle:
          domain,
  
        description:
          'A starting concept for organizing this research question.',
  
        domain,
  
        sourceIds: [],
  
        evidenceStrength:
          'unknown',
      }
  
  
    const mechanismsNode:
      ResearchNode = {
        id:
          'mechanisms',
  
        type:
          'mechanism',
  
        label:
          'Key Mechanisms',
  
        subtitle:
          'Research direction',
  
        description:
          'Investigate the processes and mechanisms that may explain the topic.',
  
        domain,
  
        sourceIds: [],
  
        evidenceStrength:
          'unknown',
      }
  
  
    const evidenceNode:
      ResearchNode = {
        id:
          'evidence',
  
        type:
          'evidence',
  
        label:
          'Evidence',
  
        subtitle:
          'Research direction',
  
        description:
          'Review experiments, observations, datasets, and scientific literature relevant to the question.',
  
        domain,
  
        sourceIds: [],
  
        evidenceStrength:
          'unknown',
      }
  
  
    const openQuestionsNode:
      ResearchNode = {
        id:
          'open-questions',
  
        type:
          'concept',
  
        label:
          'Open Questions',
  
        subtitle:
          'Research direction',
  
        description:
          'Identify uncertainties, competing explanations, and questions that remain unresolved.',
  
        domain,
  
        sourceIds: [],
  
        evidenceStrength:
          'unknown',
      }
  
  
    return {
      id:
        `research-${Date.now()}`,
  
      question,
  
      domain,
  
      title:
        'Scientific Research Map',
  
      summary:
        `Helix identified this question as ${domain}. This initial map provides research directions while authoritative scientific sources are retrieved.`,
  
      nodes: [
        questionNode,
        overviewNode,
        mechanismsNode,
        evidenceNode,
        openQuestionsNode,
      ],
  
      edges: [
        {
          id:
            'question-overview',
  
          sourceId:
            questionNode.id,
  
          targetId:
            overviewNode.id,
  
          relationship:
            'related-to',
  
          label:
            'topic',
  
          explanation:
            'This node represents the central scientific topic.',
  
          evidenceStrength:
            'unknown',
  
          sourceIds: [],
        },
  
        {
          id:
            'question-mechanisms',
  
          sourceId:
            questionNode.id,
  
          targetId:
            mechanismsNode.id,
  
          relationship:
            'related-to',
  
          label:
            'investigate',
  
          explanation:
            'Mechanistic understanding is one direction for investigating the question.',
  
          evidenceStrength:
            'unknown',
  
          sourceIds: [],
        },
  
        {
          id:
            'question-evidence',
  
          sourceId:
            questionNode.id,
  
          targetId:
            evidenceNode.id,
  
          relationship:
            'related-to',
  
          label:
            'evaluate',
  
          explanation:
            'Scientific evidence should be examined before drawing conclusions.',
  
          evidenceStrength:
            'unknown',
  
          sourceIds: [],
        },
  
        {
          id:
            'question-open',
  
          sourceId:
            questionNode.id,
  
          targetId:
            openQuestionsNode.id,
  
          relationship:
            'related-to',
  
          label:
            'explore',
  
          explanation:
            'Scientific research often contains uncertainties and unresolved questions.',
  
          evidenceStrength:
            'unknown',
  
          sourceIds: [],
        },
      ],
  
      sources: [],
  
      generatedAt:
        new Date()
          .toISOString(),
  
      notice:
        'This is an organizational research map, not a scientific conclusion. Claims should be verified against authoritative sources.',
    }
  }
  
  
  export function generateResearchMap(
    question: string,
  ): ResearchMap {
    const cleanedQuestion =
      question.trim()
  
  
    const domain =
      detectResearchDomain(
        cleanedQuestion,
      )
  
  
    const template =
      findTemplate(
        cleanedQuestion,
      )
  
  
    if (!template) {
      return createFallbackMap(
        cleanedQuestion,
        domain,
      )
    }
  
  
    const questionNode =
      createQuestionNode(
        cleanedQuestion,
        domain,
      )
  
  
    const topicNodes:
      ResearchNode[] =
        template.nodes.map(
          (node) => ({
            ...node,
  
            domain,
  
            sourceIds: [],
  
            evidenceStrength:
              'unknown',
          }),
        )
  
  
    const firstNode =
      topicNodes[0]
  
  
    const edges =
      template.relationships.map(
        (
          relationship,
          index,
        ) => ({
          id:
            `relationship-${index}`,
  
          sourceId:
            relationship.source,
  
          targetId:
            relationship.target,
  
          relationship:
            'related-to' as const,
  
          label:
            relationship.label,
  
          explanation:
            relationship.explanation,
  
          evidenceStrength:
            'unknown' as const,
  
          sourceIds: [],
        }),
      )
  
  
    if (firstNode) {
      edges.unshift({
        id:
          'question-topic',
  
        sourceId:
          questionNode.id,
  
        targetId:
          firstNode.id,
  
        relationship:
          'related-to',
  
        label:
          'investigates',
  
        explanation:
          'This concept is central to the research question.',
  
        evidenceStrength:
          'unknown',
  
        sourceIds: [],
      })
    }
  
  
    return {
      id:
        `research-${Date.now()}`,
  
      question:
        cleanedQuestion,
  
      domain,
  
      title:
        `${domain} Research Map`,
  
      summary:
        `Helix organized this ${domain.toLowerCase()} question into an explorable scientific concept network.`,
  
      nodes: [
        questionNode,
        ...topicNodes,
      ],
  
      edges,
  
      sources: [],
  
      generatedAt:
        new Date()
          .toISOString(),
  
      notice:
        'This map organizes scientific concepts for research exploration. Relationships without attached sources should not be treated as verified scientific claims.',
    }
  }
  