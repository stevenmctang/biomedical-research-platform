import type {
    ResearchDomain,
  } from '../types/researchMap'
  
  
  interface DomainRule {
    domain: ResearchDomain
  
    keywords: string[]
  }
  
  
  const domainRules: DomainRule[] = [
    {
      domain:
        'Biomedical Science',
  
      keywords: [
        'disease',
        'drug',
        'therapy',
        'therapeutic',
        'clinical',
        'patient',
        'cancer',
        'als',
        'alzheimer',
        'parkinson',
        'medicine',
        'medical',
      ],
    },
  
    {
      domain:
        'Neuroscience',
  
      keywords: [
        'brain',
        'neuron',
        'neural',
        'synapse',
        'dopamine',
        'cognition',
        'memory',
        'nervous system',
      ],
    },
  
    {
      domain:
        'Biology',
  
      keywords: [
        'gene',
        'protein',
        'cell',
        'dna',
        'rna',
        'crispr',
        'enzyme',
        'organism',
        'evolution',
        'genetic',
        'genome',
        'mitochondria',
        'photosynthesis',
      ],
    },
  
    {
      domain:
        'Chemistry',
  
      keywords: [
        'chemical',
        'reaction',
        'molecule',
        'molecular',
        'catalyst',
        'polymer',
        'acid',
        'base',
        'bond',
        'electrolyte',
        'oxidation',
        'reduction',
      ],
    },
  
    {
      domain:
        'Materials Science',
  
      keywords: [
        'material',
        'alloy',
        'semiconductor',
        'graphene',
        'battery',
        'lithium-ion',
        'cathode',
        'anode',
        'crystal',
        'nanomaterial',
        'degradation',
      ],
    },
  
    {
      domain:
        'Physics',
  
      keywords: [
        'physics',
        'quantum',
        'particle',
        'electron',
        'photon',
        'superconduct',
        'relativity',
        'gravity',
        'electromagnetic',
        'thermodynamic',
        'energy',
        'force',
      ],
    },
  
    {
      domain:
        'Astronomy',
  
      keywords: [
        'star',
        'planet',
        'exoplanet',
        'galaxy',
        'black hole',
        'cosmology',
        'dark matter',
        'dark energy',
        'universe',
        'supernova',
        'astronomy',
      ],
    },
  
    {
      domain:
        'Environmental Science',
  
      keywords: [
        'climate',
        'carbon capture',
        'pollution',
        'ecosystem',
        'environment',
        'emissions',
        'greenhouse',
        'biodiversity',
        'renewable',
      ],
    },
  
    {
      domain:
        'Earth Science',
  
      keywords: [
        'earthquake',
        'volcano',
        'tectonic',
        'geology',
        'mantle',
        'crust',
        'mineral',
        'ocean',
        'atmosphere',
      ],
    },
  
    {
      domain:
        'Computer Science',
  
      keywords: [
        'algorithm',
        'artificial intelligence',
        'machine learning',
        'neural network',
        'computer',
        'computing',
        'software',
        'processor',
        'database',
      ],
    },
  ]
  
  
  export function detectResearchDomain(
    question: string,
  ): ResearchDomain {
    const normalized =
      question
        .trim()
        .toLowerCase()
  
  
    if (!normalized) {
      return 'General Science'
    }
  
  
    let bestDomain:
      ResearchDomain =
        'General Science'
  
    let bestScore = 0
  
  
    for (
      const rule
      of domainRules
    ) {
      const score =
        rule.keywords.reduce(
          (
            total,
            keyword,
          ) => {
            if (
              normalized.includes(
                keyword,
              )
            ) {
              return total + 1
            }
  
            return total
          },
          0,
        )
  
  
      if (
        score >
        bestScore
      ) {
        bestScore =
          score
  
        bestDomain =
          rule.domain
      }
    }
  
  
    return bestDomain
  }
  