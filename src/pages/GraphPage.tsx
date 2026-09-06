import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { KnowledgeGraphView } from '../components/graph/KnowledgeGraphView'

export function GraphPage() {
  return (
    <div className="kg-page">
      <header className="kg-page-header">
        <div className="kg-page-header-inner">
          <Link to="/" className="brand">
            Helix
          </Link>

          <span className="kg-page-title">Knowledge Graph</span>

          <Link to="/" className="kg-page-back">
            <ArrowLeft size={15} />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="kg-page-main">
        <KnowledgeGraphView />
      </main>

      <footer className="kg-page-footer">
        <span>Helix Biomedical Research Intelligence</span>
        <p>
          Development dataset for research and educational use. Biomedical
          relationships require independent scientific validation.
        </p>
      </footer>
    </div>
  )
}
