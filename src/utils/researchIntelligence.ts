import type {
    ResearchMap,
    ResearchNode,
  } from '../types/researchMap'
  
  export type ResearchQuestionType =
    | 'evidence'
    | 'mechanism'
    | 'molecular'
    | 'drug'
    | 'cell'
    | 'general_science'
    | 'vague'
  
  export type ResearchDomain =
    | 'neuroscience'
    | 'genetics'
    | 'molecular_biology'
    | 'cell_biology'
    | 'medicine'
    | 'chemistry'
    | 'general_science'
    | 'unknown'
  
  export type ReliabilityLevel =
    | 'specific'
    | 'partial'
    | 'limited'
  
  export interface ResearchEntity {
    id: string
    label: string
    kind:
      | 'gene'
      | 'disease'
      | 'protein'
      | 'drug'
      | 'pathway'
      | 'process'
      | 'organism'
      | 'system'
      | 'unknown'
  }
  
  export interface ResearchConnection {
    id: string
    source: string
    target: string
    claim: string
    whyItMatters: string
    evidenceNeeded: string
    uncertainty: string
    nextVerificationStep: string
    confidence: number
  }
  
  export interface ResearchMechanism {
    id: string
    title: string
    summary: string
    confidence: number
    evidenceNeeded: string
    nextTest: string
  }
  
  export interface ResearchModelStep {
    id: string
    label: string
    title: string
    description: string
    status: 'reasonable_starting_point' | 'needs_evidence' | 'unresolved'
  }
  
  export interface ResearchIntelligenceResult {
    question: string
    normalizedQuestion: string
    questionType: ResearchQuestionType
    domain: ResearchDomain
    reliability: ReliabilityLevel
    topicLabel: string
    shortAnswerGoal: string
    entities: ResearchEntity[]
    evidenceQuery: string
    explanation: string
    limitations: string[]
    suggestedBetterQuestion?: string
    mechanisms: ResearchMechanism[]
    connections: ResearchConnection[]
    modelSteps: ResearchModelStep[]
  }
  
  function normalizeText(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  
  function makeId(value: string) {
    return normalizeText(value)
      .replace(/\s+/g, '-')
      .slice(0, 48)
  }
  
  function cleanQuestion(question: string) {
    return question
      .replace(/\?/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }
  
  function includesAny(text: string, terms: string[]) {
    return terms.some((term) => text.includes(term))
  }
  
  function getMapConcepts(map?: ResearchMap) {
    if (!map) {
      return []
    }
  
    return map.nodes
      .filter((node) => node.type !== 'question')
      .filter((node) => {
        const label = normalizeText(node.label)
  
        return (
          label !== 'topic overview' &&
          label !== 'key mechanisms' &&
          label !== 'evidence' &&
          label !== 'open questions' &&
          label !== 'candidate mechanism' &&
          label !== 'evidence base'
        )
      })
      .slice(0, 6)
  }
  
  function getNodeDescription(node: ResearchNode) {
    return node.description ||
      node.subtitle ||
      `${node.label} appears as a concept in the generated research map.`
  }
  
  function detectQuestionType(normalizedQuestion: string): ResearchQuestionType {
    if (
      normalizedQuestion.length < 12 ||
      normalizedQuestion === 'biology' ||
      normalizedQuestion === 'science' ||
      normalizedQuestion === 'medicine' ||
      normalizedQuestion === 'chemistry'
    ) {
      return 'vague'
    }
  
    if (
      includesAny(normalizedQuestion, [
        'evidence',
        'connects',
        'connection',
        'relationship',
        'link',
        'associated',
        'association',
        'support',
      ])
    ) {
      return 'evidence'
    }
  
    if (
      includesAny(normalizedQuestion, [
        'drug',
        'receptor',
        'ligand',
        'bind',
        'binding',
        'compound',
        'inhibitor',
        'agonist',
        'antagonist',
        'therapy',
        'treatment',
      ])
    ) {
      return 'drug'
    }
  
    if (
      includesAny(normalizedQuestion, [
        'crispr',
        'cas9',
        'dna',
        'rna',
        'gene',
        'genome',
        'mutation',
        'guide rna',
        'editing',
      ])
    ) {
      return 'molecular'
    }
  
    if (
      includesAny(normalizedQuestion, [
        'cell',
        'cancer',
        'tumor',
        'immune',
        't cell',
        'b cell',
        'macrophage',
        'mitochondria',
        'nucleus',
        'membrane',
      ])
    ) {
      return 'cell'
    }
  
    if (
      includesAny(normalizedQuestion, [
        'how',
        'why',
        'mechanism',
        'cause',
        'affect',
        'affects',
        'impact',
        'pathway',
      ])
    ) {
      return 'mechanism'
    }
  
    return 'general_science'
  }
  
  function detectDomain(normalizedQuestion: string): ResearchDomain {
    if (
      includesAny(normalizedQuestion, [
        'brain',
        'tbi',
        'traumatic brain injury',
        'concussion',
        'neuron',
        'neural',
        'neuro',
        'als',
        'alzheimer',
        'parkinson',
        'spinal',
      ])
    ) {
      return 'neuroscience'
    }
  
    if (
      includesAny(normalizedQuestion, [
        'crispr',
        'cas9',
        'dna',
        'rna',
        'gene',
        'genome',
        'mutation',
        'genetic',
      ])
    ) {
      return 'genetics'
    }
  
    if (
      includesAny(normalizedQuestion, [
        'protein',
        'enzyme',
        'receptor',
        'ligand',
        'drug',
        'compound',
        'binding',
        'molecule',
      ])
    ) {
      return 'molecular_biology'
    }
  
    if (
      includesAny(normalizedQuestion, [
        'cell',
        'cancer',
        'tumor',
        'immune',
        'mitochondria',
        'nucleus',
        'membrane',
      ])
    ) {
      return 'cell_biology'
    }
  
    if (
      includesAny(normalizedQuestion, [
        'disease',
        'clinical',
        'patient',
        'symptom',
        'diagnosis',
        'trial',
        'treatment',
        'therapy',
      ])
    ) {
      return 'medicine'
    }
  
    if (
      includesAny(normalizedQuestion, [
        'reaction',
        'chemical',
        'molecule',
        'bond',
        'acid',
        'base',
        'compound',
      ])
    ) {
      return 'chemistry'
    }
  
    if (
      includesAny(normalizedQuestion, [
        'photosynthesis',
        'evolution',
        'ecosystem',
        'climate',
        'energy',
        'force',
        'matter',
      ])
    ) {
      return 'general_science'
    }
  
    return 'unknown'
  }
  
  function extractEntities(question: string, normalizedQuestion: string): ResearchEntity[] {
    const entities: ResearchEntity[] = []
  
    function add(label: string, kind: ResearchEntity['kind']) {
      const id = makeId(`${kind}-${label}`)
  
      if (!entities.some((entity) => entity.id === id)) {
        entities.push({
          id,
          label,
          kind,
        })
      }
    }
  
    if (normalizedQuestion.includes('sod1')) {
      add('SOD1', 'gene')
    }
  
    if (normalizedQuestion.includes('als')) {
      add('ALS', 'disease')
    }
  
    if (
      normalizedQuestion.includes('tbi') ||
      normalizedQuestion.includes('traumatic brain injury')
    ) {
      add('Traumatic brain injury', 'disease')
    }
  
    if (normalizedQuestion.includes('brain')) {
      add('Brain', 'system')
    }
  
    if (normalizedQuestion.includes('crispr')) {
      add('CRISPR', 'process')
    }
  
    if (normalizedQuestion.includes('cas9')) {
      add('Cas9', 'protein')
    }
  
    if (normalizedQuestion.includes('dna')) {
      add('DNA', 'process')
    }
  
    if (normalizedQuestion.includes('rna')) {
      add('RNA', 'process')
    }
  
    if (normalizedQuestion.includes('cancer')) {
      add('Cancer', 'disease')
    }
  
    if (normalizedQuestion.includes('tumor')) {
      add('Tumor', 'disease')
    }
  
    if (normalizedQuestion.includes('drug')) {
      add('Drug or compound', 'drug')
    }
  
    if (normalizedQuestion.includes('receptor')) {
      add('Receptor', 'protein')
    }
  
    const uppercaseMatches = question.match(/\b[A-Z0-9]{2,}[A-Z0-9-]*\b/g) || []
  
    uppercaseMatches.forEach((match) => {
      if (
        !entities.some((entity) => entity.label === match) &&
        !['DNA', 'RNA', 'TBI', 'ALS'].includes(match)
      ) {
        add(match, 'unknown')
      }
    })
  
    return entities
  }
  
  function getTopicLabel(question: string, entities: ResearchEntity[]) {
    if (entities.length >= 2) {
      return `${entities[0].label} and ${entities[1].label}`
    }
  
    if (entities.length === 1) {
      return entities[0].label
    }
  
    const cleaned = cleanQuestion(question)
  
    if (cleaned.length <= 80) {
      return cleaned
    }
  
    return `${cleaned.slice(0, 80)}…`
  }
  
  function getShortAnswerGoal(questionType: ResearchQuestionType) {
    if (questionType === 'evidence') {
      return 'Evaluate whether evidence supports a specific relationship.'
    }
  
    if (questionType === 'mechanism') {
      return 'Explain the most likely mechanism and what evidence would verify it.'
    }
  
    if (questionType === 'molecular') {
      return 'Explain the molecular mechanism without pretending to simulate the exact structure.'
    }
  
    if (questionType === 'drug') {
      return 'Separate binding, biological effect, and validation evidence.'
    }
  
    if (questionType === 'cell') {
      return 'Connect cellular mechanisms to measurable biological outcomes.'
    }
  
    if (questionType === 'vague') {
      return 'Ask for a more specific research target before generating detailed claims.'
    }
  
    return 'Provide a careful science explanation and identify what still needs evidence.'
  }
  
  function getReliability(
    questionType: ResearchQuestionType,
    entities: ResearchEntity[],
    mapConcepts: ResearchNode[],
  ): ReliabilityLevel {
    if (questionType === 'vague') {
      return 'limited'
    }
  
    if (entities.length >= 2 || mapConcepts.length >= 3) {
      return 'specific'
    }
  
    if (entities.length === 1 || mapConcepts.length > 0) {
      return 'partial'
    }
  
    return 'limited'
  }
  
  function getEvidenceQuery(
    question: string,
    entities: ResearchEntity[],
    mapConcepts: ResearchNode[],
  ) {
    const entityText = entities
      .map((entity) => entity.label)
      .join(' ')
  
    const conceptText = mapConcepts
      .slice(0, 3)
      .map((node) => node.label)
      .join(' ')
  
    if (entityText && conceptText) {
      return `${cleanQuestion(question)} ${entityText} ${conceptText}`
    }
  
    if (entityText) {
      return `${cleanQuestion(question)} ${entityText}`
    }
  
    if (conceptText) {
      return `${cleanQuestion(question)} ${conceptText}`
    }
  
    return cleanQuestion(question)
  }
  
  function buildSpecificMechanisms(
    normalizedQuestion: string,
  ): ResearchMechanism[] | null {
    if (
      normalizedQuestion.includes('sod1') &&
      normalizedQuestion.includes('als')
    ) {
      return [
        {
          id: 'sod1-protein-stress',
          title: 'SOD1 dysfunction may contribute to motor neuron stress.',
          summary:
            'The strongest working hypothesis is that altered SOD1 protein behavior can create stress in vulnerable motor neurons, which may contribute to ALS-related degeneration.',
          confidence: 76,
          evidenceNeeded:
            'Papers should directly connect SOD1 mutation or dysfunction to motor neuron injury, degeneration, or ALS outcomes.',
          nextTest:
            'Compare sources on SOD1 misfolding, oxidative stress, protein aggregation, and motor neuron vulnerability.',
        },
        {
          id: 'sod1-oxidative-stress',
          title: 'Oxidative stress may be one route from SOD1 dysfunction to cell injury.',
          summary:
            'Because SOD1 is related to reactive oxygen species handling, altered SOD1 biology may increase vulnerability to oxidative stress.',
          confidence: 67,
          evidenceNeeded:
            'Evidence should show that oxidative stress markers change in SOD1-linked ALS models or cases.',
          nextTest:
            'Check whether sources connect oxidative stress to both SOD1 dysfunction and ALS-relevant neuron damage.',
        },
        {
          id: 'sod1-proteostasis',
          title: 'Protein misfolding and clearance failure may be another explanation.',
          summary:
            'Misfolded or aggregated SOD1 may burden protein quality-control systems, creating stress in neurons.',
          confidence: 61,
          evidenceNeeded:
            'Evidence should connect SOD1 aggregation or proteostasis failure to ALS-relevant outcomes.',
          nextTest:
            'Compare studies on SOD1 aggregation, proteasome stress, autophagy, and motor neuron survival.',
        },
      ]
    }
  
    if (
      normalizedQuestion.includes('tbi') ||
      normalizedQuestion.includes('traumatic brain injury') ||
      normalizedQuestion.includes('brain injury')
    ) {
      return [
        {
          id: 'tbi-secondary-injury',
          title: 'Secondary injury may explain why TBI effects continue after impact.',
          summary:
            'A useful TBI model separates the primary mechanical injury from later processes such as inflammation, metabolic stress, vascular effects, and axonal disruption.',
          confidence: 72,
          evidenceNeeded:
            'Evidence should connect post-injury biological processes to symptoms, severity, or recovery outcomes.',
          nextTest:
            'Compare sources on neuroinflammation, diffuse axonal injury, metabolic crisis, and long-term symptoms.',
        },
        {
          id: 'tbi-axonal-disruption',
          title: 'Axonal disruption may help explain cognitive and neurological symptoms.',
          summary:
            'Mechanical forces can affect neural connections, which may contribute to memory, attention, movement, or mood symptoms.',
          confidence: 68,
          evidenceNeeded:
            'Evidence should connect axonal injury markers or imaging findings to functional outcomes.',
          nextTest:
            'Check whether papers link axonal disruption to cognitive or behavioral outcomes after TBI.',
        },
        {
          id: 'tbi-inflammation',
          title: 'Neuroinflammation may amplify injury after the initial event.',
          summary:
            'Inflammatory signaling can be part of the secondary response and may influence recovery or ongoing symptoms.',
          confidence: 63,
          evidenceNeeded:
            'Evidence should connect inflammatory markers to TBI severity, symptoms, or recovery trajectory.',
          nextTest:
            'Compare studies measuring inflammatory markers after TBI with clinical or behavioral outcomes.',
        },
      ]
    }
  
    if (
      normalizedQuestion.includes('crispr') ||
      normalizedQuestion.includes('cas9')
    ) {
      return [
        {
          id: 'crispr-guide-targeting',
          title: 'Guide RNA targeting is the central specificity mechanism.',
          summary:
            'The guide RNA helps direct Cas9 to a matching DNA sequence, but targeting also depends on sequence context and PAM recognition.',
          confidence: 82,
          evidenceNeeded:
            'Evidence should explain guide RNA complementarity, PAM recognition, cleavage, and off-target risk.',
          nextTest:
            'Check sources that separate guide RNA matching, PAM requirements, and final DNA repair outcomes.',
        },
        {
          id: 'crispr-pam',
          title: 'PAM recognition limits where Cas9 can bind.',
          summary:
            'Cas9 does not simply cut any matching DNA; it usually needs a nearby PAM sequence before stable binding and cleavage.',
          confidence: 76,
          evidenceNeeded:
            'Evidence should describe the PAM rule for the Cas protein being discussed.',
          nextTest:
            'Compare PAM requirements across Cas9 variants or CRISPR systems.',
        },
        {
          id: 'crispr-repair',
          title: 'DNA repair determines the final editing result.',
          summary:
            'After cleavage, cellular repair pathways determine whether the outcome is disruption, insertion, deletion, or precise edit.',
          confidence: 70,
          evidenceNeeded:
            'Evidence should distinguish the cutting event from the repair outcome.',
          nextTest:
            'Review sources comparing NHEJ, HDR, and editing efficiency.',
        },
      ]
    }
  
    if (
      normalizedQuestion.includes('drug') ||
      normalizedQuestion.includes('receptor') ||
      normalizedQuestion.includes('binding')
    ) {
      return [
        {
          id: 'drug-binding',
          title: 'Binding is only the first part of the drug mechanism.',
          summary:
            'A compound may bind a receptor or protein, but binding alone does not prove that it changes biology or has therapeutic value.',
          confidence: 70,
          evidenceNeeded:
            'Evidence should include both target engagement and downstream functional effect.',
          nextTest:
            'Separate binding evidence from cell, pathway, animal, or clinical response evidence.',
        },
        {
          id: 'target-effect',
          title: 'The key question is whether binding changes target behavior.',
          summary:
            'A drug can inhibit, activate, stabilize, block, or modulate a target, and each claim needs different evidence.',
          confidence: 64,
          evidenceNeeded:
            'Evidence should show how the target changes after compound exposure.',
          nextTest:
            'Check for functional assays, pathway readouts, or phenotype changes after treatment.',
        },
      ]
    }
  
    return null
  }
  
  function buildGenericMechanisms(
    mapConcepts: ResearchNode[],
  ): ResearchMechanism[] {
    if (mapConcepts.length > 0) {
      return mapConcepts.slice(0, 3).map((node, index) => ({
        id: node.id,
        title:
          index === 0
            ? `${node.label} is the leading concept to verify.`
            : `${node.label} is an alternative concept to check.`,
        summary: getNodeDescription(node),
        confidence: [58, 51, 46][index] ?? 44,
        evidenceNeeded:
          'Evidence should directly support the relationship, not merely mention the same topic.',
        nextTest:
          `Check whether retrieved papers directly connect ${node.label} to the user’s question.`,
      }))
    }
  
    return [
      {
        id: 'needs-specific-target',
        title: 'The question needs a more specific research target.',
        summary:
          'Helix should avoid generating detailed mechanisms until the question includes a disease, gene, protein, pathway, drug, process, or measurable outcome.',
        confidence: 30,
        evidenceNeeded:
          'A more specific search target is needed before reliable evidence connections can be generated.',
        nextTest:
          'Ask a more specific question using a named disease, gene, pathway, compound, or biological process.',
      },
    ]
  }
  
  function buildMechanisms(
    normalizedQuestion: string,
    mapConcepts: ResearchNode[],
  ) {
    const specificMechanisms = buildSpecificMechanisms(normalizedQuestion)
  
    if (specificMechanisms) {
      return specificMechanisms
    }
  
    return buildGenericMechanisms(mapConcepts)
  }
  
  function buildSpecificConnections(
    normalizedQuestion: string,
  ): ResearchConnection[] | null {
    if (
      normalizedQuestion.includes('sod1') &&
      normalizedQuestion.includes('als')
    ) {
      return [
        {
          id: 'sod1-protein-stress',
          source: 'SOD1 dysfunction',
          target: 'Protein stress',
          claim:
            'SOD1 changes may contribute to toxic protein behavior or stress responses.',
          whyItMatters:
            'This gives a biological route from a gene/protein to cell-level damage.',
          evidenceNeeded:
            'Studies showing SOD1 mutation, misfolding, aggregation, or altered function.',
          uncertainty:
            'This does not explain all ALS cases and should not be treated as a universal ALS cause.',
          nextVerificationStep:
            'Check whether papers distinguish SOD1-linked ALS from broader ALS mechanisms.',
          confidence: 74,
        },
        {
          id: 'protein-stress-motor-neurons',
          source: 'Protein stress',
          target: 'Motor neuron vulnerability',
          claim:
            'Protein stress may make motor neurons more vulnerable to degeneration.',
          whyItMatters:
            'ALS primarily affects motor neurons, so the connection must reach that cell type.',
          evidenceNeeded:
            'Motor neuron model evidence, degeneration markers, or ALS-relevant pathology.',
          uncertainty:
            'General cellular stress evidence is weaker if it is not motor-neuron-specific.',
          nextVerificationStep:
            'Look for papers using motor neuron systems or ALS-relevant models.',
          confidence: 66,
        },
        {
          id: 'motor-neurons-als',
          source: 'Motor neuron degeneration',
          target: 'ALS phenotype',
          claim:
            'Motor neuron loss or dysfunction is the disease-relevant outcome that connects mechanisms to ALS.',
          whyItMatters:
            'A mechanism is only useful if it connects to disease features, not just molecular changes.',
          evidenceNeeded:
            'Evidence linking SOD1-driven cell effects to ALS symptoms, progression, or pathology.',
          uncertainty:
            'The strength depends on whether evidence is human, animal, cell-based, or only theoretical.',
          nextVerificationStep:
            'Separate human evidence, model-organism evidence, and cell-culture evidence.',
          confidence: 62,
        },
      ]
    }
  
    if (
      normalizedQuestion.includes('tbi') ||
      normalizedQuestion.includes('traumatic brain injury') ||
      normalizedQuestion.includes('brain injury')
    ) {
      return [
        {
          id: 'impact-primary-injury',
          source: 'Mechanical impact',
          target: 'Primary tissue disruption',
          claim:
            'TBI begins with a mechanical force that can disrupt tissue, vessels, or neural connections.',
          whyItMatters:
            'This separates the initial injury from later biological cascades.',
          evidenceNeeded:
            'Clinical or experimental evidence describing injury biomechanics and immediate tissue effects.',
          uncertainty:
            'The exact affected region and severity vary by case.',
          nextVerificationStep:
            'Do not model a patient-specific brain injury unless imaging data is provided.',
          confidence: 72,
        },
        {
          id: 'secondary-cascade',
          source: 'Primary injury',
          target: 'Secondary injury cascade',
          claim:
            'Inflammation, axonal injury, metabolic stress, and vascular changes may continue after the initial impact.',
          whyItMatters:
            'Secondary cascades can help explain prolonged symptoms and recovery differences.',
          evidenceNeeded:
            'Studies connecting post-injury biomarkers or pathology to outcomes.',
          uncertainty:
            'Different mechanisms dominate in different injury types.',
          nextVerificationStep:
            'Compare evidence for inflammation, axonal injury, vascular damage, and metabolic stress separately.',
          confidence: 68,
        },
        {
          id: 'cascade-symptoms',
          source: 'Secondary injury cascade',
          target: 'Cognitive or neurological symptoms',
          claim:
            'Biological changes after injury may contribute to memory, attention, mood, movement, or recovery problems.',
          whyItMatters:
            'This links biology to the functional effects the user likely cares about.',
          evidenceNeeded:
            'Studies linking mechanism markers to symptoms or recovery outcomes.',
          uncertainty:
            'Symptoms are not specific to one mechanism and should not be over-interpreted.',
          nextVerificationStep:
            'Check whether papers connect mechanisms to measured outcomes rather than only describing biology.',
          confidence: 60,
        },
      ]
    }
  
    if (
      normalizedQuestion.includes('crispr') ||
      normalizedQuestion.includes('cas9')
    ) {
      return [
        {
          id: 'guide-rna-target',
          source: 'Guide RNA',
          target: 'Target DNA sequence',
          claim:
            'Guide RNA provides sequence matching that helps direct Cas9 to a DNA target.',
          whyItMatters:
            'This is the central targeting logic behind CRISPR-Cas9.',
          evidenceNeeded:
            'Sources explaining guide RNA complementarity and target recognition.',
          uncertainty:
            'Matching alone does not guarantee perfect specificity.',
          nextVerificationStep:
            'Check whether sources discuss off-target effects and mismatch tolerance.',
          confidence: 82,
        },
        {
          id: 'pam-binding',
          source: 'PAM recognition',
          target: 'Cas9 binding',
          claim:
            'Cas9 usually requires a PAM sequence near the target before binding and cutting.',
          whyItMatters:
            'This explains why Cas9 cannot cut every sequence that resembles the guide.',
          evidenceNeeded:
            'Sources explaining PAM requirements for the Cas9 system.',
          uncertainty:
            'PAM rules depend on the Cas protein or variant.',
          nextVerificationStep:
            'Verify which Cas system the question is asking about.',
          confidence: 78,
        },
        {
          id: 'cleavage-repair',
          source: 'DNA cleavage',
          target: 'Repair outcome',
          claim:
            'After Cas9 cuts DNA, repair pathways determine the final edit.',
          whyItMatters:
            'The edit result depends on cellular repair, not just Cas9 targeting.',
          evidenceNeeded:
            'Evidence comparing NHEJ, HDR, indels, and precise repair outcomes.',
          uncertainty:
            'Repair outcomes vary across cell type and experimental design.',
          nextVerificationStep:
            'Separate targeting evidence from editing-outcome evidence.',
          confidence: 70,
        },
      ]
    }
  
    if (
      normalizedQuestion.includes('drug') ||
      normalizedQuestion.includes('receptor') ||
      normalizedQuestion.includes('binding')
    ) {
      return [
        {
          id: 'compound-target',
          source: 'Compound',
          target: 'Protein or receptor target',
          claim:
            'A compound may bind a biological target, but binding must be measured directly.',
          whyItMatters:
            'Binding is the starting point for a drug mechanism.',
          evidenceNeeded:
            'Binding assay, structural evidence, affinity measurement, or target engagement data.',
          uncertainty:
            'Predicted binding is weaker than experimental binding evidence.',
          nextVerificationStep:
            'Check whether the source shows measured binding or only computational prediction.',
          confidence: 64,
        },
        {
          id: 'target-function',
          source: 'Target engagement',
          target: 'Biological effect',
          claim:
            'A useful drug mechanism needs evidence that binding changes the target or pathway.',
          whyItMatters:
            'Therapeutic relevance requires function, not just physical contact.',
          evidenceNeeded:
            'Functional assay, signaling readout, phenotype change, or dose-response data.',
          uncertainty:
            'A compound can bind without producing a useful biological effect.',
          nextVerificationStep:
            'Separate binding evidence from functional evidence.',
          confidence: 58,
        },
      ]
    }
  
    return null
  }
  
  function buildGenericConnections(
    mapConcepts: ResearchNode[],
  ): ResearchConnection[] {
    if (mapConcepts.length >= 2) {
      return mapConcepts.slice(0, 4).map((node, index) => {
        const nextNode = mapConcepts[index + 1] || mapConcepts[0]
  
        return {
          id: `${node.id}-${nextNode.id}`,
          source: node.label,
          target: nextNode.label,
          claim:
            `${node.label} may be related to ${nextNode.label}, but the relationship needs evidence before it is treated as reliable.`,
          whyItMatters:
            'This connection could help organize the research question into testable parts.',
          evidenceNeeded:
            'A paper or source that directly explains the relationship between these two concepts.',
          uncertainty:
            'The current app may have generated this from topic similarity rather than direct evidence.',
          nextVerificationStep:
            `Search for papers that mention both ${node.label} and ${nextNode.label} and check whether the abstract supports the relationship.`,
          confidence: 42,
        }
      })
    }
  
    return [
      {
        id: 'needs-specific-connection',
        source: 'Research question',
        target: 'Specific mechanism',
        claim:
          'The question is too broad to create detailed relationship claims safely.',
        whyItMatters:
          'Reliable connections require named entities, processes, outcomes, or sources.',
        evidenceNeeded:
          'A more specific question or source-backed concepts from retrieved papers.',
        uncertainty:
          'Generating detailed claims here would risk sounding more certain than the app really is.',
        nextVerificationStep:
          'Ask about a specific disease, gene, protein, pathway, compound, or biological process.',
        confidence: 25,
      },
    ]
  }
  
  function buildConnections(
    normalizedQuestion: string,
    mapConcepts: ResearchNode[],
  ) {
    const specificConnections = buildSpecificConnections(normalizedQuestion)
  
    if (specificConnections) {
      return specificConnections
    }
  
    return buildGenericConnections(mapConcepts)
  }
  
  function buildModelSteps(
    mechanisms: ResearchMechanism[],
    connections: ResearchConnection[],
  ): ResearchModelStep[] {
    const firstMechanism = mechanisms[0]
    const firstConnection = connections[0]
  
    return [
      {
        id: 'question',
        label: 'Research question',
        title: 'Define the claim',
        description:
          'Start by turning the user’s question into a claim that can be checked against evidence.',
        status: 'reasonable_starting_point',
      },
      {
        id: 'mechanism',
        label: 'Mechanism',
        title: firstMechanism?.title || 'Identify the mechanism',
        description:
          firstMechanism?.summary ||
          'Identify a mechanism that could explain the relationship.',
        status: 'needs_evidence',
      },
      {
        id: 'connection',
        label: 'Connection',
        title: firstConnection
          ? `${firstConnection.source} → ${firstConnection.target}`
          : 'Connect concepts carefully',
        description:
          firstConnection?.claim ||
          'Connections should be treated as hypotheses until sources support them.',
        status: 'needs_evidence',
      },
      {
        id: 'verification',
        label: 'Verification',
        title: 'Check what evidence would change confidence',
        description:
          firstMechanism?.nextTest ||
          'Use sources to decide whether the proposed explanation is supported, weak, or unresolved.',
        status: 'unresolved',
      },
    ]
  }
  
  function buildExplanation(
    reliability: ReliabilityLevel,
    questionType: ResearchQuestionType,
    topicLabel: string,
  ) {
    if (reliability === 'specific') {
      return `Helix found enough structure in the question to create a specific research interpretation for ${topicLabel}. Claims are still treated as hypotheses until evidence supports them.`
    }
  
    if (reliability === 'partial') {
      return `Helix found part of the research target for ${topicLabel}, but some connections need more specific evidence before they should be trusted.`
    }
  
    if (questionType === 'vague') {
      return 'The question is too broad for reliable mechanisms or detailed connections. Helix should ask for a more specific disease, gene, pathway, compound, or process.'
    }
  
    return `Helix can begin organizing ${topicLabel}, but the result should be treated as a low-confidence starting point until stronger entities and sources are identified.`
  }
  
  function buildLimitations(
    reliability: ReliabilityLevel,
    questionType: ResearchQuestionType,
  ) {
    const limitations = [
      'Generated mechanisms are research hypotheses, not proven conclusions.',
      'Evidence must directly support a relationship, not merely mention related terms.',
    ]
  
    if (questionType === 'drug') {
      limitations.push('Binding evidence and therapeutic effect are different claims.')
    }
  
    if (questionType === 'molecular') {
      limitations.push('This app does not run a validated molecular simulation.')
    }
  
    if (questionType === 'mechanism') {
      limitations.push('Mechanism explanations should be checked against experimental evidence.')
    }
  
    if (reliability === 'limited') {
      limitations.push('The question needs more specific entities before Helix can generate high-confidence relationships.')
    }
  
    return limitations
  }
  
  function getSuggestedBetterQuestion(
    questionType: ResearchQuestionType,
  ) {
    if (questionType !== 'vague') {
      return undefined
    }
  
    return 'Try: What evidence connects [gene/protein/pathway] to [disease/outcome]? For example: What evidence connects SOD1 to ALS?'
  }
  
  export function analyzeResearchQuestion(
    question: string,
    map?: ResearchMap,
  ): ResearchIntelligenceResult {
    const normalizedQuestion = normalizeText(question)
    const questionType = detectQuestionType(normalizedQuestion)
    const domain = detectDomain(normalizedQuestion)
    const entities = extractEntities(question, normalizedQuestion)
    const mapConcepts = getMapConcepts(map)
    const reliability = getReliability(questionType, entities, mapConcepts)
    const topicLabel = getTopicLabel(question, entities)
    const shortAnswerGoal = getShortAnswerGoal(questionType)
    const evidenceQuery = getEvidenceQuery(question, entities, mapConcepts)
    const mechanisms = buildMechanisms(normalizedQuestion, mapConcepts)
    const connections = buildConnections(normalizedQuestion, mapConcepts)
    const modelSteps = buildModelSteps(mechanisms, connections)
  
    return {
      question,
      normalizedQuestion,
      questionType,
      domain,
      reliability,
      topicLabel,
      shortAnswerGoal,
      entities,
      evidenceQuery,
      explanation: buildExplanation(reliability, questionType, topicLabel),
      limitations: buildLimitations(reliability, questionType),
      suggestedBetterQuestion: getSuggestedBetterQuestion(questionType),
      mechanisms,
      connections,
      modelSteps,
    }
  }
  