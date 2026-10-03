import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  FlaskConical,
  Search,
} from 'lucide-react'
import { diseases, drugs } from '../data/biomedicalData'

export function DrugExplorer() {
  const { id } = useParams()

  const drug = drugs.find((item) => item.id === id)

  if (!drug) {
    return (
      <main className="entity-page">
        <Link to="/explore" className="entity-back-link">
          <ArrowLeft size={16} />
          Back to Explorer
        </Link>

        <div className="entity-not-found">
          <p className="eyebrow">DRUG EXPLORER</p>

          <h1>Drug not found.</h1>

          <p>
            This drug is not currently included in the development dataset.
          </p>
        </div>
      </main>
    )
  }

  const connectedDiseases = diseases.filter((disease) =>
    drug.associatedDiseases.includes(disease.id),
  )

  return (
    <div className="entity-page-shell">
      <header className="explorer-nav">
        <div className="explorer-nav-inner">
          <Link to="/" className="brand">
            Helix
          </Link>

          <div className="explorer-nav-label">
            Drug Explorer
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
          <p className="eyebrow">THERAPEUTIC</p>

          <div className="entity-title-row">
            <div>
              <h1>{drug.name}</h1>

              <p className="entity-abbreviation">
                {drug.developmentStatus}
              </p>
            </div>

            <div className="entity-badge">
              Drug
            </div>
          </div>

          <p className="entity-description">
            {drug.description}
          </p>

          <div className="gene-meta-row">
            <div className="gene-meta-item">
              <span>Status</span>
              <strong>{drug.developmentStatus}</strong>
            </div>

            <div className="gene-meta-item">
              <span>Diseases</span>
              <strong>{connectedDiseases.length}</strong>
            </div>

            <div className="gene-meta-item">
              <span>Targets</span>
              <strong>{drug.targets.length}</strong>
            </div>
          </div>
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
              No associated diseases are currently included for this drug.
            </div>
          )}
        </section>

        <section className="entity-section gene-context-section">
          <div className="entity-section-heading">
            <div>
              <p className="eyebrow">THERAPEUTIC CONTEXT</p>

              <h2>
                Research context
              </h2>
            </div>

            <FlaskConical size={24} />
          </div>

          <div className="gene-context-card">
            <div>
              <span>Development Workspace</span>

              <h3>
                Therapeutic evidence will be connected here.
              </h3>

              <p>
                Future versions of Helix will connect drugs to biomedical
                targets, clinical research, disease biology, scientific
                literature, and traceable evidence sources.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
