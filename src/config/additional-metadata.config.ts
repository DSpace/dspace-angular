import { Config } from './config.interface';

export type AdditionalMetadataConfigRenderingTypes =
  'text'
  | 'crisref'
  | 'link'
  | 'link.email'
  | 'identifier'
  | 'valuepair'
  | 'date'
  | 'authors'
  | 'currentRole'
  | 'lastRole';

export interface AdditionalMetadataConfig extends Config {
  name: string,
  rendering: AdditionalMetadataConfigRenderingTypes,
  label?: string,
  prefix?: string,
  suffix?: string,
  limitTo?: number,
  startFromLast?: boolean
}
