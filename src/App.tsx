import {
  useMemo,
  useState,
} from 'react'

import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  ArrowRight,
  BookOpen,
  Calendar,
  FolderKanban,
  Network,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react'

import {
  Home,
} from './pages/Home'

import {
  Explore,
} from './pages/Explore'

import {
  DiseaseExplorer,
} from './pages/DiseaseExplorer'

import {
  GeneExplorer,
} from './pages/GeneExplorer'

import {
  PathwayExplorer,
} from './pages/PathwayExplorer'

import {
  DrugExplorer,
} from './pages/DrugExplorer'

import {
  HypothesisExplorer,
} from './pages/HypothesisExplorer'

import {
  Auth,
} from './pages/Auth'

import {
  AuthCallback,
} from './pages/AuthCallback'

import {
  ResearchMapDemo,
} from './pages/ResearchMapDemo'

import {
  GraphPage,
} from './pages/GraphPage'

import './App.css'

interface StoredResearchProject {
  id: string
  title?: string
  question?: string
  createdAt?: string
  updatedAt?: string
  researchMap?: {
    domain?: string
    nodes?: unknown[]
    edges?: unknown[]
    sources?: unknown[]
  }
}

const PROJECTS_KEY =
  'helix.researchProjects.v1'

const ACTIVE_PROJECT_ID_KEY =
  'helix.activeProjectId.v1'

function loadStoredProjects() {
  if (
    typeof window === 'undefined' ||
    !window.localStorage
  ) {
    return []
  }

  try {
    const raw =
      window.localStorage.getItem(
        PROJECTS_KEY,
      )

    if (
      !raw
    ) {
      return []
    }

    const parsed =
      JSON.parse(
        raw,
      )

    if (
      !Array.isArray(
        parsed,
      )
    ) {
      return []
    }

    return parsed.filter(
      (
        project,
      ): project is StoredResearchProject =>
        Boolean(
          project,
        ) &&
        typeof project.id ===
          'string',
    )
  } catch {
    return []
  }
}

function saveStoredProjects(
  projects:
    StoredResearchProject[],
) {
  if (
    typeof window === 'undefined' ||
    !window.localStorage
  ) {
    return
  }

  window.localStorage.setItem(
    PROJECTS_KEY,
    JSON.stringify(
      projects,
    ),
  )
}

function formatProjectDate(
  value:
    string | undefined,
) {
  if (
    !value
  ) {
    return 'Recently updated'
  }

  const date =
    new Date(
      value,
    )

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return 'Recently updated'
  }

  return date.toLocaleDateString(
    undefined,
    {
      month:
        'short',

      day:
        'numeric',

      year:
        'numeric',
    },
  )
}

function getProjectTitle(
  project:
    StoredResearchProject,
) {
  return (
    project.title ??
    project.question ??
    'Untitled investigation'
  )
}

function getProjectQuestion(
  project:
    StoredResearchProject,
) {
  return (
    project.question ??
    'No research question saved.'
  )
}

