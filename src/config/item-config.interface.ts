import { Config } from './config.interface';

export interface ItemConfig extends Config {
  edit: {
    undoTimeout: number;
  };
  // This is used to show the access status label of items in results lists
  showAccessStatuses: boolean;
}
