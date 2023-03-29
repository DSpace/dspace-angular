import { Config } from './config.interface';

export type AdditionalMetadataConfigRenderingTypes = 'text' | 'link' | 'link.email' | 'identifier' | 'valuepair' | 'date' | 'authors';

export interface AdditionalMetadataConfig extends Config {
  name: string,
  rendering: AdditionalMetadataConfigRenderingTypes,
  label?: string,
  limitTo?: number
}
