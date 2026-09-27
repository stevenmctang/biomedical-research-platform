import type {
    ResearchMap,
  } from '../types/researchMap'
  
  import type {
    ResearchProject,
    ResearchProjectSummary,
  } from '../types/researchProject'
  
  const PROJECTS_KEY =
    'helix.researchProjects.v1'
  
  const ACTIVE_PROJECT_ID_KEY =
    'helix.activeProjectId.v1'
  
  function canUseStorage() {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    )
  }
  
  function makeProjectId() {
    if (
      typeof crypto !== 'undefined' &&
      'randomUUID' in crypto
    ) {
      return crypto.randomUUID()
    }
  
    return `project-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`
  }
  
  function makeProjectTitle(
    question:
      string,
  ) {
    const cleaned =
      question.trim()
  
    if (
      cleaned.length <=
      70
    ) {
      return cleaned
    }
  
    return `${cleaned.slice(
      0,
      67,
    )}...`
  }
  
  function readProjects() {
    if (
      !canUseStorage()
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
        ) as ResearchProject[]
  
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
        ) =>
          project &&
          project.version ===
            1 &&
          typeof project.id ===
            'string' &&
          Boolean(
            project.researchMap,
          ),
      )
    } catch {
      return []
    }
  }
  
  function writeProjects(
    projects:
      ResearchProject[],
  ) {
    if (
      !canUseStorage()
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
  
  function summarizeProject(
    project:
      ResearchProject,
  ): ResearchProjectSummary {
    const trialCount =
      project.researchMap.nodes.filter(
        (
          node,
        ) =>
          String(
            node.type,
          ) ===
          'clinical-trial',
      ).length
  
    return {
      id:
        project.id,
  
      title:
        project.title,
  
      question:
        project.question,
  
      conceptCount:
        project.researchMap.nodes.length,
  
      relationshipCount:
        project.researchMap.edges.length,
  
      sourceCount:
        project.researchMap.sources.length,
  
      trialCount,
  
      createdAt:
        project.createdAt,
  
      updatedAt:
        project.updatedAt,
    }
  }
  
  export function getResearchProjects() {
    return readProjects().sort(
      (
        a,
        b,
      ) =>
        new Date(
          b.updatedAt,
        ).getTime() -
        new Date(
          a.updatedAt,
        ).getTime(),
    )
  }
  
  export function getResearchProjectSummaries() {
    return getResearchProjects().map(
      summarizeProject,
    )
  }
  
  export function getResearchProject(
    projectId:
      string,
  ) {
    return (
      readProjects().find(
        (
          project,
        ) =>
          project.id ===
          projectId,
      ) ??
      null
    )
  }
  
  export function getActiveProjectId() {
    if (
      !canUseStorage()
    ) {
      return null
    }
  
    return window.localStorage.getItem(
      ACTIVE_PROJECT_ID_KEY,
    )
  }
  
  export function setActiveProjectId(
    projectId:
      string,
  ) {
    if (
      !canUseStorage()
    ) {
      return
    }
  
    window.localStorage.setItem(
      ACTIVE_PROJECT_ID_KEY,
      projectId,
    )
  }
  
  export function clearActiveProjectId() {
    if (
      !canUseStorage()
    ) {
      return
    }
  
    window.localStorage.removeItem(
      ACTIVE_PROJECT_ID_KEY,
    )
  }
  
  export function createResearchProject({
    map,
    expandedNodeIds =
      [],
    title,
  }: {
    map:
      ResearchMap
  
    expandedNodeIds?:
      string[]
  
    title?:
      string
  }) {
    const now =
      new Date().toISOString()
  
    const project:
      ResearchProject = {
        version:
          1,
  
        id:
          makeProjectId(),
  
        title:
          title ??
          makeProjectTitle(
            map.question,
          ),
  
        question:
          map.question,
  
        researchMap:
          map,
  
        expandedNodeIds,
  
        createdAt:
          now,
  
        updatedAt:
          now,
      }
  
    const projects =
      readProjects()
  
    writeProjects([
      project,
      ...projects,
    ])
  
    setActiveProjectId(
      project.id,
    )
  
    return project
  }
  
  export function saveResearchProject({
    projectId,
    map,
    expandedNodeIds,
  }: {
    projectId:
      string
  
    map:
      ResearchMap
  
    expandedNodeIds:
      string[]
  }) {
    const projects =
      readProjects()
  
    const existing =
      projects.find(
        (
          project,
        ) =>
          project.id ===
          projectId,
      )
  
    if (
      !existing
    ) {
      return null
    }
  
    const updated:
      ResearchProject = {
        ...existing,
  
        question:
          map.question,
  
        researchMap:
          map,
  
        expandedNodeIds,
  
        updatedAt:
          new Date().toISOString(),
      }
  
    writeProjects(
      projects.map(
        (
          project,
        ) =>
          project.id ===
          projectId
            ? updated
            : project,
      ),
    )
  
    return updated
  }
  
  export function renameResearchProject(
    projectId:
      string,
  
    title:
      string,
  ) {
    const cleaned =
      title.trim()
  
    if (
      !cleaned
    ) {
      return null
    }
  
    const projects =
      readProjects()
  
    const existing =
      projects.find(
        (
          project,
        ) =>
          project.id ===
          projectId,
      )
  
    if (
      !existing
    ) {
      return null
    }
  
    const updated:
      ResearchProject = {
        ...existing,
  
        title:
          cleaned,
  
        updatedAt:
          new Date().toISOString(),
      }
  
    writeProjects(
      projects.map(
        (
          project,
        ) =>
          project.id ===
          projectId
            ? updated
            : project,
      ),
    )
  
    return updated
  }
  
  export function deleteResearchProject(
    projectId:
      string,
  ) {
    const projects =
      readProjects()
  
    writeProjects(
      projects.filter(
        (
          project,
        ) =>
          project.id !==
          projectId,
      ),
    )
  
    if (
      getActiveProjectId() ===
      projectId
    ) {
      clearActiveProjectId()
    }
  }
  