function ProjectsPage() {
  const navigate =
    useNavigate()

  const [
    search,
    setSearch,
  ] =
    useState(
      '',
    )

  const [
    projects,
    setProjects,
  ] =
    useState<
      StoredResearchProject[]
    >(
      () =>
        loadStoredProjects(),
    )

  const filteredProjects =
    useMemo(
      () => {
        const query =
          search
            .trim()
            .toLowerCase()

        const sortedProjects =
          [...projects].sort(
            (
              first,
              second,
            ) => {
              const firstTime =
                new Date(
                  first.updatedAt ??
                    first.createdAt ??
                    0,
                ).getTime()

              const secondTime =
                new Date(
                  second.updatedAt ??
                    second.createdAt ??
                    0,
                ).getTime()

              return (
                secondTime -
                firstTime
              )
            },
          )

        if (
          !query
        ) {
          return sortedProjects
        }

        return sortedProjects.filter(
          (
            project,
          ) => {
            const title =
              getProjectTitle(
                project,
              )

            const question =
              getProjectQuestion(
                project,
              )

            const domain =
              project.researchMap?.domain ??
              ''

            return (
              title
                .toLowerCase()
                .includes(
                  query,
                ) ||
              question
                .toLowerCase()
                .includes(
                  query,
                ) ||
              domain
                .toLowerCase()
                .includes(
                  query,
                )
            )
          },
        )
      },
      [
        projects,
        search,
      ],
    )

  const totalConcepts =
    projects.reduce(
      (
        total,
        project,
      ) =>
        total +
        (
          project.researchMap
            ?.nodes
            ?.length ??
          0
        ),
      0,
    )

  const totalRelationships =
    projects.reduce(
      (
        total,
        project,
      ) =>
        total +
        (
          project.researchMap
            ?.edges
            ?.length ??
          0
        ),
      0,
    )

  function startNewInvestigation() {
    window.localStorage.removeItem(
      ACTIVE_PROJECT_ID_KEY,
    )

    navigate(
      '/explore',
    )
  }

  function openProject(
    projectId:
      string,
  ) {
    window.localStorage.setItem(
      ACTIVE_PROJECT_ID_KEY,
      projectId,
    )

    navigate(
      `/explore/${projectId}`,
    )
  }

  function deleteProject(
    project:
      StoredResearchProject,
  ) {
    const title =
      getProjectTitle(
        project,
      )

    const confirmed =
      window.confirm(
        `Delete "${title}"? This removes it from this browser only.`,
      )

    if (
      !confirmed
    ) {
      return
    }

    const updatedProjects =
      projects.filter(
        (
          candidate,
        ) =>
          candidate.id !==
          project.id,
      )

    saveStoredProjects(
      updatedProjects,
    )

    setProjects(
      updatedProjects,
    )

    if (
      window.localStorage.getItem(
        ACTIVE_PROJECT_ID_KEY,
      ) ===
      project.id
    ) {
      window.localStorage.removeItem(
        ACTIVE_PROJECT_ID_KEY,
      )
    }
  }

  function renameProject(
    project:
      StoredResearchProject,
  ) {
    const currentTitle =
      getProjectTitle(
        project,
      )

    const nextTitle =
      window.prompt(
        'Rename this investigation:',
        currentTitle,
      )

    if (
      nextTitle ===
      null
    ) {
      return
    }

    const cleaned =
      nextTitle.trim()

    if (
      !cleaned
    ) {
      return
    }

    const updatedProjects =
      projects.map(
        (
          candidate,
        ) =>
          candidate.id ===
          project.id
            ? {
                ...candidate,
                title:
                  cleaned,
                updatedAt:
                  new Date().toISOString(),
              }
            : candidate,
      )

    saveStoredProjects(
      updatedProjects,
    )

    setProjects(
      updatedProjects,
    )
  }

  return (
    <div className="helix-projects-page">
      <style>
        {`
          .helix-projects-page {
            min-height: 100vh;
            background:
              radial-gradient(circle at 12% 4%, rgba(76, 101, 214, 0.13), transparent 30%),
              radial-gradient(circle at 90% 12%, rgba(40, 90, 140, 0.09), transparent 28%),
              #f8f7f1;
            color: #242923;
          }

          .helix-projects-nav {
            height: 72px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
            padding: 0 36px;
            border-bottom: 1px solid #e3e6de;
            background: rgba(248, 247, 241, 0.92);
            backdrop-filter: blur(16px);
          }

          .helix-projects-nav-actions {
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .helix-projects-nav-link {
            color: #5d665c;
            text-decoration: none;
            font-size: 13px;
            font-weight: 700;
          }

          .helix-projects-nav-link:hover {
            color: #294ea8;
          }

          .helix-projects-main {
            width: min(1180px, calc(100% - 40px));
            margin: 0 auto;
            padding: 52px 0 86px;
          }

          .helix-projects-hero {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 360px;
            gap: 26px;
            align-items: stretch;
            margin-bottom: 26px;
          }

          .helix-projects-hero-copy {
            padding: 34px;
            border: 1px solid #e3e6de;
            border-radius: 28px;
            background: rgba(255, 254, 249, 0.75);
            box-shadow: 0 24px 70px rgba(35, 42, 32, 0.07);
          }

          .helix-projects-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #3655a5;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.7px;
            text-transform: uppercase;
          }

          .helix-projects-hero h1 {
            max-width: 760px;
            margin: 16px 0 12px;
            font-size: clamp(38px, 6vw, 68px);
            line-height: 0.96;
            letter-spacing: -2.7px;
          }

          .helix-projects-hero p {
            max-width: 690px;
            margin: 0;
            color: #687066;
            font-size: 16px;
            line-height: 1.65;
          }

          .helix-projects-command-panel {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 18px;
            padding: 24px;
            border: 1px solid #dfe4dc;
            border-radius: 28px;
            background: #fffef9;
            box-shadow: 0 24px 70px rgba(35, 42, 32, 0.08);
          }

          .helix-projects-command-panel h2 {
            margin: 0 0 8px;
            font-size: 22px;
            letter-spacing: -0.5px;
          }

          .helix-projects-command-panel p {
            margin: 0;
            color: #687066;
            font-size: 14px;
            line-height: 1.6;
          }

          .helix-projects-primary-button,
          .helix-projects-empty button,
          .helix-project-continue {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 9px;
            min-height: 44px;
            padding: 0 16px;
            border: 1px solid #253b75;
            border-radius: 12px;
            background: #253b75;
            color: white;
            font-size: 13px;
            font-weight: 750;
            cursor: pointer;
            white-space: nowrap;
            text-decoration: none;
          }

          .helix-projects-primary-button:hover,
          .helix-projects-empty button:hover,
          .helix-project-continue:hover {
            background: #1e3267;
            border-color: #1e3267;
          }

          .helix-projects-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }

          .helix-projects-stat {
            padding: 14px;
            border: 1px solid #edf0e9;
            border-radius: 18px;
            background: #fbfbf6;
          }

          .helix-projects-stat strong {
            display: block;
            color: #242923;
            font-size: 25px;
            line-height: 1;
          }

          .helix-projects-stat span {
            display: block;
            margin-top: 6px;
            color: #737b70;
            font-size: 11px;
            font-weight: 750;
            letter-spacing: 0.4px;
            text-transform: uppercase;
          }

          .helix-projects-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            margin: 24px 0 20px;
          }

          .helix-projects-toolbar > span {
            color: #7b8279;
            font-size: 13px;
            font-weight: 700;
          }

          .helix-projects-search {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 10px;
            min-height: 48px;
            padding: 0 15px;
            border: 1px solid #e3e6de;
            border-radius: 15px;
            background: rgba(255, 254, 249, 0.9);
            color: #7b8279;
          }

          .helix-projects-search input {
            width: 100%;
            border: 0;
            outline: 0;
            background: transparent;
            color: #242923;
            font-size: 15px;
          }

          .helix-project-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }

          .helix-project-card {
            display: flex;
            flex-direction: column;
            gap: 18px;
            padding: 20px;
            border: 1px solid #e4e7df;
            border-radius: 22px;
            background: rgba(255, 254, 249, 0.94);
            box-shadow: 0 18px 45px rgba(30, 35, 28, 0.06);
            transition:
              transform 180ms ease,
              box-shadow 180ms ease,
              border-color 180ms ease;
          }

          .helix-project-card:hover {
            transform: translateY(-2px);
            border-color: #d1d8ff;
            box-shadow: 0 28px 65px rgba(30, 35, 28, 0.09);
          }

          .helix-project-card-top {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 10px;
          }

          .helix-project-badge {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            width: fit-content;
            padding: 7px 10px;
            border-radius: 999px;
            background: #edf1ff;
            color: #3655a5;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.4px;
            text-transform: uppercase;
          }

          .helix-project-date {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: #7b8279;
            font-size: 12px;
            font-weight: 650;
          }

          .helix-project-card h3 {
            margin: 0;
            color: #242923;
            font-size: 23px;
            line-height: 1.15;
            letter-spacing: -0.55px;
          }

          .helix-project-card p {
            margin: -8px 0 0;
            color: #687066;
            font-size: 14px;
            line-height: 1.6;
          }

          .helix-project-domain {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            width: fit-content;
            color: #42503f;
            font-size: 13px;
            font-weight: 750;
          }

          .helix-project-metrics {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
          }

          .helix-project-metric {
            padding: 11px 10px;
            border: 1px solid #e8ebe4;
            border-radius: 15px;
            background: #fbfbf6;
          }

          .helix-project-metric strong {
            display: block;
            color: #242923;
            font-size: 18px;
          }

          .helix-project-metric span {
            display: block;
            margin-top: 4px;
            color: #7b8279;
            font-size: 11px;
            font-weight: 700;
          }

          .helix-project-card-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            padding-top: 4px;
          }

          .helix-project-secondary-actions {
            display: flex;
            gap: 8px;
          }

          .helix-project-card-actions button {
            min-height: 38px;
            padding: 0 11px;
            border: 1px solid #e4e7df;
            border-radius: 11px;
            background: #ffffff;
            color: #566054;
            font-size: 12px;
            font-weight: 750;
            cursor: pointer;
          }

          .helix-project-card-actions button:hover {
            border-color: #cfd6ca;
            background: #f7f8f3;
          }

          .helix-project-card-actions .helix-project-danger {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: #a64242;
          }

          .helix-projects-empty {
            display: grid;
            place-items: center;
            text-align: center;
            padding: 78px 24px;
            border: 1px solid #e3e6de;
            border-radius: 26px;
            background: rgba(255, 254, 249, 0.92);
            box-shadow: 0 24px 70px rgba(35, 42, 32, 0.06);
          }

          .helix-projects-empty svg {
            color: #3655a5;
          }

          .helix-projects-empty h2 {
            margin: 16px 0 8px;
            font-size: 26px;
            letter-spacing: -0.6px;
          }

          .helix-projects-empty p {
            max-width: 470px;
            margin: 0 0 22px;
            color: #687066;
            line-height: 1.6;
          }

          @media (max-width: 900px) {
            .helix-projects-hero {
              grid-template-columns: 1fr;
            }

            .helix-project-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 700px) {
            .helix-projects-nav {
              padding: 0 20px;
            }

            .helix-projects-main {
              width: min(100% - 28px, 1180px);
              padding-top: 34px;
            }

            .helix-projects-hero-copy {
              padding: 24px;
            }

            .helix-projects-toolbar {
              align-items: stretch;
              flex-direction: column;
            }

            .helix-projects-stats,
            .helix-project-metrics {
              grid-template-columns: 1fr;
            }

            .helix-project-card-actions {
              align-items: stretch;
              flex-direction: column;
            }

            .helix-project-continue {
              width: 100%;
            }

            .helix-project-secondary-actions {
              width: 100%;
            }

            .helix-project-secondary-actions button {
              flex: 1;
            }
          }
        `}
      </style>

      <header className="helix-projects-nav">
        <Link
          to="/"
          className="helix-wordmark"
        >
          Helix
        </Link>

        <div className="helix-projects-nav-actions">
          <Link
            to="/explore"
            className="helix-projects-nav-link"
          >
            Research Explorer
          </Link>

          <Link
            to="/hypotheses"
            className="helix-projects-nav-link"
          >
            Hypotheses
          </Link>
        </div>
      </header>

      <main className="helix-projects-main">
        <section className="helix-projects-hero">
          <div className="helix-projects-hero-copy">
            <span className="helix-projects-eyebrow">
              <FolderKanban size={15} />

              Research library
            </span>

            <h1>
              Continue your scientific investigations.
            </h1>

            <p>
              Reopen saved research maps, continue exploring concepts,
              and keep track of evidence-backed investigations from
              one clean workspace.
            </p>
          </div>

          <aside className="helix-projects-command-panel">
            <div>
              <h2>
                Start a new question
              </h2>

              <p>
                Create a fresh Helix project and generate a new research
                map from a scientific question.
              </p>
            </div>

            <div className="helix-projects-stats">
              <div className="helix-projects-stat">
                <strong>
                  {
                    projects.length
                  }
                </strong>

                <span>
                  Projects
                </span>
              </div>

              <div className="helix-projects-stat">
                <strong>
                  {
                    totalConcepts
                  }
                </strong>

                <span>
                  Concepts
                </span>
              </div>

              <div className="helix-projects-stat">
                <strong>
                  {
                    totalRelationships
                  }
                </strong>

                <span>
                  Links
                </span>
              </div>
            </div>

            <button
              type="button"
              className="helix-projects-primary-button"
              onClick={
                startNewInvestigation
              }
            >
              <Plus size={18} />

              New investigation
            </button>
          </aside>
        </section>

        <section className="helix-projects-toolbar">
          <div className="helix-projects-search">
            <Search size={18} />

            <input
              value={
                search
              }
              onChange={
                (
                  event,
                ) =>
                  setSearch(
                    event.target.value,
                  )
              }
              placeholder="Search by question, title, or domain..."
            />
          </div>

          <span>
            {
              filteredProjects.length
            }{' '}
            shown
          </span>
        </section>

        {
          filteredProjects.length >
            0
            ? (
              <section className="helix-project-grid">
                {
                  filteredProjects.map(
                    (
                      project,
                    ) => {
                      const title =
                        getProjectTitle(
                          project,
                        )

                      const question =
                        getProjectQuestion(
                          project,
                        )

                      const conceptCount =
                        project.researchMap
                          ?.nodes
                          ?.length ??
                        0

                      const sourceCount =
                        project.researchMap
                          ?.sources
                          ?.length ??
                        0

                      const relationshipCount =
                        project.researchMap
                          ?.edges
                          ?.length ??
                        0

                      const domain =
                        project.researchMap
                          ?.domain ??
                        'Scientific research'

                      return (
                        <article
                          key={
                            project.id
                          }
                          className="helix-project-card"
                        >
                          <div className="helix-project-card-top">
                            <span className="helix-project-badge">
                              <Sparkles size={13} />

                              Investigation
                            </span>

                            <span className="helix-project-date">
                              <Calendar size={13} />

                              {
                                formatProjectDate(
                                  project.updatedAt ??
                                    project.createdAt,
                                )
                              }
                            </span>
                          </div>

                          <h3>
                            {
                              title
                            }
                          </h3>

                          <p>
                            {
                              question
                            }
                          </p>

                          <span className="helix-project-domain">
                            <Network size={15} />

                            {
                              domain
                            }
                          </span>

                          <div className="helix-project-metrics">
                            <div className="helix-project-metric">
                              <strong>
                                {
                                  conceptCount
                                }
                              </strong>

                              <span>
                                Concepts
                              </span>
                            </div>

                            <div className="helix-project-metric">
                              <strong>
                                {
                                  relationshipCount
                                }
                              </strong>

                              <span>
                                Relationships
                              </span>
                            </div>

                            <div className="helix-project-metric">
                              <strong>
                                {
                                  sourceCount
                                }
                              </strong>

                              <span>
                                Sources
                              </span>
                            </div>
                          </div>

                          <div className="helix-project-card-actions">
                            <button
                              type="button"
                              className="helix-project-continue"
                              onClick={
                                () =>
                                  openProject(
                                    project.id,
                                  )
                              }
                            >
                              Continue

                              <ArrowRight size={15} />
                            </button>

                            <div className="helix-project-secondary-actions">
                              <button
                                type="button"
                                onClick={
                                  () =>
                                    renameProject(
                                      project,
                                    )
                                }
                              >
                                Rename
                              </button>

                              <button
                                type="button"
                                className="helix-project-danger"
                                onClick={
                                  () =>
                                    deleteProject(
                                      project,
                                    )
                                }
                              >
                                <Trash2 size={13} />

                                Delete
                              </button>
                            </div>
                          </div>
                        </article>
                      )
                    },
                  )
                }
              </section>
            )
            : (
              <section className="helix-projects-empty">
                <BookOpen size={36} />

                <h2>
                  No saved investigations yet
                </h2>

                <p>
                  Start a research question and Helix will save the
                  project locally so you can return to it later.
                </p>

                <button
                  type="button"
                  onClick={
                    startNewInvestigation
                  }
                >
                  Start researching
                </button>
              </section>
            )
        }
      </main>
    </div>
  )
}

