import { Config } from './config.interface';
import { DuplicateMatchMetadataDetailConfig } from '../app/submission/sections/detect-duplicate/models/duplicate-detail-metadata.model';

interface AutosaveConfig extends Config {
  metadata: string[];
  timer: number;
}

interface TypeBindConfig extends Config {
  field: string;
}

interface IconsConfig extends Config {
  metadata: MetadataIconConfig[];
  authority: {
    confidence: ConfidenceIconConfig[];
  };
}

export interface MetadataIconConfig extends Config {
  name: string;
  style: string;
}

export interface ConfidenceIconConfig extends Config {
  value: any;
  style: string;
}

interface DetectDuplicateConfig extends Config {
  metadataDetailsList: DuplicateMatchMetadataDetailConfig[];
}

export interface SubmissionConfig extends Config {
  autosave: AutosaveConfig;
  typeBind: TypeBindConfig;
  icons: IconsConfig;
  detectDuplicate: DetectDuplicateConfig;
}
