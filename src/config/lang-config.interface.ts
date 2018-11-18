import { Config } from './config.interface';

export interface LangConfig extends Config {
      code: string;
      label: string;
      active: boolean;
}
