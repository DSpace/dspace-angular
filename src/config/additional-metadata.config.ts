import { Config } from './config.interface';

export type AdditionalMetadataConfigRenderingTypes = 'text' | 'link' | 'link.email' | 'identifier' | 'valuepair';

export interface AdditionalMetadataConfig extends Config {
  name: string,
  rendering: AdditionalMetadataConfigRenderingTypes,
  label?: string,
}
