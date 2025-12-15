import { Config } from './config.interface';

export interface CrisRefEntityStyleConfig extends Config {
  icon: string;
  style: string;
}

export interface CrisRefConfig extends Config {
  entityType: string;
  entityStyle: {
    default: CrisRefEntityStyleConfig;
    [entity: string]: CrisRefEntityStyleConfig;
  };
}

export interface CrisRefStyleMetadata extends Config {
  [metadata: string]: string;
  default: string;
}

export interface CrisLayoutConfig extends Config {
  crisRef: CrisRefConfig[];
  crisRefStyleMetadata: CrisRefStyleMetadata;
}
