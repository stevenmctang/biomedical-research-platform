import type {
    PubMedSearchResponse,
  } from '../types/pubmed'
  
  export async function searchPubMed(
    query: string,
    limit = 6,
  ): Promise<PubMedSearchResponse> {
    const cleanedQuery =
      query.trim()
  
    if (!cleanedQuery) {
      return {
        query: '',
        total: 0,
        papers: [],
      }
    }
  
    const parameters =
      new URLSearchParams({
        q: cleanedQuery,
        limit: String(limit),
      })
  
    const response =
      await fetch(
        `/api/pubmed/search?${parameters.toString()}`,
      )
  
    if (!response.ok) {
      const data =
        await response
          .json()
          .catch(() => null)
  
      throw new Error(
        data?.error ??
          'PubMed search failed.',
      )
    }
  
    return response.json()
  }
  