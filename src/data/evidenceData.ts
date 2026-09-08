import type { EvidenceRecord } from '../types/evidence'

export const evidenceRecords: EvidenceRecord[] = [
  {
    id: 'als-sod1',

    diseaseId: 'als',

    entityType: 'gene',

    entityId: 'sod1',

    title: 'ALS ↔ SOD1',

    summary:
      'SOD1 has a well-established genetic relationship with amyotrophic lateral sclerosis. Pathogenic SOD1 variants are associated with inherited forms of ALS, while SOD1 protein biology continues to be studied across ALS mechanisms and therapeutic research.',

    strength: 'Strong',

    categories: [
      'Genetics',
      'Literature',
      'Pathway',
      'Database',
    ],

    sources: [
      {
        id: 'ncbi-sod1',

        sourceType: 'NCBI Gene',

        title: 'SOD1 superoxide dismutase 1',

        publication: 'NCBI Gene',

        externalId: '6647',

        description:
          'NCBI identifies SOD1 as a protein-coding human gene and lists amyotrophic lateral sclerosis type 1 among its associated conditions.',
      },

      {
        id: 'pubmed-sod1-review-2024',

        sourceType: 'PubMed',

        title:
          'Amyotrophic lateral sclerosis caused by SOD1 variants: from genetic discovery to disease prevention',

        authors:
          'Benatar et al.',

        publication:
          'The Lancet Neurology',

        year: 2024,

        externalId: '39706636',

        doi:
          '10.1016/S1474-4422(24)00479-4',

        description:
          'Review describing the genetic discovery of SOD1-associated ALS and the development of SOD1-targeted therapeutic strategies.',
      },

      {
        id: 'pubmed-sod1-mechanisms-2024',

        sourceType: 'PubMed',

        title:
          'Current potential pathogenic mechanisms of copper-zinc superoxide dismutase 1 (SOD1) in amyotrophic lateral sclerosis',

        authors:
          'Wang et al.',

        publication:
          'Reviews in the Neurosciences',

        year: 2024,

        externalId: '38381656',

        doi:
          '10.1515/revneuro-2024-0010',

        description:
          'Review examining biological mechanisms investigated in SOD1-associated ALS, including oxidative stress and mitochondrial dysfunction.',
      },
    ],

    developmentOnly: false,
  },

  {
    id: 'als-c9orf72',

    diseaseId: 'als',

    entityType: 'gene',

    entityId: 'c9orf72',

    title: 'ALS ↔ C9orf72',

    summary:
      'C9orf72 repeat expansion is a major genetic finding studied across ALS and frontotemporal dementia research.',

    strength: 'Strong',

    categories: [
      'Genetics',
      'Literature',
    ],

    sources: [
      {
        id: 'pubmed-c9orf72-review-2024',

        sourceType: 'PubMed',

        title:
          'C9ORF72 hexanucleotide repeat expansion: From ALS and FTD to a broader pathogenic role?',

        publication:
          'Revue Neurologique',

        year: 2024,

        externalId: '38609750',

        doi:
          '10.1016/j.neurol.2024.03.008',

        description:
          'Review of the C9ORF72 repeat expansion and its relationship with ALS, FTD, disease biology, and therapeutic research.',
      },
    ],

    developmentOnly: false,
  },

  {
    id: 'als-tardbp',

    diseaseId: 'als',

    entityType: 'gene',

    entityId: 'tardbp',

    title: 'ALS ↔ TARDBP',

    summary:
      'TARDBP encodes TDP-43, an RNA-binding protein widely investigated in ALS biology.',

    strength: 'Strong',

    categories: [
      'Genetics',
      'Literature',
      'Pathway',
    ],

    sources: [],

    developmentOnly: true,
  },

  {
    id: 'als-fus',

    diseaseId: 'als',

    entityType: 'gene',

    entityId: 'fus',

    title: 'ALS ↔ FUS',

    summary:
      'FUS is an RNA-binding protein studied in ALS genetics and RNA-processing biology.',

    strength: 'Strong',

    categories: [
      'Genetics',
      'Literature',
      'Pathway',
    ],

    sources: [],

    developmentOnly: true,
  },

  {
    id: 'als-oxidative-stress',

    diseaseId: 'als',

    entityType: 'pathway',

    entityId: 'oxidative-stress',

    title: 'ALS ↔ Oxidative Stress',

    summary:
      'Oxidative stress is among the biological processes investigated in ALS research and appears in mechanistic research involving SOD1.',

    strength: 'Moderate',

    categories: [
      'Literature',
      'Pathway',
    ],

    sources: [
      {
        id: 'pubmed-sod1-oxidative-stress',

        sourceType: 'PubMed',

        title:
          'Current potential pathogenic mechanisms of copper-zinc superoxide dismutase 1 (SOD1) in amyotrophic lateral sclerosis',

        authors:
          'Wang et al.',

        publication:
          'Reviews in the Neurosciences',

        year: 2024,

        externalId: '38381656',

        doi:
          '10.1515/revneuro-2024-0010',

        description:
          'Review discussing oxidative stress among several investigated mechanisms in SOD1-associated ALS.',
      },
    ],

    developmentOnly: false,
  },

  {
    id: 'als-rna-processing',

    diseaseId: 'als',

    entityType: 'pathway',

    entityId: 'rna-processing',

    title: 'ALS ↔ RNA Processing',

    summary:
      'RNA-processing biology is studied in ALS because several ALS-associated proteins participate in RNA binding and regulation.',

    strength: 'Strong',

    categories: [
      'Genetics',
      'Literature',
      'Pathway',
    ],

    sources: [],

    developmentOnly: true,
  },

  {
    id: 'als-riluzole',

    diseaseId: 'als',

    entityType: 'drug',

    entityId: 'riluzole',

    title: 'ALS ↔ Riluzole',

    summary:
      'Riluzole has been evaluated in randomized controlled trials in ALS, providing direct clinical evidence for the therapeutic relationship represented in Helix.',

    strength: 'Strong',

    categories: [
      'Clinical',
      'Literature',
    ],

    sources: [
      {
        id: 'pubmed-riluzole-1994',

        sourceType: 'Clinical Study',

        title:
          'A controlled trial of riluzole in amyotrophic lateral sclerosis',

        authors:
          'Bensimon, Lacomblez & Meininger',

        publication:
          'New England Journal of Medicine',

        year: 1994,

        externalId: '8302340',

        doi:
          '10.1056/NEJM199403033300901',

        description:
          'Prospective randomized double-blind placebo-controlled study evaluating riluzole in people with ALS.',
      },

      {
        id: 'pubmed-riluzole-dose',

        sourceType: 'Clinical Study',

        title:
          'Dose-ranging study of riluzole in amyotrophic lateral sclerosis',

        publication:
          'The Lancet',

        year: 1996,

        externalId: '8676624',

        doi:
          '10.1016/S0140-6736(96)91680-3',

        description:
          'Multicenter randomized dose-ranging study evaluating several riluzole doses in ALS.',
      },
    ],

    developmentOnly: false,
  },

  {
    id: 'als-edaravone',

    diseaseId: 'als',

    entityType: 'drug',

    entityId: 'edaravone',

    title: 'ALS ↔ Edaravone',

    summary:
      'Edaravone is represented as a therapeutic relationship in the current Helix development dataset.',

    strength: 'Strong',

    categories: [
      'Clinical',
      'Literature',
    ],

    sources: [],

    developmentOnly: true,
  },
]
