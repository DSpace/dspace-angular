import { Config } from './config.interface';

export interface UrnConfig extends Config {
  name: string;
  baseUrl: string;
}

export interface CrisRefConfig extends Config {
  entityType: string;
  icon: string;
}

export interface CrisLayoutMetadataBoxConfig extends Config {
  defaultMetadataLabelColStyle: string;
  defaultMetadataValueColStyle: string;
}

export interface CrisLayoutTypeConfig {
  orientation: string;
}

export interface NavbarConfig extends Config {
  showCommunityCollection: boolean;
}

export interface CrisItemPageConfig extends Config {
  [entity: string]: CrisLayoutTypeConfig;
  default: CrisLayoutTypeConfig;
}


export interface CrisLayoutConfig extends Config {
  urn: UrnConfig[];
  crisRef: CrisRefConfig[];
  itemPage: CrisItemPageConfig;
  metadataBox: CrisLayoutMetadataBoxConfig;
}

export interface LayoutConfig extends Config {
  navbar: NavbarConfig;
}

export interface SuggestionConfig extends Config {
  source: string;
  collectionId: string;
}
