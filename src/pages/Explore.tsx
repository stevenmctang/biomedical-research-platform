import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Dna,
  FlaskConical,
  Network,
  Search,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { searchBiomedical } from '../utils/searchBiomedical'
import type { SearchResult } from '../types/biomedical'

function getResultIcon(type: SearchResult['type']) {
  if (type === 'gene') return <Dna size={18} />
  if (type === 'drug') return <FlaskConical size={18} />
  if (type === 'pathway') return <Network size={18} />

  return <Search size={18} />
}

export function Explore() {
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')

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
                  Results for “{submittedQuery}”
                </h2>
              </div>

              <span>
                {results.length}{' '}
                {results.length === 1 ? 'result' : 'results'}
              </span>
            </div>

            {results.length > 0 ? (
              <div className="results-list">
                {results.map((result) => (
                  <article
                    className="result-card"
                    key={`${result.type}-${result.id}`}
                  >
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
                  </article>
                ))}
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
