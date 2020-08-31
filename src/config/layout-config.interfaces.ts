import { Config } from './config.interface';

export interface UrnConfig extends Config {
  name: string;
  baseUrl: string;
}

export interface CrisRefConfig extends Config {
  entityType: string;
  icon: string;
}

export interface LayoutConfig extends Config {
  urn: UrnConfig[];
  crisRef: CrisRefConfig[];
}
