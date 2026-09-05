import type {
    Disease,
    Drug,
    Gene,
    Pathway,
  } from '../types/biomedical'
  
  export const diseases: Disease[] = [
    {
      id: 'als',
      name: 'Amyotrophic Lateral Sclerosis',
      abbreviation: 'ALS',
  
      description:
        'A progressive neurodegenerative disease that affects motor neurons involved in voluntary muscle movement.',
  
      genes: ['sod1', 'c9orf72', 'tardbp', 'fus'],
  
      pathways: [
        'oxidative-stress',
        'rna-processing',
        'protein-homeostasis',
      ],
  
      drugs: ['riluzole', 'edaravone'],
  
      evidence: {
        genetics: 'strong',
        literature: 'strong',
        pathway: 'strong',
        clinical: 'strong',
      },
    },
  
    {
      id: 'alzheimers',
      name: "Alzheimer's Disease",
      abbreviation: 'AD',
  
      description:
        'A progressive neurological disease associated with changes in memory, cognition, and brain function.',
  
      genes: ['apoe'],
  
      pathways: ['amyloid-processing'],
  
      drugs: [],
  
      evidence: {
        genetics: 'strong',
        literature: 'strong',
        pathway: 'strong',
        clinical: 'strong',
      },
    },
  
    {
      id: 'parkinsons',
      name: "Parkinson's Disease",
      abbreviation: 'PD',
  
      description:
        'A progressive neurological disorder associated with movement and changes in dopamine-producing neurons.',
  
      genes: ['lrrk2'],
  
      pathways: [],
  
      drugs: [],
  
      evidence: {
        genetics: 'strong',
        literature: 'strong',
        pathway: 'moderate',
        clinical: 'strong',
      },
    },
  ]
  
  export const genes: Gene[] = [
    {
      id: 'sod1',
      symbol: 'SOD1',
      name: 'Superoxide Dismutase 1',
  
      description:
        'A gene encoding an enzyme involved in cellular defense against oxidative stress.',
  
      chromosome: '21',
  
      associatedDiseases: ['als'],
  
      pathways: ['oxidative-stress'],
    },
  
    {
      id: 'c9orf72',
      symbol: 'C9orf72',
      name: 'C9orf72',
  
      description:
        'A gene in which certain repeat expansions are associated with neurodegenerative disease.',
  
      chromosome: '9',
  
      associatedDiseases: ['als'],
  
      pathways: ['rna-processing'],
    },
  
    {
      id: 'tardbp',
      symbol: 'TARDBP',
      name: 'TAR DNA Binding Protein',
  
      description:
        'A gene encoding the TDP-43 protein, which participates in RNA processing.',
  
      chromosome: '1',
  
      associatedDiseases: ['als'],
  
      pathways: ['rna-processing', 'protein-homeostasis'],
    },
  
    {
      id: 'fus',
      symbol: 'FUS',
      name: 'FUS RNA Binding Protein',
  
      description:
        'A gene encoding an RNA-binding protein involved in several aspects of RNA metabolism.',
  
      chromosome: '16',
  
      associatedDiseases: ['als'],
  
      pathways: ['rna-processing'],
    },
  
    {
      id: 'apoe',
      symbol: 'APOE',
      name: 'Apolipoprotein E',
  
      description:
        'A gene involved in lipid transport with important associations in neurological research.',
  
      chromosome: '19',
  
      associatedDiseases: ['alzheimers'],
  
      pathways: ['amyloid-processing'],
    },
  
    {
      id: 'lrrk2',
      symbol: 'LRRK2',
      name: 'Leucine Rich Repeat Kinase 2',
  
      description:
        'A gene encoding a kinase studied extensively in relation to Parkinson’s disease biology.',
  
      chromosome: '12',
  
      associatedDiseases: ['parkinsons'],
  
      pathways: [],
    },
  ]
  
  export const drugs: Drug[] = [
    {
      id: 'riluzole',
      name: 'Riluzole',
  
      description:
        'A drug used in the treatment of amyotrophic lateral sclerosis.',
  
      targets: [],
  
      associatedDiseases: ['als'],
  
      developmentStatus: 'Approved',
    },
  
    {
      id: 'edaravone',
      name: 'Edaravone',
  
      description:
        'A therapeutic used in some patients with amyotrophic lateral sclerosis.',
  
      targets: [],
  
      associatedDiseases: ['als'],
  
      developmentStatus: 'Approved',
    },
  ]
  
  export const pathways: Pathway[] = [
    {
      id: 'oxidative-stress',
      name: 'Oxidative Stress',
  
      description:
        'Cellular processes involving an imbalance between reactive molecules and antioxidant defenses.',
  
      genes: ['sod1'],
    },
  
    {
      id: 'rna-processing',
      name: 'RNA Processing',
  
      description:
        'Biological processes involved in modifying, regulating, and processing RNA molecules.',
  
      genes: ['c9orf72', 'tardbp', 'fus'],
    },
  
    {
      id: 'protein-homeostasis',
      name: 'Protein Homeostasis',
  
      description:
        'Cellular systems responsible for maintaining appropriate protein production, folding, and degradation.',
  
      genes: ['tardbp'],
    },
  
    {
      id: 'amyloid-processing',
      name: 'Amyloid Processing',
  
      description:
        'Biological processes associated with the production, processing, and clearance of amyloid-related proteins.',
  
      genes: ['apoe'],
    },
  ]
  