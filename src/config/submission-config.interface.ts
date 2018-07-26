import { Config } from './config.interface';
import { MetadataIconsConfig } from '../app/shared/chips/models/chips.model';

interface AutosaveConfig extends Config {
  metadata: string[],
  timer: number
}

interface MetadataConfig extends Config {
  icons: MetadataIconsConfig[]
}

export interface SubmissionConfig extends Config {
  autosave: AutosaveConfig,
  metadata: MetadataConfig
}
