import { Config } from './config.interface';

export interface AuthorityRefEntityStyleConfig extends Config {
  icon: string;
  style: string;
}

export interface AuthorityRefConfig extends Config {
  entityType: string;
  entityStyle: {
    default: AuthorityRefEntityStyleConfig;
    [entity: string]: AuthorityRefEntityStyleConfig;
  };
}


export interface LayoutConfig extends Config {
  authorityRef: AuthorityRefConfig[];
}
