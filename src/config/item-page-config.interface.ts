import { Config } from './config.interface';

export interface ItemPageConfig extends Config {
  edit: {
    undoTimeout: number;
  };
}
