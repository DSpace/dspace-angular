import { Config } from './config.interface';
import { BrowseByType } from '../app/+browse-by/+browse-by-switcher/browse-by-decorator';

export interface  BrowseByTypeConfig extends Config {
  metadata: string;
  type: BrowseByType;
  metadataField: string;
}
