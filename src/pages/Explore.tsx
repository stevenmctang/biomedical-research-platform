import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Dna,
  FlaskConical,
  Network,
  Search,
  ArrowLeft,
  Microscope,
  Link2,
} from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchBiomedical } from '../utils/searchBiomedical'
import { getConnectedEntities, getEntityTypeLabel } from '../utils/getConnectedEntities'
import type { BiomedicalEntityType } from '../types/biomedical'

function getResultIcon(type: BiomedicalEntityType) {
  if (type === 'gene') return <Dna size={18} />
  if (type === 'drug') return <FlaskConical size={18} />
  if (type === 'pathway') return <Network size={18} />

  return <Search size={18} />
}

interface RelationshipContext {
  sourceId: string
  sourceLabel: string
  sourceType: string
  targetId: string
  targetLabel: string
  targetType: string
  relationship: string
  associationId: string
  evidenceCodes?: string
  knowledgeSource?: string
}

function parseRelationshipContext(params: URLSearchParams): RelationshipContext | null {
  const sourceId = params.get('sourceId')
  const targetId = params.get('targetId')
  const relationship = params.get('relationship')
  if (!sourceId || !targetId || !relationship) return null

  return {
    sourceId,
    sourceLabel: params.get('sourceLabel') ?? sourceId,
    sourceType: params.get('sourceType') ?? '',
    targetId,
    targetLabel: params.get('targetLabel') ?? targetId,
    targetType: params.get('targetType') ?? '',
    relationship,
    associationId: params.get('associationId') ?? '',
    evidenceCodes: params.get('evidenceCodes') ?? undefined,
    knowledgeSource: params.get('knowledgeSource') ?? undefined,
  }
}

const RELATIONSHIP_LABELS: Record<string, string> = {
  'associated-with': 'associated with',
  'participates-in': 'participates in',
  'involves': 'involves',
  'treats': 'treats',
  'targets': 'targets',
  'has-phenotype': 'has phenotype',
  'expressed-in': 'expressed in',
  'causes': 'causes',
  'related-to': 'related to',
}

