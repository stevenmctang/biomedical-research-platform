import {
    Calendar,
    ClipboardCheck,
    Database,
    MoreVertical,
    Network,
    Pencil,
    Trash2,
  } from 'lucide-react'
  
  import type {
    ResearchProjectSummary,
  } from '../types/researchProject'
  
  import './ProjectCard.css'
  
  interface ProjectCardProps {
    project:
      ResearchProjectSummary
  
    onOpen:
      () => void
  
    onRename:
      () => void
  
    onDelete:
      () => void
  }
  
  function formatDate(
    value:
      string,
  ) {
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
  
  export function ProjectCard({
    project,
    onOpen,
    onRename,
    onDelete,
  }: ProjectCardProps) {
    return (
      <article className="helix-project-card">
        <button
          type="button"
          className="helix-project-card-main"
          onClick={
            onOpen
          }
        >
          <div className="helix-project-card-top">
            <span className="helix-project-badge">
              Investigation
            </span>
  
            <span className="helix-project-date">
              <Calendar size={14} />
  
              {
                formatDate(
                  project.updatedAt,
                )
              }
            </span>
          </div>
  
          <h3>
            {
              project.title
            }
          </h3>
  
          <p>
            {
              project.question
            }
          </p>
  
          <div className="helix-project-metrics">
            <span>
              <Network size={14} />
  
              {
                project.conceptCount
              }{' '}
              concepts
            </span>
  
            <span>
              <Database size={14} />
  
              {
                project.sourceCount
              }{' '}
              sources
            </span>
  
            <span>
              <ClipboardCheck size={14} />
  
              {
                project.trialCount
              }{' '}
              trials
            </span>
          </div>
        </button>
  
        <div className="helix-project-card-actions">
          <span>
            <MoreVertical size={16} />
          </span>
  
          <button
            type="button"
            onClick={
              onRename
            }
          >
            <Pencil size={14} />
  
            Rename
          </button>
  
          <button
            type="button"
            className="helix-project-danger"
            onClick={
              onDelete
            }
          >
            <Trash2 size={14} />
  
            Delete
          </button>
        </div>
      </article>
    )
  }
  