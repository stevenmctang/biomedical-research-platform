const MAX_RESULTS_PER_SOURCE = 8

function cleanQuery(value) {
  return String(value || '')
    .replace(/\?/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function getYearFromDateParts(dateParts) {
  if (!Array.isArray(dateParts)) {
    return null
  }

  const firstDate = dateParts[0]

  if (!Array.isArray(firstDate)) {
    return null
  }

  return firstDate[0] ? String(firstDate[0]) : null
}

function decodeOpenAlexAbstract(invertedIndex) {
  if (!invertedIndex || typeof invertedIndex !== 'object') {
    return ''
  }

  const words = []

  Object.entries(invertedIndex).forEach(([word, positions]) => {
    if (Array.isArray(positions)) {
      positions.forEach((position) => {
        words[position] = word
      })
    }
  })

  return words.filter(Boolean).join(' ')
}

function normalizeUrl(value) {
  if (!value) {
    return ''
  }

  return String(value)
}

function dedupeArticles(articles) {
  const seen = new Set()
  const unique = []

  articles.forEach((article) => {
    const titleKey = String(article.title || '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')

    const doiKey = String(article.doi || '')
      .toLowerCase()
      .replace(/^https:\/\/doi\.org\//, '')

    const key = doiKey || titleKey

    if (!key || seen.has(key)) {
      return
    }

    seen.add(key)
    unique.push(article)
  })

  return unique
}

function rankArticles(articles) {
  return [...articles].sort((a, b) => {
    const aScore =
      Number(a.citationCount || 0) +
      (a.abstract ? 20 : 0) +
      (a.doi ? 10 : 0) +
      (a.url ? 5 : 0)

    const bScore =
      Number(b.citationCount || 0) +
      (b.abstract ? 20 : 0) +
      (b.doi ? 10 : 0) +
      (b.url ? 5 : 0)

    return bScore - aScore
  })
}

async function searchSemanticScholar(query) {
  const fields = [
    'title',
    'abstract',
    'year',
    'venue',
    'authors',
    'url',
    'citationCount',
    'externalIds',
    'publicationTypes',
    'openAccessPdf',
  ].join(',')

  const url =
    `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
      query,
    )}&limit=${MAX_RESULTS_PER_SOURCE}&fields=${fields}`

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Semantic Scholar returned ${response.status}`)
  }

  const data = await response.json()

  return (data.data || [])
    .filter((paper) => paper.title)
    .map((paper) => {
      const doi = paper.externalIds?.DOI || ''
      const pubmedId = paper.externalIds?.PubMed || ''

      return {
        id: `semantic-${paper.paperId}`,
        title: paper.title,
        source: paper.venue || 'Semantic Scholar',
        year: paper.year ? String(paper.year) : 'Unknown year',
        abstract: paper.abstract || '',
        authors: Array.isArray(paper.authors)
          ? paper.authors
              .slice(0, 6)
              .map((author) => author.name)
              .filter(Boolean)
          : [],
        url:
          normalizeUrl(paper.url) ||
          (doi ? `https://doi.org/${doi}` : ''),
        doi,
        pubmedId,
        citationCount: paper.citationCount || 0,
        provider: 'Semantic Scholar',
        type:
          Array.isArray(paper.publicationTypes) &&
          paper.publicationTypes.length > 0
            ? paper.publicationTypes.join(', ')
            : 'Research paper',
        openAccessPdf: paper.openAccessPdf?.url || '',
      }
    })
}

