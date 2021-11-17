import { Config } from './config.interface';

export interface UrnConfig extends Config {
  name: string;
  baseUrl: string;
}

export interface CrisRefConfig extends Config {
  entityType: string;
  icon: string;
}

export interface Layout {
  orientation: string;
}

export interface ItemPageLayoutConfig extends Config {
  [entity: string]: Layout;
  default: Layout;
}


export interface LayoutConfig extends Config {
  urn: UrnConfig[];
  crisRef: CrisRefConfig[];
  itemPage: ItemPageLayoutConfig;
}

export interface SuggestionConfig extends Config {
  source: string;
  collectionId: string;
}
