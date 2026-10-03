import {
    useState,
  } from 'react'
  
  import type {
    FormEvent,
  } from 'react'
  
  import {
    ArrowLeft,
    ArrowRight,
    Search,
    Sparkles,
  } from 'lucide-react'
  
  import {
    Link,
  } from 'react-router-dom'
  
  import {
    ResearchMap,
  } from '../components/ResearchMap'
  
  
  export function ResearchMapDemo() {
    const [
      input,
      setInput,
    ] =
      useState(
        'What evidence connects SOD1 to ALS?',
      )
  
  
    const [
      question,
      setQuestion,
    ] =
      useState(
        'What evidence connects SOD1 to ALS?',
      )
  
  
    function handleSubmit(
      event:
        FormEvent<HTMLFormElement>,
    ) {
      event.preventDefault()
  
      const cleaned =
        input.trim()
  
      if (!cleaned) {
        return
      }
  
      setQuestion(
        cleaned,
      )
    }
  
  
    function useExample(
      value: string,
    ) {
      setInput(value)
      setQuestion(value)
    }
  
  
    return (
      <div className="explorer-page">
  
        <header className="explorer-nav">
  
          <div className="explorer-nav-inner">
  
            <Link
              to="/"
              className="brand"
            >
              Helix
            </Link>
  
  
            <div className="explorer-nav-label">
              Research Map
            </div>
  
  
            <Link
              to="/explore"
              className="explorer-back-link"
            >
  
              <ArrowLeft size={14} />
  
              Explorer
  
            </Link>
  
          </div>
  
        </header>
  
  
        <main
          className="explorer-main"
          style={{
            maxWidth:
              '1280px',
          }}
        >
  
          <section
            style={{
              padding:
                '70px 0 34px',
            }}
          >
  
            <p className="eyebrow">
              INTERACTIVE RESEARCH
            </p>
  
  
            <h1
              style={{
                maxWidth:
                  '820px',
                margin:
                  '12px 0 0',
                fontFamily:
                  "'Manrope', sans-serif",
                fontSize:
                  'clamp(44px, 6vw, 76px)',
                fontWeight:
                  500,
                lineHeight:
                  1,
                letterSpacing:
                  '-0.055em',
              }}
            >
              Turn a question into a
              biomedical research map.
            </h1>
  
  
            <p
              style={{
                maxWidth:
                  '620px',
                margin:
                  '24px 0 0',
                color:
                  'var(--muted)',
                fontSize:
                  '13px',
                lineHeight:
                  1.8,
              }}
            >
              Explore relationships
              between diseases,
              genes, pathways,
              therapeutics, and
              evidence instead of
              reading a static answer.
            </p>
  
  
            <form
              onSubmit={
                handleSubmit
              }
              className="research-search-form"
              style={{
                marginTop:
                  '34px',
              }}
            >
  
              <Search size={20} />
  
  
              <input
                value={input}
                onChange={
                  (event) =>
                    setInput(
                      event.target.value,
                    )
                }
                placeholder="Ask a biomedical research question..."
              />
  
  
              <button type="submit">
  
                Build map
  
                <ArrowRight size={16} />
  
              </button>
  
            </form>
  
  
            <div className="search-examples">
  
              <span>
                Try:
              </span>
  
  
              <button
                type="button"
                onClick={
                  () =>
                    useExample(
                      'What evidence connects SOD1 to ALS?',
                    )
                }
              >
                SOD1 + ALS
              </button>
  
  
              <button
                type="button"
                onClick={
                  () =>
                    useExample(
                      'What pathways are involved in ALS?',
                    )
                }
              >
                ALS pathways
              </button>
  
  
              <button
                type="button"
                onClick={
                  () =>
                    useExample(
                      'What is known about C9ORF72 in ALS?',
                    )
                }
              >
                C9ORF72 + ALS
              </button>
  
            </div>
  
          </section>
  
  
          <section
            style={{
              paddingBottom:
                '90px',
            }}
          >
  
            <div
              style={{
                display:
                  'flex',
                alignItems:
                  'center',
                justifyContent:
                  'space-between',
                gap:
                  '20px',
                marginBottom:
                  '17px',
              }}
            >
  
              <div>
  
                <p className="eyebrow">
                  RESEARCH MAP
                </p>
  
                <h2
                  style={{
                    margin:
                      '8px 0 0',
                    fontFamily:
                      "'Manrope', sans-serif",
                    fontSize:
                      '25px',
                    fontWeight:
                      550,
                    letterSpacing:
                      '-0.035em',
                  }}
                >
                  Explore the network.
                </h2>
  
              </div>
  
  
              <div
                style={{
                  display:
                    'flex',
                  alignItems:
                    'center',
                  gap:
                    '7px',
                  color:
                    'var(--accent)',
                  fontSize:
                    '9px',
                  fontWeight:
                    650,
                }}
              >
  
                <Sparkles size={14} />
  
                Click any node
  
              </div>
  
            </div>
  
  
            <ResearchMap
              question={
                question
              }
            />
  
          </section>
  
        </main>
  
      </div>
    )
  }
  