async function searchOpenAlex(query) {
  const select = [
    'id',
    'display_name',
    'publication_year',
    'doi',
    'cited_by_count',
    'authorships',
    'primary_location',
    'abstract_inverted_index',
    'type',
  ].join(',')

  const url =
    `https://api.openalex.org/works?search=${encodeURIComponent(
      query,
    )}&per-page=${MAX_RESULTS_PER_SOURCE}&select=${select}`

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`OpenAlex returned ${response.status}`)
  }

  const data = await response.json()

  return (data.results || [])
    .filter((work) => work.display_name)
    .map((work) => {
      const doi = work.doi
        ? String(work.doi).replace('https://doi.org/', '')
        : ''

      const sourceName =
        work.primary_location?.source?.display_name ||
        'OpenAlex'

      const articleUrl =
        work.primary_location?.landing_page_url ||
        work.primary_location?.pdf_url ||
        work.doi ||
        work.id

      const authors = Array.isArray(work.authorships)
        ? work.authorships
            .slice(0, 6)
            .map((item) => item.author?.display_name)
            .filter(Boolean)
        : []

      return {
        id: `openalex-${String(work.id || work.display_name).replace(
          /[^a-zA-Z0-9]/g,
          '-',
        )}`,
        title: work.display_name,
        source: sourceName,
        year: work.publication_year
          ? String(work.publication_year)
          : 'Unknown year',
        abstract: decodeOpenAlexAbstract(work.abstract_inverted_index),
        authors,
        url: normalizeUrl(articleUrl),
        doi,
        pubmedId: '',
        citationCount: work.cited_by_count || 0,
        provider: 'OpenAlex',
        type: work.type || 'Scholarly work',
        openAccessPdf:
          work.primary_location?.pdf_url || '',
      }
    })
}

async function searchCrossref(query) {
  const url =
    `https://api.crossref.org/works?query=${encodeURIComponent(
      query,
    )}&rows=${MAX_RESULTS_PER_SOURCE}`

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'HelixResearchExplorer/1.0 (mailto:demo@example.com)',
    },
  })

  if (!response.ok) {
    throw new Error(`Crossref returned ${response.status}`)
  }

  const data = await response.json()
  const items = data.message?.items || []

  return items
    .filter((item) => Array.isArray(item.title) && item.title[0])
    .map((item) => {
      const authors = Array.isArray(item.author)
        ? item.author
            .slice(0, 6)
            .map((author) =>
              [author.given, author.family].filter(Boolean).join(' '),
            )
            .filter(Boolean)
        : []

      const source =
        Array.isArray(item['container-title']) &&
        item['container-title'][0]
          ? item['container-title'][0]
          : item.publisher || 'Crossref'

      return {
        id: `crossref-${item.DOI || item.URL || item.title[0]}`,
        title: item.title[0],
        source,
        year:
          getYearFromDateParts(item['published-print']?.['date-parts']) ||
          getYearFromDateParts(item['published-online']?.['date-parts']) ||
          getYearFromDateParts(item.published?.['date-parts']) ||
          'Unknown year',
        abstract: item.abstract || '',
        authors,
        url:
          item.URL ||
          (item.DOI ? `https://doi.org/${item.DOI}` : ''),
        doi: item.DOI || '',
        pubmedId: '',
        citationCount: item['is-referenced-by-count'] || 0,
        provider: 'Crossref',
        type: item.type || 'Scholarly metadata',
        openAccessPdf: '',
      }
    })
}

export async function searchEvidence(query) {
  const cleanedQuery = cleanQuery(query)

  if (!cleanedQuery) {
    return {
      query: '',
      articles: [],
      errors: ['Missing search query.'],
    }
  }

  const searches = await Promise.allSettled([
    searchSemanticScholar(cleanedQuery),
    searchOpenAlex(cleanedQuery),
    searchCrossref(cleanedQuery),
  ])

  const articles = []
  const errors = []

  searches.forEach((result) => {
    if (result.status === 'fulfilled') {
      articles.push(...result.value)
    } else {
      errors.push(result.reason?.message || 'A source failed.')
    }
  })

  const uniqueArticles = dedupeArticles(articles)
  const rankedArticles = rankArticles(uniqueArticles).slice(0, 15)

  return {
    query: cleanedQuery,
    articles: rankedArticles,
    errors,
  }
}
