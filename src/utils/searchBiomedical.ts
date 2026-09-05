import {
    diseases,
    drugs,
    genes,
    pathways,
  } from '../data/biomedicalData'
  
  import type { SearchResult } from '../types/biomedical'
  
  export function searchBiomedical(query: string): SearchResult[] {
    const normalizedQuery = query
      .trim()
      .toLowerCase()
  
    if (!normalizedQuery) {
      return []
    }
  
    const results: SearchResult[] = []
  
    diseases.forEach((disease) => {
      const searchableText = [
        disease.name,
        disease.abbreviation ?? '',
        disease.description,
      ]
        .join(' ')
        .toLowerCase()
  
      if (searchableText.includes(normalizedQuery)) {
        results.push({
          id: disease.id,
          type: 'disease',
          title: disease.name,
          subtitle: disease.abbreviation
            ? `Disease · ${disease.abbreviation}`
            : 'Disease',
          description: disease.description,
        })
      }
    })
  
    genes.forEach((gene) => {
      const searchableText = [
        gene.symbol,
        gene.name,
        gene.description,
      ]
        .join(' ')
        .toLowerCase()
  
      if (searchableText.includes(normalizedQuery)) {
        results.push({
          id: gene.id,
          type: 'gene',
          title: gene.symbol,
          subtitle: gene.name,
          description: gene.description,
        })
      }
    })
  
    drugs.forEach((drug) => {
      const searchableText = [
        drug.name,
        drug.description,
        drug.developmentStatus,
      ]
        .join(' ')
        .toLowerCase()
  
      if (searchableText.includes(normalizedQuery)) {
        results.push({
          id: drug.id,
          type: 'drug',
          title: drug.name,
          subtitle: `Drug · ${drug.developmentStatus}`,
          description: drug.description,
        })
      }
    })
  
    pathways.forEach((pathway) => {
      const searchableText = [
        pathway.name,
        pathway.description,
      ]
        .join(' ')
        .toLowerCase()
  
      if (searchableText.includes(normalizedQuery)) {
        results.push({
          id: pathway.id,
          type: 'pathway',
          title: pathway.name,
          subtitle: 'Biological Pathway',
          description: pathway.description,
        })
      }
    })
  
    return results
  }
  