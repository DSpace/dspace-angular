import { Config } from './config.interface';

interface AutosaveConfig extends Config {
  metadata: string[],
  timer: number
}

export interface SubmissionConfig extends Config {
  autosave: AutosaveConfig
}
