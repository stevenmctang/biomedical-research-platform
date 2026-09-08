import express from 'express'

const app = express()

const PORT =
  process.env.PORT || 3001

app.use(express.json())


function clampLimit(
  value,
  fallback = 5,
) {
  const parsed =
    Number.parseInt(
      String(value ?? ''),
      10,
    )

  if (
    Number.isNaN(parsed)
  ) {
    return fallback
  }

  return Math.min(
    Math.max(
      parsed,
      1,
    ),
    10,
  )
}


function decodeXml(
  value = '',
) {
  return value
    .replace(
      /<!\[CDATA\[([\s\S]*?)\]\]>/g,
      '$1',
    )
    .replace(
      /<[^>]+>/g,
      ' ',
    )
    .replace(
      /&amp;/g,
      '&',
    )
    .replace(
      /&lt;/g,
      '<',
    )
    .replace(
      /&gt;/g,
      '>',
    )
    .replace(
      /&quot;/g,
      '"',
    )
    .replace(
      /&#39;/g,
      "'",
    )
    .replace(
      /\s+/g,
      ' ',
    )
    .trim()
}


function getTagValue(
  xml,
  tagName,
) {
  const match =
    xml.match(
      new RegExp(
        `<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`,
        'i',
      ),
    )

  return match
    ? decodeXml(
        match[1],
      )
    : ''
}


function getAllTagValues(
  xml,
  tagName,
) {
  const regex =
    new RegExp(
      `<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`,
      'gi',
    )

  const values = []

  let match


  while (
    (
      match =
        regex.exec(
          xml,
        )
    )
  ) {
    values.push(
      decodeXml(
        match[1],
      ),
    )
  }


  return values.filter(Boolean)
}


function getPubMedAuthors(
  articleXml,
) {
  const authorBlocks =
    articleXml.match(
      /<Author(?:\s[^>]*)?>[\s\S]*?<\/Author>/gi,
    ) ?? []


  return authorBlocks
    .map(
      (
        block,
      ) => {
        const collective =
          getTagValue(
            block,
            'CollectiveName',
          )

        if (
          collective
        ) {
          return collective
        }

        const foreName =
          getTagValue(
            block,
            'ForeName',
          )

        const lastName =
          getTagValue(
            block,
            'LastName',
          )


        return [
          foreName,
          lastName,
        ]
          .filter(Boolean)
          .join(' ')
      },
    )
    .filter(Boolean)
}


function getPubMedDate(
  articleXml,
) {
  const match =
    articleXml.match(
      /<PubDate>([\s\S]*?)<\/PubDate>/i,
    )

  if (
    !match
  ) {
    return ''
  }

  const block =
    match[1]

  const year =
    getTagValue(
      block,
      'Year',
    )

  const month =
    getTagValue(
      block,
      'Month',
    )

  const day =
    getTagValue(
      block,
      'Day',
    )

  const medline =
    getTagValue(
      block,
      'MedlineDate',
    )

  if (
    medline
  ) {
    return medline
  }

  return [
    year,
    month,
    day,
  ]
    .filter(Boolean)
    .join(' ')
}


