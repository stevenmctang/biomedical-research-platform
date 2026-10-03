import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Dna,
  Network,
  Search,
} from 'lucide-react'
import { diseases, genes, pathways } from '../data/biomedicalData'

export function PathwayExplorer() {
  const { id } = useParams()

  const pathway = pathways.find((item) => item.id === id)

  if (!pathway) {
    return (
      <main className="entity-page">
        <Link to="/explore" className="entity-back-link">
          <ArrowLeft size={16} />
          Back to Explorer
        </Link>

        <div className="entity-not-found">
          <p className="eyebrow">PATHWAY EXPLORER</p>

          <h1>Pathway not found.</h1>

          <p>
            This pathway is not currently included in the development dataset.
          </p>
        </div>
      </main>
    )
  }

  const connectedGenes = genes.filter((gene) =>
    pathway.genes.includes(gene.id),
  )

  const connectedDiseases = diseases.filter((disease) =>
    disease.pathways.includes(pathway.id),
  )

  return (
    <div className="entity-page-shell">
      <header className="explorer-nav">
        <div className="explorer-nav-inner">
          <Link to="/" className="brand">
            Helix
          </Link>

          <div className="explorer-nav-label">
            Pathway Explorer
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
          <p className="eyebrow">BIOLOGICAL PATHWAY</p>

          <div className="entity-title-row">
            <div>
              <h1>{pathway.name}</h1>
            </div>

            <div className="entity-badge">
              Pathway
            </div>
          </div>

          <p className="entity-description">
            {pathway.description}
          </p>

          <div className="gene-meta-row">
            <div className="gene-meta-item">
              <span>Genes</span>
              <strong>{connectedGenes.length}</strong>
            </div>

            <div className="gene-meta-item">
              <span>Diseases</span>
              <strong>{connectedDiseases.length}</strong>
            </div>

            <div className="gene-meta-item">
              <span>Type</span>
              <strong>Pathway</strong>
            </div>
          </div>
        </section>

        <section className="entity-section">
          <div className="entity-section-heading">
            <div>
              <p className="eyebrow">GENETIC CONNECTIONS</p>

              <h2>
                Genes in this pathway
              </h2>
            </div>

            <Dna size={24} />
          </div>

          {connectedGenes.length > 0 ? (
            <div className="entity-card-grid">
              {connectedGenes.map((gene) => (
                <Link
                  key={gene.id}
                  to={`/gene/${gene.id}`}
                  className="entity-card"
                >
                  <div className="entity-card-top">
                    <span>Gene / Target</span>
                    <ArrowRight size={16} />
                  </div>

                  <h3>
                    {gene.symbol}
                  </h3>

                  <p className="entity-card-subtitle">
                    {gene.name}
                  </p>

                  <p>
                    {gene.description}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="entity-empty-state">
              No connected genes are currently included for this pathway.
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

                    <h3>
                      {disease.name}
                    </h3>

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
              No connected diseases are currently included for this pathway.
            </div>
          )}
        </section>

        <section className="entity-section gene-context-section">
          <div className="entity-section-heading">
            <div>
              <p className="eyebrow">PATHWAY CONTEXT</p>

              <h2>
                Explore the biological network
              </h2>
            </div>

            <Network size={24} />
          </div>

          <div className="gene-context-card">
            <div>
              <span>Development Workspace</span>

              <h3>
                Pathways connect genes, diseases, and biological processes.
              </h3>

              <p>
                Future versions of Helix will connect pathway relationships to
                scientific literature, biomedical databases, evidence scores,
                and traceable research sources.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
