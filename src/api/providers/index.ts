import type { BiomedicalDataProvider } from './types'
import type { DataProviderType } from '../../types/biomedical'
import { biolinkProvider, isBiolinkConfigured } from './biolinkProvider'
import { mockProvider } from './mockProvider'

export type { BiomedicalDataProvider } from './types'

export function createDataProvider(
  type: DataProviderType = 'biolink',
): BiomedicalDataProvider {
  if (type === 'mock' || !isBiolinkConfigured) return mockProvider
  return biolinkProvider
}

export const defaultProvider = createDataProvider('biolink')
