import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Dna,
  ExternalLink,
  FlaskConical,
  Network,
  ShieldCheck,
} from 'lucide-react'

import {
  diseases,
  drugs,
  genes,
  pathways,
} from '../data/biomedicalData'

import { evidenceRecords } from '../data/evidenceData'

import type {
  EvidenceCategory,
  EvidenceSource,
} from '../types/evidence'

const evidenceFilters: Array<'All' | EvidenceCategory> = [
  'All',
  'Genetics',
  'Literature',
  'Pathway',
  'Clinical',
  'Database',
]

function getSourceUrl(source: EvidenceSource) {
  if (!source.externalId) {
    return null
  }

  if (
    source.sourceType === 'PubMed' ||
    source.sourceType === 'Clinical Study'
  ) {
    return `https://pubmed.ncbi.nlm.nih.gov/${source.externalId}/`
  }

  if (source.sourceType === 'NCBI Gene') {
    return `https://www.ncbi.nlm.nih.gov/gene/${source.externalId}`
  }

  return null
}

export function DiseaseExplorer() {
  const { id } = useParams()

  const [activeEvidenceFilter, setActiveEvidenceFilter] =
    useState<'All' | EvidenceCategory>('All')

  const disease = diseases.find(
    (item) => item.id === id,
  )

  if (!disease) {
    return (
      <main className="entity-page">
        <Link
          to="/explore"
          className="entity-back-link"
        >
          <ArrowLeft size={16} />
          Back to Explorer
        </Link>

        <div className="entity-not-found">
          <p className="eyebrow">
            DISEASE EXPLORER
          </p>

          <h1>
            Disease not found.
          </h1>

          <p>
            This disease is not currently included in the development dataset.
          </p>
        </div>
      </main>
    )
  }

  const connectedGenes = genes.filter(
    (gene) =>
      disease.genes.includes(gene.id),
  )

  const connectedPathways = pathways.filter(
    (pathway) =>
      disease.pathways.includes(pathway.id),
  )

  const connectedDrugs = drugs.filter(
    (drug) =>
      disease.drugs.includes(drug.id),
  )

  const diseaseEvidence = evidenceRecords.filter(
    (evidence) =>
      evidence.diseaseId === disease.id,
  )

  const filteredEvidence = useMemo(() => {
    if (activeEvidenceFilter === 'All') {
      return diseaseEvidence
    }

    return diseaseEvidence.filter(
      (evidence) =>
        evidence.categories.includes(activeEvidenceFilter),
    )
  }, [
    activeEvidenceFilter,
    diseaseEvidence,
  ])

  return (
    <div className="entity-page-shell">

      <header className="explorer-nav">
        <div className="explorer-nav-inner">

          <Link
            to="/"
            className="brand"
          >
            Helix
          </Link>

          <div className="explorer-nav-label">
            Disease Explorer
          </div>

          <Link
            to="/explore"
            className="explorer-back-link"
          >
            Research Explorer
          </Link>

        </div>
      </header>

      <main className="entity-page">

        <Link
          to="/explore"
          className="entity-back-link"
        >
          <ArrowLeft size={16} />

          Back to Explorer
        </Link>

        <section className="entity-hero">

          <p className="eyebrow">
            DISEASE
          </p>

          <div className="entity-title-row">

            <div>
              <h1>
                {disease.name}
              </h1>

              {disease.abbreviation && (
                <p className="entity-abbreviation">
                  {disease.abbreviation}
                </p>
              )}
            </div>

            <div className="entity-badge">
              Disease
            </div>

          </div>

          <p className="entity-description">
            {disease.description}
          </p>

        </section>

        <section className="entity-section">

          <div className="entity-section-heading">

            <div>
              <p className="eyebrow">
                CONNECTED BIOLOGY
              </p>

              <h2>
                Associated genes
              </h2>
            </div>

            <Dna size={24} />

          </div>

          <div className="entity-card-grid">

            {connectedGenes.map(
              (gene) => (
                <Link
                  key={gene.id}
                  to={`/gene/${gene.id}`}
                  className="entity-card"
                >

                  <div className="entity-card-top">

                    <span>
                      Gene / Target
                    </span>

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
              ),
            )}

          </div>

        </section>

        <section className="entity-section">

          <div className="entity-section-heading">

            <div>
              <p className="eyebrow">
                BIOLOGICAL SYSTEMS
              </p>

              <h2>
                Related pathways
              </h2>
            </div>

            <Network size={24} />

          </div>

          {connectedPathways.length > 0 ? (
            <div className="entity-list">

              {connectedPathways.map(
                (pathway) => (
                  <Link
                    key={pathway.id}
                    to={`/pathway/${pathway.id}`}
                    className="entity-list-item"
                  >

                    <div>

                      <span>
                        Pathway
                      </span>

                      <h3>
                        {pathway.name}
                      </h3>

                      <p>
                        {pathway.description}
                      </p>

                    </div>

                    <ArrowRight size={18} />

                  </Link>
                ),
              )}

            </div>
          ) : (
            <div className="entity-empty-state">
              No pathways are currently included.
            </div>
          )}

        </section>

        <section className="entity-section">

          <div className="entity-section-heading">

            <div>
              <p className="eyebrow">
                THERAPEUTICS
              </p>

              <h2>
                Connected drugs
              </h2>
            </div>

            <FlaskConical size={24} />

          </div>

          {connectedDrugs.length > 0 ? (
            <div className="entity-list">

              {connectedDrugs.map(
                (drug) => (
                  <Link
                    key={drug.id}
                    to={`/drug/${drug.id}`}
                    className="entity-list-item"
                  >

                    <div>

                      <span>
                        {drug.developmentStatus}
                      </span>

                      <h3>
                        {drug.name}
                      </h3>

                      <p>
                        {drug.description}
                      </p>

                    </div>

                    <ArrowRight size={18} />

                  </Link>
                ),
              )}

            </div>
          ) : (
            <div className="entity-empty-state">
              No drugs are currently included.
            </div>
          )}

        </section>

        <section className="entity-section evidence-engine-section">

          <div className="entity-section-heading">

            <div>

              <p className="eyebrow">
                EVIDENCE INTELLIGENCE
              </p>

              <h2>
                Trace the evidence
              </h2>

            </div>

            <ShieldCheck size={25} />

          </div>

          <p className="evidence-engine-intro">
            Explore the research records supporting relationships in the
            Helix biomedical network. Source-backed records link directly
            to public biomedical databases and scientific literature.
          </p>

          <div className="evidence-filter-bar">

            {evidenceFilters.map(
              (filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() =>
                    setActiveEvidenceFilter(filter)
                  }
                  className={
                    activeEvidenceFilter === filter
                      ? 'evidence-filter-button evidence-filter-button-active'
                      : 'evidence-filter-button'
                  }
                >
                  {filter}
                </button>
              ),
            )}

          </div>

          <div className="evidence-filter-summary">

            <span>
              Showing
            </span>

            <strong>
              {filteredEvidence.length}
            </strong>

            <span>
              {filteredEvidence.length === 1
                ? 'relationship'
                : 'relationships'}
            </span>

          </div>

          {filteredEvidence.length > 0 ? (

            <div className="evidence-engine-grid">

              {filteredEvidence.map(
                (evidence) => (
                  <article
                    key={evidence.id}
                    className="relationship-evidence-card"
                  >

                    <div className="relationship-evidence-top">

                      <span className="relationship-label">
                        {evidence.entityType} relationship
                      </span>

                      <span
                        className={
                          `relationship-strength ` +
                          `relationship-strength-${evidence.strength.toLowerCase()}`
                        }
                      >
                        {evidence.strength}
                      </span>

                    </div>

                    <h3>
                      {evidence.title}
                    </h3>

                    <p className="relationship-summary">
                      {evidence.summary}
                    </p>

                    <div className="evidence-category-row">

                      {evidence.categories.map(
                        (category) => (
                          <span
                            key={category}
                            className="evidence-category-chip"
                          >
                            <CheckCircle2 size={13} />

                            {category}
                          </span>
                        ),
                      )}

                    </div>

                    <div className="real-source-section">

                      <div className="real-source-heading">

                        <span>
                          SOURCES
                        </span>

                        <strong>
                          {evidence.sources.length}
                        </strong>

                      </div>

                      {evidence.sources.length > 0 ? (

                        <div className="real-source-list">

                          {evidence.sources.map(
                            (source) => {

                              const sourceUrl =
                                getSourceUrl(source)

                              return (
                                <article
                                  key={source.id}
                                  className="real-source-card"
                                >

                                  <div className="real-source-top">

                                    <span className="source-database">
                                      {source.sourceType}
                                    </span>

                                    {source.year && (
                                      <span className="source-year">
                                        {source.year}
                                      </span>
                                    )}

                                  </div>

                                  <h4>
                                    {source.title}
                                  </h4>

                                  {source.authors && (
                                    <p className="source-authors">
                                      {source.authors}
                                    </p>
                                  )}

                                  {source.publication && (
                                    <p className="source-publication">
                                      {source.publication}
                                    </p>
                                  )}

                                  <p className="source-description">
                                    {source.description}
                                  </p>

                                  <div className="source-identifiers">

                                    {source.externalId && (
                                      <span>
                                        ID {source.externalId}
                                      </span>
                                    )}

                                    {source.doi && (
                                      <span>
                                        DOI {source.doi}
                                      </span>
                                    )}

                                  </div>

                                  {sourceUrl && (
                                    <a
                                      href={sourceUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="source-open-button"
                                    >
                                      View source

                                      <ExternalLink size={14} />
                                    </a>
                                  )}

                                </article>
                              )
                            },
                          )}

                        </div>

                      ) : (

                        <div className="source-pending">

                          <BookOpen size={17} />

                          <div>

                            <strong>
                              Source integration pending
                            </strong>

                            <p>
                              This relationship is still
                              using development evidence.
                            </p>

                          </div>

                        </div>

                      )}

                    </div>

                    <Link
                      to={`/${evidence.entityType}/${evidence.entityId}`}
                      className="relationship-open-link"
                    >
                      Explore entity

                      <ArrowRight size={16} />
                    </Link>

                  </article>
                ),
              )}

            </div>

          ) : (

            <div className="evidence-filter-empty">

              <BookOpen size={22} />

              <h3>
                No evidence in this category yet.
              </h3>

              <p>
                Try another evidence type or return to All.
              </p>

            </div>

          )}

          <div className="evidence-development-notice">

            <ShieldCheck size={18} />

            <div>

              <strong>
                Evidence transparency
              </strong>

              <p>
                Records with listed sources are connected to identifiable
                public research references. Relationships marked as pending
                remain part of the development dataset and should not be
                interpreted as independently validated scientific conclusions.
              </p>

            </div>

          </div>

        </section>

        <section className="entity-section evidence-section">

          <div className="entity-section-heading">

            <div>

              <p className="eyebrow">
                EVIDENCE OVERVIEW
              </p>

              <h2>
                Evidence categories
              </h2>

            </div>

            <BookOpen size={24} />

          </div>

          <div className="evidence-grid">

            {Object.entries(
              disease.evidence,
            ).map(
              ([category, strength]) => (
                <article
                  key={category}
                  className="evidence-card"
                >

                  <span>
                    {category}
                  </span>

                  <strong>
                    {strength}
                  </strong>

                  <div
                    className={
                      `evidence-indicator evidence-${strength}`
                    }
                  />

                </article>
              ),
            )}

          </div>

          <p className="evidence-note">
            Summary strength labels remain part of the development scoring
            model. Source records above provide the traceable evidence layer.
          </p>

        </section>

      </main>

    </div>
  )
}