export function Explore() {
  const [searchParams, setSearchParams] = useSearchParams()
  const relationshipContext = useMemo(
    () => parseRelationshipContext(searchParams),
    [searchParams],
  )

  const [query, setQuery] = useState(relationshipContext?.sourceLabel ?? '')
  const [submittedQuery, setSubmittedQuery] = useState(relationshipContext?.sourceLabel ?? '')

  const results = useMemo(() => {
    return searchBiomedical(submittedQuery)
  }, [submittedQuery])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmittedQuery(query)
  }

  function runSearch(searchTerm: string) {
    setQuery(searchTerm)
    setSubmittedQuery(searchTerm)
  }

  function clearRelationshipContext() {
    setSearchParams({})
    setQuery('')
    setSubmittedQuery('')
  }

  return (
    <div className="explorer-page">
      <header className="explorer-nav">
        <div className="explorer-nav-inner">
          <Link to="/" className="brand">
            Helix
          </Link>

          <div className="explorer-nav-label">
            Research Explorer
          </div>

          <Link to="/" className="explorer-back-link">
            Back to Home
          </Link>
        </div>
      </header>

      <main className="explorer-main">
        {relationshipContext && (
          <section className="relationship-context">
            <div className="relationship-context-header">
              <div className="relationship-context-label">
                <Microscope size={14} />
                Evidence for Relationship
              </div>
              <button
                type="button"
                className="relationship-context-close"
                onClick={clearRelationshipContext}
              >
                Clear
              </button>
            </div>

            <div className="relationship-context-flow">
              <div className="relationship-context-entity">
                <span className="relationship-context-entity-name">
                  {relationshipContext.sourceLabel}
                </span>
                <span className="relationship-context-entity-id">
                  {relationshipContext.sourceId}
                </span>
              </div>
              <span className="relationship-context-rel">
                {RELATIONSHIP_LABELS[relationshipContext.relationship] ?? relationshipContext.relationship}
              </span>
              <div className="relationship-context-entity">
                <span className="relationship-context-entity-name">
                  {relationshipContext.targetLabel}
                </span>
                <span className="relationship-context-entity-id">
                  {relationshipContext.targetId}
                </span>
              </div>
            </div>

            <div className="relationship-context-meta">
              {relationshipContext.evidenceCodes && (
                <div className="relationship-context-meta-item">
                  <span className="relationship-context-meta-label">Evidence codes</span>
                  <span className="relationship-context-meta-value">
                    {relationshipContext.evidenceCodes}
                  </span>
                </div>
              )}
              {relationshipContext.knowledgeSource && (
                <div className="relationship-context-meta-item">
                  <span className="relationship-context-meta-label">Knowledge source</span>
                  <span className="relationship-context-meta-value">
                    {relationshipContext.knowledgeSource}
                  </span>
                </div>
              )}
              {relationshipContext.associationId && (
                <div className="relationship-context-meta-item">
                  <span className="relationship-context-meta-label">Association ID</span>
                  <span className="relationship-context-meta-value">
                    {relationshipContext.associationId}
                  </span>
                </div>
              )}
            </div>

            <p className="relationship-context-note">
              The Monarch Initiative knowledge graph aggregates evidence from multiple
              curated biomedical sources. Explore the entities below to investigate
              the supporting research for this relationship.
            </p>

            <Link
              to="/graph"
              className="relationship-context-back"
            >
              <ArrowLeft size={14} />
              Back to Knowledge Graph
            </Link>
          </section>
        )}

        <section className="explorer-hero">
          <p className="eyebrow">RESEARCH EXPLORER</p>

          <h1>Explore biomedical research.</h1>

          <p>
            Search across diseases, genes, drugs, biological pathways, and
            connected biomedical evidence.
          </p>

          <form
            className="research-search-form"
            onSubmit={handleSubmit}
          >
            <Search size={21} />

            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a disease, gene, drug, or pathway..."
              aria-label="Biomedical search"
            />

            <button type="submit">
              Search
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="search-examples">
            <span>Try:</span>

            <button
              type="button"
              onClick={() => runSearch('ALS')}
            >
              ALS
            </button>

            <button
              type="button"
              onClick={() => runSearch('SOD1')}
            >
              SOD1
            </button>

            <button
              type="button"
              onClick={() => runSearch('Riluzole')}
            >
              Riluzole
            </button>

            <button
              type="button"
              onClick={() => runSearch('Oxidative Stress')}
            >
              Oxidative Stress
            </button>
          </div>
        </section>

        {!submittedQuery && (
          <section className="explore-categories">
            <div className="explore-section-heading">
              <p className="eyebrow">EXPLORE BY</p>
              <h2>Start with an area of biology.</h2>
            </div>

            <div className="category-grid">
              <button
                type="button"
                className="category-card"
                onClick={() => runSearch('ALS')}
              >
                <div className="category-icon">
                  <Search size={20} />
                </div>

                <span>Disease</span>

                <h3>Amyotrophic Lateral Sclerosis</h3>

                <p>
                  Explore disease biology, associated genes, pathways, and
                  therapeutic research.
                </p>
              </button>

              <button
                type="button"
                className="category-card"
                onClick={() => runSearch('SOD1')}
              >
                <div className="category-icon">
                  <Dna size={20} />
                </div>

                <span>Gene / Target</span>

                <h3>SOD1</h3>

                <p>
                  Investigate gene function, disease relationships, and
                  connected biological pathways.
                </p>
              </button>

              <button
                type="button"
                className="category-card"
                onClick={() => runSearch('Riluzole')}
              >
                <div className="category-icon">
                  <FlaskConical size={20} />
                </div>

                <span>Drug</span>

                <h3>Riluzole</h3>

                <p>
                  Explore therapeutic programs and the diseases connected to a
                  drug.
                </p>
              </button>

              <button
                type="button"
                className="category-card"
                onClick={() => runSearch('Oxidative Stress')}
              >
                <div className="category-icon">
                  <Network size={20} />
                </div>

                <span>Pathway</span>

                <h3>Oxidative Stress</h3>

                <p>
                  Follow biological pathways and the genes connected to them.
                </p>
              </button>
            </div>
          </section>
        )}

        {submittedQuery && (
          <section className="results-section">
            <div className="results-heading">
              <div>
                <p className="eyebrow">SEARCH RESULTS</p>

                <h2>
                  Results for "{submittedQuery}"
                </h2>
              </div>

              <span>
                {results.length}{' '}
                {results.length === 1 ? 'result' : 'results'}
              </span>
            </div>

            {results.length > 0 ? (
              <div className="results-list">
                {results.map((result) => {
                  const connections = getConnectedEntities(result.id)

                  return (
                    <article
                      className="result-card result-card-with-connections"
                      key={`${result.type}-${result.id}`}
                    >
                      <div className="result-card-main">
                        <div className="result-icon">
                          {getResultIcon(result.type)}
                        </div>

                        <div className="result-content">
                          <p className="result-type">
                            {result.subtitle}
                          </p>

                          <h3>{result.title}</h3>

                          <p>{result.description}</p>
                        </div>

                        <button
                          type="button"
                          className="result-open-button"
                        >
                          Open
                          <ArrowRight size={16} />
                        </button>
                      </div>

                      {connections.length > 0 && (
                        <div className="result-connections">
                          <div className="result-connections-header">
                            <Link2 size={13} />
                            <span>
                              {connections.length} connected{' '}
                              {connections.length === 1 ? 'entity' : 'entities'}
                            </span>
                          </div>

                          <div className="result-connections-list">
                            {connections.map((conn) => (
                              <div
                                className="result-connection-item"
                                key={conn.edge.id}
                              >
                                <div className="result-connection-icon">
                                  {getResultIcon(conn.node.type)}
                                </div>
                                <div className="result-connection-text">
                                  <span className="result-connection-label">
                                    {conn.node.label}
                                  </span>
                                  <span className="result-connection-relationship">
                                    {conn.direction === 'incoming'
                                      ? `${conn.relationshipLabel} ${result.title}`
                                      : `${conn.relationshipLabel} ${conn.node.label}`}
                                  </span>
                                  <span className="result-connection-type">
                                    {getEntityTypeLabel(conn.node.type)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="no-results">
                <Search size={26} />

                <h3>No matching research entities yet.</h3>

                <p>
                  Our development dataset is still small. Try searching ALS,
                  SOD1, C9orf72, APOE, Riluzole, or Oxidative Stress.
                </p>
              </div>
            )}
          </section>
        )}

        <section className="research-question-section">
          <div className="research-question-copy">
            <p className="eyebrow">RESEARCH QUESTIONS</p>

            <h2>What would you like to investigate?</h2>

            <p>
              Later, this workspace will use connected biomedical evidence to
              answer complex research questions with traceable sources.
            </p>
          </div>

          <div className="question-list">
            <button
              type="button"
              onClick={() => runSearch('ALS')}
            >
              <span>What genes are associated with ALS?</span>
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              onClick={() => runSearch('SOD1')}
            >
              <span>
                What biological pathways involve SOD1?
              </span>
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              onClick={() => runSearch('Riluzole')}
            >
              <span>
                What therapeutics are connected to ALS?
              </span>
              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      </main>

      <footer className="explorer-footer">
        <span>Helix Biomedical Research Intelligence</span>

        <p>
          Development dataset for research and educational use. Biomedical
          relationships require independent scientific validation.
        </p>
      </footer>
    </div>
  )
}
