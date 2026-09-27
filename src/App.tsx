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
  FolderKanban,
  Plus,
  Search,
  Sparkles,
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

        if (
          !query
        ) {
          return projects
        }

        return projects.filter(
          (
            project,
          ) => {
            const title =
              project.title ??
              ''

            const question =
              project.question ??
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
      project.title ??
      project.question ??
      'this project'

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
      project.title ??
      project.question ??
      ''

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
              radial-gradient(circle at 15% 5%, rgba(94, 121, 230, 0.12), transparent 32%),
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
            width: min(1120px, calc(100% - 40px));
            margin: 0 auto;
            padding: 54px 0 80px;
          }

          .helix-projects-hero {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 24px;
            margin-bottom: 28px;
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
            margin: 14px 0 10px;
            font-size: clamp(34px, 6vw, 58px);
            line-height: 0.98;
            letter-spacing: -2.4px;
          }

          .helix-projects-hero p {
            max-width: 650px;
            margin: 0;
            color: #687066;
            font-size: 16px;
            line-height: 1.65;
          }

          .helix-projects-primary-button,
          .helix-projects-empty button {
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
          }

          .helix-projects-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            margin-bottom: 22px;
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
            min-height: 46px;
            padding: 0 14px;
            border: 1px solid #e3e6de;
            border-radius: 14px;
            background: #fffef9;
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
            gap: 16px;
            padding: 20px;
            border: 1px solid #e4e7df;
            border-radius: 18px;
            background: #fffef9;
            box-shadow: 0 18px 45px rgba(30, 35, 28, 0.06);
          }

          .helix-project-card-main {
            padding: 0;
            border: 0;
            background: transparent;
            color: inherit;
            text-align: left;
            cursor: pointer;
          }

          .helix-project-card-main:hover h3 {
            color: #294ea8;
          }

          .helix-project-card-top {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 12px;
          }

          .helix-project-badge {
            width: fit-content;
            padding: 6px 9px;
            border-radius: 999px;
            background: #edf1ff;
            color: #3655a5;
            font-size: 11px;
            font-weight: 750;
            letter-spacing: 0.4px;
            text-transform: uppercase;
          }

          .helix-project-date {
            color: #7b8279;
            font-size: 12px;
            font-weight: 650;
          }

          .helix-project-card h3 {
            margin: 0;
            color: #242923;
            font-size: 21px;
            line-height: 1.2;
            transition: color 160ms ease;
          }

          .helix-project-card p {
            margin: 9px 0 16px;
            color: #687066;
            font-size: 14px;
            line-height: 1.55;
          }

          .helix-project-metrics {
            display: flex;
            flex-wrap: wrap;
            gap: 9px;
          }

          .helix-project-metrics span {
            padding: 7px 9px;
            border: 1px solid #e8ebe4;
            border-radius: 999px;
            color: #5f675d;
            background: #fbfbf6;
            font-size: 12px;
            font-weight: 650;
          }

          .helix-project-card-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
          }

          .helix-project-card-actions button {
            min-height: 34px;
            padding: 0 10px;
            border: 1px solid #e4e7df;
            border-radius: 10px;
            background: #ffffff;
            color: #566054;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
          }

          .helix-project-card-actions button:hover {
            border-color: #cfd6ca;
            background: #f7f8f3;
          }

          .helix-project-card-actions .helix-project-danger {
            color: #a64242;
          }

          .helix-projects-empty {
            display: grid;
            place-items: center;
            text-align: center;
            padding: 70px 24px;
            border: 1px solid #e3e6de;
            border-radius: 24px;
            background: #fffef9;
          }

          .helix-projects-empty svg {
            color: #3655a5;
          }

          .helix-projects-empty h2 {
            margin: 16px 0 8px;
            font-size: 24px;
          }

          .helix-projects-empty p {
            max-width: 460px;
            margin: 0 0 22px;
            color: #687066;
            line-height: 1.6;
          }

          @media (max-width: 800px) {
            .helix-projects-nav {
              padding: 0 20px;
            }

            .helix-projects-main {
              width: min(100% - 28px, 1120px);
              padding-top: 34px;
            }

            .helix-projects-hero,
            .helix-projects-toolbar {
              align-items: stretch;
              flex-direction: column;
            }

            .helix-project-grid {
              grid-template-columns: 1fr;
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
          <div>
            <span className="helix-projects-eyebrow">
              <FolderKanban size={15} />

              Research library
            </span>

            <h1>
              Your saved investigations
            </h1>

            <p>
              Continue previous Helix projects, reopen research maps,
              and keep building evidence-backed investigations from
              this browser.
            </p>
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
              placeholder="Search saved investigations..."
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
                        project.title ??
                        project.question ??
                        'Untitled investigation'

                      const question =
                        project.question ??
                        'No question saved.'

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

                      return (
                        <article
                          key={
                            project.id
                          }
                          className="helix-project-card"
                        >
                          <button
                            type="button"
                            className="helix-project-card-main"
                            onClick={
                              () =>
                                openProject(
                                  project.id,
                                )
                            }
                          >
                            <div className="helix-project-card-top">
                              <span className="helix-project-badge">
                                Investigation
                              </span>

                              <span className="helix-project-date">
                                {
                                  formatProjectDate(
                                    project.updatedAt,
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

                            <div className="helix-project-metrics">
                              <span>
                                {
                                  conceptCount
                                }{' '}
                                concepts
                              </span>

                              <span>
                                {
                                  relationshipCount
                                }{' '}
                                relationships
                              </span>

                              <span>
                                {
                                  sourceCount
                                }{' '}
                                sources
                              </span>
                            </div>
                          </button>

                          <div className="helix-project-card-actions">
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
                              Delete
                            </button>
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
                <Sparkles size={34} />

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
