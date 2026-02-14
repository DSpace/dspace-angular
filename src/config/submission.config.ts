import { Config } from './config';

interface AutosaveConfig {
  metadata: string[];
  timer: number;
}

interface DuplicateDetectionConfig {
  alwaysShowSection: boolean;
}

interface TypeBindConfig {
  field: string;
}

interface IconsConfig {
  metadata: MetadataIconConfig[];
  authority: {
    confidence: ConfidenceIconConfig[];
  };
}

export interface MetadataIconConfig {
  name: string;
  style: string;
}

export interface ConfidenceIconConfig {
  value: any;
  style: string;
  icon: string;
}

export class SubmissionConfig extends Config {
  @Config.publish() autosave: AutosaveConfig;
  @Config.publish() duplicateDetection: DuplicateDetectionConfig;
  @Config.publish() typeBind: TypeBindConfig;
  @Config.publish() icons: IconsConfig;
}
