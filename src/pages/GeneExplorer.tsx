import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Dna,
  Network,
  Search,
} from 'lucide-react'
import { diseases, genes, pathways } from '../data/biomedicalData'

export function GeneExplorer() {
  const { id } = useParams()

  const gene = genes.find((item) => item.id === id)

  if (!gene) {
    return (
      <main className="entity-page">
        <Link to="/explore" className="entity-back-link">
          <ArrowLeft size={16} />
          Back to Explorer
        </Link>

        <div className="entity-not-found">
          <p className="eyebrow">GENE EXPLORER</p>

          <h1>Gene not found.</h1>

          <p>
            This gene is not currently included in the development dataset.
          </p>
        </div>
      </main>
    )
  }

  const connectedDiseases = diseases.filter((disease) =>
    gene.associatedDiseases.includes(disease.id),
  )

  const connectedPathways = pathways.filter((pathway) =>
    gene.pathways.includes(pathway.id),
  )

  return (
    <div className="entity-page-shell">
      <header className="explorer-nav">
        <div className="explorer-nav-inner">
          <Link to="/" className="brand">
            Helix
          </Link>

          <div className="explorer-nav-label">
            Gene Explorer
          </div>

          <Link to="/explore" className="explorer-back-link">
            Research Explorer
          </Link>
        </div>
      </header>

      <main className="entity-page">
        <Link to="/explore" className="entity-back-link">
          <ArrowLeft size={16} />
          Back to Explorer
        </Link>

        <section className="entity-hero">
          <p className="eyebrow">GENE / TARGET</p>

          <div className="entity-title-row">
            <div>
              <h1>{gene.symbol}</h1>

              <p className="entity-abbreviation">
                {gene.name}
              </p>
            </div>

            <div className="entity-badge">
              Gene
            </div>
          </div>

          <p className="entity-description">
            {gene.description}
          </p>

          {gene.chromosome && (
            <div className="gene-meta-row">
              <div className="gene-meta-item">
                <span>Chromosome</span>
                <strong>{gene.chromosome}</strong>
              </div>

              <div className="gene-meta-item">
                <span>Diseases</span>
                <strong>{connectedDiseases.length}</strong>
              </div>

              <div className="gene-meta-item">
                <span>Pathways</span>
                <strong>{connectedPathways.length}</strong>
              </div>
            </div>
          )}
        </section>

        <section className="entity-section">
          <div className="entity-section-heading">
            <div>
              <p className="eyebrow">DISEASE CONNECTIONS</p>

              <h2>
                Associated diseases
              </h2>
            </div>

            <Search size={24} />
          </div>

          {connectedDiseases.length > 0 ? (
            <div className="entity-list">
              {connectedDiseases.map((disease) => (
                <Link
                  key={disease.id}
                  to={`/disease/${disease.id}`}
                  className="entity-list-item"
                >
                  <div>
                    <span>Disease</span>

                    <h3>{disease.name}</h3>

                    <p>
                      {disease.description}
                    </p>
                  </div>

                  <ArrowRight size={18} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="entity-empty-state">
              No associated diseases are currently included for this gene.
            </div>
          )}
        </section>

        <section className="entity-section">
          <div className="entity-section-heading">
            <div>
              <p className="eyebrow">BIOLOGICAL SYSTEMS</p>

              <h2>
                Connected pathways
              </h2>
            </div>

            <Network size={24} />
          </div>

          {connectedPathways.length > 0 ? (
            <div className="entity-card-grid">
              {connectedPathways.map((pathway) => (
                <Link
                  key={pathway.id}
                  to={`/pathway/${pathway.id}`}
                  className="entity-card"
                >
                  <div className="entity-card-top">
                    <span>Pathway</span>
                    <ArrowRight size={16} />
                  </div>

                  <h3>
                    {pathway.name}
                  </h3>

                  <p>
                    {pathway.description}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="entity-empty-state">
              No connected pathways are currently included for this gene.
            </div>
          )}
        </section>

        <section className="entity-section gene-context-section">
          <div className="entity-section-heading">
            <div>
              <p className="eyebrow">RESEARCH CONTEXT</p>

              <h2>
                Explore the connection
              </h2>
            </div>

            <Dna size={24} />
          </div>

          <div className="gene-context-card">
            <div>
              <span>Development Workspace</span>

              <h3>
                Connected biomedical evidence will appear here.
              </h3>

              <p>
                Future versions of Helix will connect gene relationships to
                scientific literature, biological databases, evidence scores,
                and traceable sources.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
