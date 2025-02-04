import { DuplicateMatchMetadataDetailConfig } from '../app/submission/sections/detect-duplicate/models/duplicate-detail-metadata.model';
import { Config } from './config.interface';

interface AutosaveConfig extends Config {
  metadata: string[];
  timer: number;
}

interface DuplicateDetectionConfig extends Config {
  alwaysShowSection: boolean;
}

interface TypeBindConfig extends Config {
  field: string;
}

export interface AuthorithyIcon {
  source: string,
  path: string
}

interface IconsConfig extends Config {
  metadata: MetadataIconConfig[];
  authority: {
    confidence: ConfidenceIconConfig[];
    sourceIcons?: AuthorithyIcon[]
  };
  iconsVisibleWithNoAuthority?: string[]
}

export interface MetadataIconConfig extends Config {
  name: string;
  style: string;
}

export interface ConfidenceIconConfig extends Config {
  value: any;
  style: string;
  icon: string;
}

interface DetectDuplicateConfig extends Config {
  metadataDetailsList: DuplicateMatchMetadataDetailConfig[];
}

export interface SubmissionDropdownHintEnabled {
  [key: string]: boolean

}

export interface SubmissionConfig extends Config {
  autosave: AutosaveConfig;
  duplicateDetection: DuplicateDetectionConfig;
  typeBind: TypeBindConfig;
  icons: IconsConfig;
  detectDuplicate: DetectDuplicateConfig;
  dropdownHintEnabled?: SubmissionDropdownHintEnabled;
  minChars?: number;
}
