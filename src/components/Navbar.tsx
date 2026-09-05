import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          Helix
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#platform">Platform</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#research">Research</a>
        </nav>

        <Link to="/explore" className="nav-cta">
          Launch Explorer
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </header>
  )
}