function ExploreProjectsShortcut() {
  const location =
    useLocation()

  if (
    !location.pathname.startsWith(
      '/explore',
    )
  ) {
    return null
  }

  return (
    <Link
      to="/projects"
      aria-label="Open saved projects"
      style={{
        position:
          'fixed',

        top:
          112,

        right:
          28,

        zIndex:
          9999,

        display:
          'inline-flex',

        alignItems:
          'center',

        justifyContent:
          'center',

        gap:
          9,

        minHeight:
          44,

        padding:
          '0 15px',

        border:
          '1px solid #d9ddd4',

        borderRadius:
          13,

        background:
          'rgba(255, 254, 249, 0.96)',

        color:
          '#242923',

        textDecoration:
          'none',

        fontSize:
          14,

        fontWeight:
          750,

        boxShadow:
          '0 16px 40px rgba(26, 31, 24, 0.08)',

        backdropFilter:
          'blur(14px)',
      }}
    >
      <FolderKanban size={17} />

      Projects
    </Link>
  )
}

function AppRoutes() {
  return (
    <>
      <ExploreProjectsShortcut />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/auth"
          element={<Auth />}
        />

        <Route
          path="/auth/callback"
          element={<AuthCallback />}
        />

        <Route
          path="/projects"
          element={<ProjectsPage />}
        />

        <Route
          path="/explore"
          element={<Explore />}
        />

        <Route
          path="/explore/:projectId"
          element={<Explore />}
        />

        <Route
          path="/research-map"
          element={<ResearchMapDemo />}
        />

        <Route
          path="/graph"
          element={<GraphPage />}
        />

        <Route
          path="/disease/:id"
          element={<DiseaseExplorer />}
        />

        <Route
          path="/gene/:id"
          element={<GeneExplorer />}
        />

        <Route
          path="/pathway/:id"
          element={<PathwayExplorer />}
        />

        <Route
          path="/drug/:id"
          element={<DrugExplorer />}
        />

        <Route
          path="/hypotheses"
          element={<HypothesisExplorer />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
