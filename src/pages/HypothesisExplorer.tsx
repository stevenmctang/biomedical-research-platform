import {
  useMemo,
  useState,
} from 'react'

import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Beaker,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Dna,
  FlaskConical,
  Network,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'

import {
  generateHypotheses,
} from '../utils/generateHypotheses'

import type {
  HypothesisStatus,
} from '../types/hypothesis'


type HypothesisFilter =
  | 'All'
  | HypothesisStatus


const hypothesisFilters:
  HypothesisFilter[] = [
    'All',
    'Candidate',
    'Emerging',
    'Exploratory',
  ]


function getEntityIcon(
  type: string,
) {
  if (
    type === 'gene'
  ) {
    return (
      <Dna size={14} />
    )
  }


  if (
    type === 'drug'
  ) {
    return (
      <FlaskConical size={14} />
    )
  }


  if (
    type === 'pathway'
  ) {
    return (
      <Network size={14} />
    )
  }


  return (
    <Beaker size={14} />
  )
}


export function HypothesisExplorer() {
  const [
    activeFilter,
    setActiveFilter,
  ] =
    useState<HypothesisFilter>(
      'All',
    )


  const hypotheses =
    useMemo(
      () =>
        generateHypotheses(),
      [],
    )


  const filteredHypotheses =
    useMemo(
      () => {

        if (
          activeFilter === 'All'
        ) {
          return hypotheses
        }


        return hypotheses.filter(
          (hypothesis) =>
            hypothesis.status ===
            activeFilter,
        )

      },
      [
        activeFilter,
        hypotheses,
      ],
    )


  return (
    <div className="hypothesis-page-shell">

      <header className="explorer-nav">

        <div className="explorer-nav-inner">

          <Link
            to="/"
            className="brand"
          >
            Helix
          </Link>

          <div className="explorer-nav-label">
            Hypothesis Explorer
          </div>

          <Link
            to="/explore"
            className="explorer-back-link"
          >
            Research Explorer
          </Link>

        </div>

      </header>


      <main className="hypothesis-page">

        <Link
          to="/explore"
          className="entity-back-link"
        >
          <ArrowLeft size={16} />

          Back to Research Explorer
        </Link>


        <section className="hypothesis-hero">

          <div className="hypothesis-hero-copy">

            <p className="eyebrow">
              HYPOTHESIS ENGINE
            </p>

            <h1>
              Find connections
              <br />
              worth investigating.
            </h1>

            <p>
              Helix analyzes disease,
              gene, pathway, therapeutic,
              and evidence relationships
              to surface transparent
              computational research
              candidates.
            </p>

          </div>


          <div className="hypothesis-hero-visual">

            <div className="hypothesis-visual-icon">
              <BrainCircuit size={34} />
            </div>

            <span>
              GENERATED FROM NETWORK DATA
            </span>

            <strong>
              Relationships → Evidence → Ranking
            </strong>

            <p>
              Candidate scores reflect
              network structure and available
              evidence only. They do not
              represent biological certainty
              or experimental validation.
            </p>

          </div>

        </section>


        <section className="hypothesis-safety-notice">

          <ShieldCheck size={20} />

          <div>

            <strong>
              Network support is not
              scientific certainty
            </strong>

            <p>
              Helix ranks computational
              research candidates to help
              organize investigation.
              Independent scientific and
              experimental validation is
              required.
            </p>

          </div>

        </section>


        <section className="hypothesis-workspace">

          <div className="hypothesis-workspace-heading">

            <div>

              <p className="eyebrow">
                GENERATED CANDIDATES
              </p>

              <h2>
                Ranked research hypotheses
              </h2>

            </div>

            <div className="hypothesis-count">
              {filteredHypotheses.length}
            </div>

          </div>


          <div className="hypothesis-filter-bar">

            {hypothesisFilters.map(
              (filter) => (

                <button
                  key={filter}
                  type="button"
                  onClick={() =>
                    setActiveFilter(
                      filter,
                    )
                  }
                  className={
                    activeFilter === filter
                      ? 'hypothesis-filter active'
                      : 'hypothesis-filter'
                  }
                >
                  {filter}
                </button>

              ),
            )}

          </div>


          <div className="hypothesis-list">

            {filteredHypotheses.map(
              (
                hypothesis,
                index,
              ) => (

                <article
                  key={hypothesis.id}
                  className="hypothesis-card"
                >

                  <div className="hypothesis-card-index">
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      '0',
                    )}
                  </div>


                  <div className="hypothesis-card-main">

                    <div className="hypothesis-card-top">

                      <div className="hypothesis-status-row">

                        <span className="hypothesis-computational-label">

                          <Sparkles size={12} />

                          Generated hypothesis

                        </span>


                        <span
                          className={
                            `hypothesis-status ` +
                            `hypothesis-status-${hypothesis.status.toLowerCase()}`
                          }
                        >
                          {hypothesis.status}
                        </span>

                      </div>


                      <div className="hypothesis-score-pill">

                        <BarChart3 size={14} />

                        <strong>
                          {hypothesis.score}
                        </strong>

                        <span>
                          / {hypothesis.maxScore}
                        </span>

                      </div>

                    </div>


                    <div className="hypothesis-support-level">
                      {hypothesis.supportLevel}
                    </div>


                    <h3>
                      {hypothesis.title}
                    </h3>


                    <p className="hypothesis-question">
                      {hypothesis.question}
                    </p>


                    <p className="hypothesis-summary">
                      {hypothesis.summary}
                    </p>


                    <div className="hypothesis-entities">

                      <span>
                        CONNECTED ENTITIES
                      </span>


                      <div className="hypothesis-entity-row">

                        {hypothesis.entities.map(
                          (entity) => (

                            <Link
                              key={
                                `${entity.type}-${entity.id}`
                              }
                              to={
                                `/${entity.type}/${entity.id}`
                              }
                              className="hypothesis-entity-chip"
                            >

                              {getEntityIcon(
                                entity.type,
                              )}

                              {entity.label}

                            </Link>

                          ),
                        )}

                      </div>

                    </div>


                    <div className="hypothesis-rationale">

                      <span>
                        WHY HELIX SURFACED THIS
                      </span>

                      <p>
                        {hypothesis.rationale}
                      </p>

                    </div>


                    <div className="hypothesis-signals">

                      <span>
                        SUPPORTING SIGNALS
                      </span>


                      <div className="hypothesis-signal-grid">

                        {hypothesis.signals.map(
                          (
                            signal,
                            signalIndex,
                          ) => (

                            <div
                              key={
                                `${signal.type}-${signalIndex}`
                              }
                              className="hypothesis-signal"
                            >

                              <CheckCircle2 size={15} />

                              <div>

                                <strong>
                                  {signal.type}
                                </strong>

                                <p>
                                  {signal.description}
                                </p>

                              </div>

                            </div>

                          ),
                        )}

                      </div>

                    </div>


                    <div className="hypothesis-score-section">

                      <div className="hypothesis-score-heading">

                        <div>

                          <span>
                            RANKING LOGIC
                          </span>

                          <strong>
                            Why this ranked here
                          </strong>

                        </div>


                        <div className="hypothesis-score-large">

                          {hypothesis.score}

                          <span>
                            / {hypothesis.maxScore}
                          </span>

                        </div>

                      </div>


                      <div className="hypothesis-score-breakdown">

                        {hypothesis.scoreBreakdown.map(
                          (
                            item,
                            itemIndex,
                          ) => (

                            <div
                              key={
                                `${item.label}-${itemIndex}`
                              }
                              className="hypothesis-score-row"
                            >

                              <div>

                                <strong>
                                  {item.label}
                                </strong>

                                <p>
                                  {item.description}
                                </p>

                              </div>


                              <span>
                                +{item.points}
                              </span>

                            </div>

                          ),
                        )}

                      </div>

                    </div>


                    <div className="hypothesis-evidence-summary">

                      <div>

                        <BookOpen size={17} />

                        <span>
                          {
                            hypothesis.evidenceRecordCount
                          }{' '}
                          evidence{' '}
                          {
                            hypothesis.evidenceRecordCount === 1
                              ? 'record'
                              : 'records'
                          }
                        </span>

                      </div>


                      <div>

                        <Network size={17} />

                        <span>
                          {
                            hypothesis.traceableSourceCount
                          }{' '}
                          traceable{' '}
                          {
                            hypothesis.traceableSourceCount === 1
                              ? 'source'
                              : 'sources'
                          }
                        </span>

                      </div>

                    </div>


                    <div className="hypothesis-validation">

                      <ShieldCheck size={16} />

                      <p>
                        {
                          hypothesis.validationNotice
                        }
                      </p>

                    </div>


                    <Link
                      to="/explore"
                      className="hypothesis-research-link"
                    >
                      Investigate in
                      Research Explorer

                      <ArrowRight size={15} />
                    </Link>

                  </div>

                </article>

              ),
            )}

          </div>

        </section>


        <section className="hypothesis-future">

          <div>

            <p className="eyebrow">
              EXPLAINABLE RANKING
            </p>

            <h2>
              Every candidate has
              a reason for being here.
            </h2>

          </div>


          <div className="hypothesis-future-steps">

            <div>

              <span>
                01
              </span>

              <strong>
                Find convergence
              </strong>

              <p>
                Helix identifies genes,
                pathways, diseases, and
                therapeutics that share
                network context.
              </p>

            </div>


            <div>

              <span>
                02
              </span>

              <strong>
                Measure support
              </strong>

              <p>
                Structured evidence
                records and traceable
                research sources contribute
                to the ranking.
              </p>

            </div>


            <div>

              <span>
                03
              </span>

              <strong>
                Explain the score
              </strong>

              <p>
                Every point can be traced
                back to an observable
                network or evidence signal.
              </p>

            </div>

          </div>

        </section>

      </main>


      <footer className="explorer-footer">

        <span>
          Helix Biomedical Research
          Intelligence
        </span>

        <p>
          Computational hypothesis scores
          rank network support only.
          Biomedical conclusions require
          independent scientific validation.
        </p>

      </footer>

    </div>
  )
}
