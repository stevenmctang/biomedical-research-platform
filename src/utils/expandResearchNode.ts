import type {
    ResearchEdge,
    ResearchNode,
    ResearchNodeType,
  } from '../types/researchMap'
  
  
  interface ExpansionConcept {
    id: string
  
    label: string
  
    subtitle: string
  
    description: string
  
    type: ResearchNodeType
  
    relationshipLabel: string
  
    relationshipExplanation: string
  }
  
  
  interface NodeExpansion {
    nodes: ResearchNode[]
  
    edges: ResearchEdge[]
  }
  
  
  function normalize(
    value: string,
  ) {
    return value
      .trim()
      .toLowerCase()
  }
  
  
  function slugify(
    value: string,
  ) {
    return value
      .trim()
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        '-',
      )
      .replace(
        /^-|-$/g,
        '',
      )
  }
  
  
  const expansionLibrary:
    Record<
      string,
      ExpansionConcept[]
    > = {
      crispr: [
        {
          id:
            'crispr-applications',
  
          label:
            'Genome Editing',
  
          subtitle:
            'Application',
  
          description:
            'CRISPR systems can be adapted to make targeted changes in genetic material.',
  
          type:
            'technology',
  
          relationshipLabel:
            'enables',
  
          relationshipExplanation:
            'CRISPR-based systems can be used as programmable genome-editing technologies.',
        },
  
        {
          id:
            'crispr-specificity',
  
          label:
            'Target Specificity',
  
          subtitle:
            'Research challenge',
  
          description:
            'Researchers study how accurately CRISPR systems distinguish intended targets from similar sequences.',
  
          type:
            'concept',
  
          relationshipLabel:
            'depends on',
  
          relationshipExplanation:
            'The usefulness of CRISPR systems depends partly on how specifically they recognize intended targets.',
        },
  
        {
          id:
            'crispr-delivery',
  
          label:
            'Delivery Systems',
  
          subtitle:
            'Technology',
  
          description:
            'Delivery methods determine how genome-editing components reach cells or tissues.',
  
          type:
            'technology',
  
          relationshipLabel:
            'requires',
  
          relationshipExplanation:
            'Many CRISPR applications require a method for delivering editing components to the target system.',
        },
      ],
  
  
      cas9: [
        {
          id:
            'pam-sequence',
  
          label:
            'PAM Sequence',
  
          subtitle:
            'Recognition motif',
  
          description:
            'A short DNA motif near a target site that is required for recognition by many Cas9 proteins.',
  
          type:
            'concept',
  
          relationshipLabel:
            'recognizes',
  
          relationshipExplanation:
            'Cas9 target recognition typically depends on the presence of a compatible PAM sequence.',
        },
  
        {
          id:
            'dna-cleavage',
  
          label:
            'DNA Cleavage',
  
          subtitle:
            'Molecular mechanism',
  
          description:
            'Cas9 can create breaks in DNA after recognizing an appropriate target.',
  
          type:
            'mechanism',
  
          relationshipLabel:
            'can produce',
  
          relationshipExplanation:
            'After target recognition, Cas9 nuclease activity can cleave DNA.',
        },
  
        {
          id:
            'off-target-effects',
  
          label:
            'Off-target Effects',
  
          subtitle:
            'Research challenge',
  
          description:
            'Unintended editing at similar genomic locations is an important area of genome-editing research.',
  
          type:
            'concept',
  
          relationshipLabel:
            'can involve',
  
          relationshipExplanation:
            'Cas9 systems can sometimes interact with unintended sequences, motivating specificity research.',
        },
      ],
  
  
      'guide rna': [
        {
          id:
            'guide-spacer',
  
          label:
            'Spacer Sequence',
  
          subtitle:
            'RNA component',
  
          description:
            'The targeting portion of a guide RNA contains sequence information complementary to the intended DNA target.',
  
          type:
            'molecule',
  
          relationshipLabel:
            'contains',
  
          relationshipExplanation:
            'The spacer sequence provides much of the targeting information used by the guide RNA.',
        },
  
        {
          id:
            'guide-scaffold',
  
          label:
            'RNA Scaffold',
  
          subtitle:
            'Structural component',
  
          description:
            'A structural region of the guide RNA interacts with the Cas protein.',
  
          type:
            'molecule',
  
          relationshipLabel:
            'contains',
  
          relationshipExplanation:
            'Guide RNAs contain structural regions that support interaction with Cas proteins.',
        },
  
        {
          id:
            'rna-dna-pairing',
  
          label:
            'RNA–DNA Pairing',
  
          subtitle:
            'Recognition mechanism',
  
          description:
            'Complementary base pairing helps guide the editing complex toward matching DNA sequences.',
  
          type:
            'mechanism',
  
          relationshipLabel:
            'uses',
  
          relationshipExplanation:
            'Guide RNA targeting relies on sequence complementarity with the target DNA.',
        },
      ],
  
  
      'target dna': [
        {
          id:
            'target-site',
  
          label:
            'Target Site',
  
          subtitle:
            'Genomic location',
  
          description:
            'The specific region of DNA selected for investigation or editing.',
  
          type:
            'concept',
  
          relationshipLabel:
            'contains',
  
          relationshipExplanation:
            'Target DNA includes the genomic site chosen for investigation.',
        },
  
        {
          id:
            'sequence-complementarity',
  
          label:
            'Sequence Complementarity',
  
          subtitle:
            'Recognition principle',
  
          description:
            'Similarity between guide and target sequences influences recognition.',
  
          type:
            'mechanism',
  
          relationshipLabel:
            'depends on',
  
          relationshipExplanation:
            'Recognition of target DNA depends partly on sequence complementarity.',
        },
      ],
  
  
      'dna repair': [
        {
          id:
            'nhej',
  
          label:
            'NHEJ',
  
          subtitle:
            'DNA repair pathway',
  
          description:
            'Non-homologous end joining is one pathway cells can use to repair DNA breaks.',
  
          type:
            'pathway',
  
          relationshipLabel:
            'can use',
  
          relationshipExplanation:
            'Cells can repair some DNA breaks through non-homologous end joining.',
        },
  
        {
          id:
            'hdr',
  
          label:
            'HDR',
  
          subtitle:
            'DNA repair pathway',
  
          description:
            'Homology-directed repair can use a related DNA template during repair.',
  
          type:
            'pathway',
  
          relationshipLabel:
            'can use',
  
          relationshipExplanation:
            'Some DNA repair events can proceed through homology-directed mechanisms.',
        },
  
        {
          id:
            'repair-outcome',
  
          label:
            'Editing Outcome',
  
          subtitle:
            'Result',
  
          description:
            'The final genetic change depends strongly on how the cell repairs altered DNA.',
  
          type:
            'concept',
  
          relationshipLabel:
            'influences',
  
          relationshipExplanation:
            'DNA repair processes influence the outcome of genome editing.',
        },
      ],
  
  
      'lithium-ion battery': [
        {
          id:
            'charge-cycle',
  
          label:
            'Charge Cycling',
  
          subtitle:
            'Operating process',
  
          description:
            'Repeated charging and discharging changes electrode and electrolyte conditions over time.',
  
          type:
            'process',
  
          relationshipLabel:
            'undergoes',
  
          relationshipExplanation:
            'Lithium-ion batteries repeatedly cycle between charged and discharged states.',
        },
  
        {
          id:
            'battery-temperature',
  
          label:
            'Temperature',
  
          subtitle:
            'Operating condition',
  
          description:
            'Temperature influences reaction rates, transport, degradation, and battery performance.',
  
          type:
            'concept',
  
          relationshipLabel:
            'affected by',
  
          relationshipExplanation:
            'Battery behavior and aging are influenced by operating temperature.',
        },
  
        {
          id:
            'battery-aging',
  
          label:
            'Battery Aging',
  
          subtitle:
            'Degradation process',
  
          description:
            'Multiple chemical and mechanical processes gradually change battery performance.',
  
          type:
            'process',
  
          relationshipLabel:
            'experiences',
  
          relationshipExplanation:
            'Lithium-ion batteries undergo multiple aging processes during use and storage.',
        },
      ],
  
  
      cathode: [
        {
          id:
            'cathode-structure',
  
          label:
            'Crystal Structure',
  
          subtitle:
            'Material property',
  
          description:
            'Cathode crystal structure affects ion movement, stability, and electrochemical behavior.',
  
          type:
            'material',
  
          relationshipLabel:
            'depends on',
  
          relationshipExplanation:
            'Cathode performance is influenced by its underlying material structure.',
        },
  
        {
          id:
            'transition-metals',
  
          label:
            'Transition Metals',
  
          subtitle:
            'Material chemistry',
  
          description:
            'Many cathode chemistries use transition-metal compounds that participate in electrochemical reactions.',
  
          type:
            'material',
  
          relationshipLabel:
            'can contain',
  
          relationshipExplanation:
            'Common cathode materials often contain transition-metal compounds.',
        },
  
        {
          id:
            'cathode-degradation',
  
          label:
            'Cathode Degradation',
  
          subtitle:
            'Degradation mechanism',
  
          description:
            'Structural and chemical changes can reduce cathode performance over repeated cycling.',
  
          type:
            'mechanism',
  
          relationshipLabel:
            'can undergo',
  
          relationshipExplanation:
            'Cathode materials can undergo structural or chemical degradation during operation.',
        },
      ],
  
  
      anode: [
        {
          id:
            'graphite',
  
          label:
            'Graphite',
  
          subtitle:
            'Anode material',
  
          description:
            'Graphite is widely used as an anode material in lithium-ion batteries.',
  
          type:
            'material',
  
          relationshipLabel:
            'can use',
  
          relationshipExplanation:
            'Many lithium-ion battery designs use graphite-based anodes.',
        },
  
        {
          id:
            'lithium-plating',
  
          label:
            'Lithium Plating',
  
          subtitle:
            'Degradation mechanism',
  
          description:
            'Under some conditions, metallic lithium can deposit on an electrode surface instead of being stored normally.',
  
          type:
            'mechanism',
  
          relationshipLabel:
            'can experience',
  
          relationshipExplanation:
            'Certain charging conditions can contribute to lithium plating at the anode.',
        },
  
        {
          id:
            'anode-expansion',
  
          label:
            'Volume Change',
  
          subtitle:
            'Mechanical process',
  
          description:
            'Some anode materials expand and contract as ions enter and leave their structure.',
  
          type:
            'process',
  
          relationshipLabel:
            'undergoes',
  
          relationshipExplanation:
            'Ion storage can cause mechanical volume changes in anode materials.',
        },
      ],
  
  
      electrolyte: [
        {
          id:
            'electrolyte-decomposition',
  
          label:
            'Electrolyte Decomposition',
  
          subtitle:
            'Chemical reaction',
  
          description:
            'Electrolyte components can undergo side reactions during battery operation.',
  
          type:
            'process',
  
          relationshipLabel:
            'can undergo',
  
          relationshipExplanation:
            'Electrolytes can participate in unwanted chemical reactions during cycling.',
        },
  
        {
          id:
            'ion-transport',
  
          label:
            'Ion Transport',
  
          subtitle:
            'Transport process',
  
          description:
            'The electrolyte enables movement of ions between battery electrodes.',
  
          type:
            'process',
  
          relationshipLabel:
            'enables',
  
          relationshipExplanation:
            'Electrolytes provide a medium for ion transport between electrodes.',
        },
  
        {
          id:
            'electrolyte-additives',
  
          label:
            'Electrolyte Additives',
  
          subtitle:
            'Material strategy',
  
          description:
            'Small amounts of additional compounds can be used to influence interfacial chemistry.',
  
          type:
            'material',
  
          relationshipLabel:
            'can include',
  
          relationshipExplanation:
            'Battery electrolytes may contain additives designed to alter chemical behavior.',
        },
      ],
  
  
      'sei formation': [
        {
          id:
            'sei-growth',
  
          label:
            'SEI Growth',
  
          subtitle:
            'Interfacial process',
  
          description:
            'The solid-electrolyte interphase can continue changing during battery operation.',
  
          type:
            'process',
  
          relationshipLabel:
            'can continue as',
  
          relationshipExplanation:
            'The interphase can grow or evolve during repeated cycling and storage.',
        },
  
        {
          id:
            'lithium-inventory-loss',
  
          label:
            'Lithium Inventory Loss',
  
          subtitle:
            'Degradation mechanism',
  
          description:
            'Side reactions can reduce the amount of lithium available for reversible cycling.',
  
          type:
            'mechanism',
  
          relationshipLabel:
            'can contribute to',
  
          relationshipExplanation:
            'Interphase-forming reactions can consume cyclable lithium.',
        },
  
        {
          id:
            'impedance-growth',
  
          label:
            'Impedance Growth',
  
          subtitle:
            'Performance effect',
  
          description:
            'Changes at interfaces can increase resistance to charge transport.',
  
          type:
            'mechanism',
  
          relationshipLabel:
            'can contribute to',
  
          relationshipExplanation:
            'Interphase evolution can increase resistance within a battery cell.',
        },
      ],
  
  
      'capacity fade': [
        {
          id:
            'active-material-loss',
  
          label:
            'Active Material Loss',
  
          subtitle:
            'Degradation mechanism',
  
          description:
            'Some electrode material can become unavailable for normal electrochemical cycling.',
  
          type:
            'mechanism',
  
          relationshipLabel:
            'can involve',
  
          relationshipExplanation:
            'Capacity loss can result partly from loss of electrochemically active material.',
        },
  
        {
          id:
            'cyclable-lithium-loss',
  
          label:
            'Cyclable Lithium Loss',
  
          subtitle:
            'Degradation mechanism',
  
          description:
            'Loss of usable lithium inventory can reduce the amount of charge a cell can store.',
  
          type:
            'mechanism',
  
          relationshipLabel:
            'can involve',
  
          relationshipExplanation:
            'Capacity fade can occur when less lithium remains available for reversible cycling.',
        },
      ],
  
  
      'dark matter': [
        {
          id:
            'cosmic-microwave-background',
  
          label:
            'Cosmic Microwave Background',
  
          subtitle:
            'Cosmological evidence',
  
          description:
            'Measurements of the early universe provide constraints on cosmological matter content.',
  
          type:
            'evidence',
  
          relationshipLabel:
            'constrains',
  
          relationshipExplanation:
            'Cosmic microwave background observations help constrain models of cosmic matter.',
        },
  
        {
          id:
            'structure-formation',
  
          label:
            'Structure Formation',
  
          subtitle:
            'Cosmological process',
  
          description:
            'Models of how galaxies and large-scale cosmic structures formed depend on the distribution of matter.',
  
          type:
            'process',
  
          relationshipLabel:
            'influences',
  
          relationshipExplanation:
            'Dark-matter models play an important role in theories of cosmic structure formation.',
        },
  
        {
          id:
            'dark-matter-distribution',
  
          label:
            'Halo Models',
  
          subtitle:
            'Model',
  
          description:
            'Dark-matter halo models describe inferred mass surrounding galaxies and larger structures.',
  
          type:
            'theory',
  
          relationshipLabel:
            'modeled as',
  
          relationshipExplanation:
            'Astronomical systems are often modeled as containing extended dark-matter halos.',
        },
      ],
  
  
      'wimp models': [
        {
          id:
            'wimp-direct-detection',
  
          label:
            'Nuclear Recoil Searches',
  
          subtitle:
            'Experiment',
  
          description:
            'Some experiments look for small energy deposits that could result from hypothetical particle interactions.',
  
          type:
            'experiment',
  
          relationshipLabel:
            'tested by',
  
          relationshipExplanation:
            'Direct-detection experiments test portions of WIMP parameter space.',
        },
  
        {
          id:
            'wimp-collider',
  
          label:
            'Collider Searches',
  
          subtitle:
            'Experiment',
  
          description:
            'Particle collider experiments can search for signatures consistent with new invisible particles.',
  
          type:
            'experiment',
  
          relationshipLabel:
            'investigated by',
  
          relationshipExplanation:
            'Collider experiments can test certain particle-based dark-matter models.',
        },
      ],
  
  
      'axion models': [
        {
          id:
            'axion-detectors',
  
          label:
            'Axion Detection',
  
          subtitle:
            'Experiment',
  
          description:
            'Specialized experiments search for possible signatures of axion-like particles.',
  
          type:
            'experiment',
  
          relationshipLabel:
            'tested by',
  
          relationshipExplanation:
            'Axion models motivate specialized experimental detection strategies.',
        },
  
        {
          id:
            'axion-field',
  
          label:
            'Axion Field',
  
          subtitle:
            'Theoretical concept',
  
          description:
            'Some models describe axions as a light field that could contribute to cosmic dark matter.',
  
          type:
            'theory',
  
          relationshipLabel:
            'described by',
  
          relationshipExplanation:
            'Axion dark-matter models can be formulated using light-field descriptions.',
        },
      ],
    }
  
  
  function createGenericExpansion(
    node: ResearchNode,
  ): ExpansionConcept[] {
    const label =
      node.label
  
    if (
      node.type ===
      'technology'
    ) {
      return [
        {
          id:
            `${slugify(label)}-components`,
  
          label:
            `${label} Components`,
  
          subtitle:
            'System components',
  
          description:
            `Investigate the major components that make up ${label}.`,
  
          type:
            'concept',
  
          relationshipLabel:
            'contains',
  
          relationshipExplanation:
            `${label} can be studied by identifying its major components.`,
        },
  
        {
          id:
            `${slugify(label)}-mechanism`,
  
          label:
            `${label} Mechanism`,
  
          subtitle:
            'How it works',
  
          description:
            `Investigate the processes responsible for how ${label} functions.`,
  
          type:
            'mechanism',
  
          relationshipLabel:
            'works through',
  
          relationshipExplanation:
            `${label} can be explored through the mechanisms that produce its behavior.`,
        },
  
        {
          id:
            `${slugify(label)}-limitations`,
  
          label:
            `${label} Limitations`,
  
          subtitle:
            'Research challenge',
  
          description:
            `Investigate known limitations, constraints, and unresolved challenges involving ${label}.`,
  
          type:
            'concept',
  
          relationshipLabel:
            'has',
  
          relationshipExplanation:
            `Scientific evaluation of ${label} includes understanding limitations and unresolved challenges.`,
        },
      ]
    }
  
  
    if (
      node.type ===
      'mechanism' ||
      node.type ===
      'process' ||
      node.type ===
      'pathway'
    ) {
      return [
        {
          id:
            `${slugify(label)}-drivers`,
  
          label:
            'Upstream Factors',
  
          subtitle:
            'Inputs',
  
          description:
            `Investigate factors that influence or initiate ${label}.`,
  
          type:
            'concept',
  
          relationshipLabel:
            'influenced by',
  
          relationshipExplanation:
            `${label} may depend on upstream conditions or factors.`,
        },
  
        {
          id:
            `${slugify(label)}-effects`,
  
          label:
            'Downstream Effects',
  
          subtitle:
            'Consequences',
  
          description:
            `Investigate scientific effects associated with ${label}.`,
  
          type:
            'concept',
  
          relationshipLabel:
            'can influence',
  
          relationshipExplanation:
            `${label} may produce downstream effects that can be investigated.`,
        },
  
        {
          id:
            `${slugify(label)}-experiments`,
  
          label:
            'Key Experiments',
  
          subtitle:
            'Evidence',
  
          description:
            `Investigate experiments used to study ${label}.`,
  
          type:
            'experiment',
  
          relationshipLabel:
            'studied by',
  
          relationshipExplanation:
            `Experiments provide evidence for understanding ${label}.`,
        },
      ]
    }
  
  
    return [
      {
        id:
          `${slugify(label)}-mechanisms`,
  
        label:
          'Key Mechanisms',
  
        subtitle:
          'Research direction',
  
        description:
          `Investigate mechanisms that help explain ${label}.`,
  
        type:
          'mechanism',
  
        relationshipLabel:
          'explained by',
  
        relationshipExplanation:
          `${label} can be explored by identifying relevant scientific mechanisms.`,
      },
  
      {
        id:
          `${slugify(label)}-evidence`,
  
        label:
          'Supporting Evidence',
  
        subtitle:
          'Evidence',
  
        description:
          `Investigate experiments, observations, and literature relevant to ${label}.`,
  
        type:
          'evidence',
  
        relationshipLabel:
          'supported by',
  
        relationshipExplanation:
          `Scientific claims involving ${label} should be evaluated against supporting evidence.`,
      },
  
      {
        id:
          `${slugify(label)}-open-questions`,
  
        label:
          'Open Questions',
  
        subtitle:
          'Research frontier',
  
        description:
          `Explore uncertainties and unresolved scientific questions involving ${label}.`,
  
        type:
          'concept',
  
        relationshipLabel:
          'raises',
  
        relationshipExplanation:
          `${label} may contain unresolved questions that remain active areas of research.`,
      },
    ]
  }
  
  
  export function expandResearchNode(
    node: ResearchNode,
  ): NodeExpansion {
    const key =
      normalize(
        node.label,
      )
  
    const concepts =
      expansionLibrary[
        key
      ] ??
      createGenericExpansion(
        node,
      )
  
  
    const nodes:
      ResearchNode[] =
        concepts.map(
          (
            concept,
          ) => ({
            id:
              concept.id,
  
            type:
              concept.type,
  
            label:
              concept.label,
  
            subtitle:
              concept.subtitle,
  
            description:
              concept.description,
  
            domain:
              node.domain,
  
            sourceIds: [],
  
            evidenceStrength:
              'unknown',
  
            metadata: {
              expandedFrom:
                node.id,
            },
          }),
        )
  
  
    const edges:
      ResearchEdge[] =
        concepts.map(
          (
            concept,
            index,
          ) => ({
            id:
              `expanded-${node.id}-${concept.id}-${index}`,
  
            sourceId:
              node.id,
  
            targetId:
              concept.id,
  
            relationship:
              'related-to',
  
            label:
              concept.relationshipLabel,
  
            explanation:
              concept.relationshipExplanation,
  
            evidenceStrength:
              'unknown',
  
            sourceIds: [],
          }),
        )
  
  
    return {
      nodes,
      edges,
    }
  }
  