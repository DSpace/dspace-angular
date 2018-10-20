import { Config } from './config.interface';

export interface LangConfig extends Config {
  default: string;
  active: string[];
  activeLabels: string[];
  inactive: string[];
  inactiveLabels: string[];
}