function getPubMedDoi(
  articleXml,
) {
  const match =
    articleXml.match(
      /<ArticleId\s+IdType=["']doi["']>([\s\S]*?)<\/ArticleId>/i,
    )

  if (
    match
  ) {
    return decodeXml(
      match[1],
    )
  }

  const second =
    articleXml.match(
      /<ELocationID\s+EIdType=["']doi["'][^>]*>([\s\S]*?)<\/ELocationID>/i,
    )

  return second
    ? decodeXml(
        second[1],
      )
    : undefined
}


function parsePubMedArticles(
  xml,
) {
  const blocks =
    xml.match(
      /<PubmedArticle>[\s\S]*?<\/PubmedArticle>/gi,
    ) ?? []


  return blocks
    .map(
      (
        block,
      ) => {
        const pmid =
          getTagValue(
            block,
            'PMID',
          )

        const title =
          getTagValue(
            block,
            'ArticleTitle',
          )

        const journal =
          getTagValue(
            block,
            'Title',
          )

        const publicationDate =
          getPubMedDate(
            block,
          )

        const authors =
          getPubMedAuthors(
            block,
          )

        const doi =
          getPubMedDoi(
            block,
          )

        const abstractParts =
          getAllTagValues(
            block,
            'AbstractText',
          )


        return {
          pmid,
          title,
          authors,
          journal,
          publicationDate,
          doi,

          abstract:
            abstractParts.length
              ? abstractParts.join(' ')
              : undefined,

          url:
            `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
        }
      },
    )
    .filter(
      (
        paper,
      ) =>
        paper.pmid &&
        paper.title,
    )
}


async function searchPubMed(
  query,
  limit,
) {
  const searchParams =
    new URLSearchParams({
      db:
        'pubmed',

      term:
        query,

      retmode:
        'json',

      retmax:
        String(
          limit,
        ),
    })


  const searchResponse =
    await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?${searchParams.toString()}`,
    )

  if (
    !searchResponse.ok
  ) {
    throw new Error(
      `PubMed search failed: ${searchResponse.status}`,
    )
  }


  const searchData =
    await searchResponse.json()

  const ids =
    searchData
      ?.esearchresult
      ?.idlist ?? []

  const total =
    Number.parseInt(
      searchData
        ?.esearchresult
        ?.count ?? '0',
      10,
    ) || 0


  if (
    ids.length === 0
  ) {
    return {
      query,
      total,
      papers: [],
    }
  }


  const fetchParams =
    new URLSearchParams({
      db:
        'pubmed',

      id:
        ids.join(','),

      retmode:
        'xml',
    })


  const fetchResponse =
    await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?${fetchParams.toString()}`,
    )

  if (
    !fetchResponse.ok
  ) {
    throw new Error(
      `PubMed fetch failed: ${fetchResponse.status}`,
    )
  }


  const xml =
    await fetchResponse.text()


  return {
    query,
    total,

    papers:
      parsePubMedArticles(
        xml,
      ),
  }
}


function reconstructOpenAlexAbstract(
  invertedIndex,
) {
  if (
    !invertedIndex ||
    typeof invertedIndex !==
      'object'
  ) {
    return undefined
  }


  const words = []


  for (
    const [
      word,
      positions,
    ]
    of Object.entries(
      invertedIndex,
    )
  ) {
    if (
      !Array.isArray(
        positions,
      )
    ) {
      continue
    }


    for (
      const position
      of positions
    ) {
      if (
        typeof position ===
        'number'
      ) {
        words.push({
          word,
          position,
        })
      }
    }
  }


  words.sort(
    (
      first,
      second,
    ) =>
      first.position -
      second.position,
  )


  const abstract =
    words
      .map(
        (
          item,
        ) =>
          item.word,
      )
      .join(' ')
      .trim()


  return abstract ||
    undefined
}


function mapOpenAlexWork(
  work,
) {
  const authors =
    Array.isArray(
      work.authorships,
    )
      ? work.authorships
          .map(
            (
              authorship,
            ) =>
              authorship
                ?.author
                ?.display_name,
          )
          .filter(Boolean)
      : []


  const doi =
    typeof work.doi ===
      'string'
      ? work.doi.replace(
          'https://doi.org/',
          '',
        )
      : undefined


  const source =
    work
      ?.primary_location
      ?.source
      ?.display_name ??
    work
      ?.best_oa_location
      ?.source
      ?.display_name ??
    ''


  const url =
    work
      ?.primary_location
      ?.landing_page_url ??
    work
      ?.best_oa_location
      ?.landing_page_url ??
    work.doi ??
    work.id


  return {
    id:
      String(
        work.id ?? '',
      )
        .replace(
          'https://openalex.org/',
          '',
        ),

    title:
      work.display_name ??
      work.title ??
      'Untitled work',

    authors,

    publicationYear:
      work.publication_year,

    publicationDate:
      work.publication_date ?? '',

    source,

    doi,

    abstract:
      reconstructOpenAlexAbstract(
        work.abstract_inverted_index,
      ),

    citedByCount:
      work.cited_by_count ?? 0,

    isOpenAccess:
      Boolean(
        work
          ?.open_access
          ?.is_oa,
      ),

    openAccessStatus:
      work
        ?.open_access
        ?.oa_status,

    topic:
      work
        ?.primary_topic
        ?.display_name,

    url,
  }
}


async function searchOpenAlex(
  query,
  limit,
) {
  const params =
    new URLSearchParams({
      search:
        query,

      'per-page':
        String(
          limit,
        ),
    })


  const response =
    await fetch(
      `https://api.openalex.org/works?${params.toString()}`,
      {
        headers: {
          Accept:
            'application/json',
        },
      },
    )


  if (
    !response.ok
  ) {
    throw new Error(
      `OpenAlex search failed: ${response.status}`,
    )
  }


  const data =
    await response.json()

  const papers =
    Array.isArray(
      data.results,
    )
      ? data.results.map(
          mapOpenAlexWork,
        )
      : []


  return {
    query,

    total:
      data
        ?.meta
        ?.count ??
      papers.length,

    papers,
  }
}


app.get(
  '/',
  (
    _request,
    response,
  ) => {
    response.json({
      name:
        'Helix API',

      status:
        'running',

      routes: [
        '/api/pubmed/search',
        '/api/openalex/search',
      ],
    })
  },
)


app.get(
  '/api/pubmed/search',
  async (
    request,
    response,
  ) => {
    const query =
      String(
        request.query.q ?? '',
      ).trim()

    const limit =
      clampLimit(
        request.query.limit,
      )


    if (
      !query
    ) {
      return response
        .status(400)
        .json({
          error:
            'A PubMed search query is required.',
        })
    }


    try {
      const result =
        await searchPubMed(
          query,
          limit,
        )

      return response.json(
        result,
      )
    } catch (
      error
    ) {
      console.error(
        'PubMed error:',
        error,
      )

      return response
        .status(500)
        .json({
          error:
            error instanceof
              Error
              ? error.message
              : 'PubMed search failed.',
        })
    }
  },
)


app.get(
  '/api/openalex/search',
  async (
    request,
    response,
  ) => {
    const query =
      String(
        request.query.q ?? '',
      ).trim()

    const limit =
      clampLimit(
        request.query.limit,
      )


    if (
      !query
    ) {
      return response
        .status(400)
        .json({
          error:
            'An OpenAlex search query is required.',
        })
    }


    try {
      const result =
        await searchOpenAlex(
          query,
          limit,
        )

      return response.json(
        result,
      )
    } catch (
      error
    ) {
      console.error(
        'OpenAlex error:',
        error,
      )

      return response
        .status(500)
        .json({
          error:
            error instanceof
              Error
              ? error.message
              : 'OpenAlex search failed.',
        })
    }
  },
)


app.listen(
  PORT,
  () => {
    console.log(
      `Helix API running at http://localhost:${PORT}`,
    )
  },
)
