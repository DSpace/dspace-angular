import { Config } from './config.interface';
import { SubmissionSectionObject } from '../app/submission/objects/submission-objects.reducer';

interface AutosaveConfig extends Config {
  metadata: string[],
  timer: number
}

interface MetadataConfig extends Config {
  icons: {
    [metadata: string]: string;
  }
}

export interface SubmissionConfig extends Config {
  autosave: AutosaveConfig,
  metadata: MetadataConfig
}
