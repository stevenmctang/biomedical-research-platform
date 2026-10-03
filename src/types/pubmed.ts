export interface PubMedPaper {
  pmid: string

  title: string

  authors: string[]

  journal: string

  publicationDate: string

  doi?: string

  abstract?: string

  url: string
}


export interface PubMedSearchResponse {
  query: string

  total: number

  papers: PubMedPaper[]
}
