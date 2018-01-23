import { PageInfo } from '../shared/page-info.model';
import { ConfigObject } from '../shared/config/config.model';

/**
 * A class to represent the data retrieved by a configuration service
 */
export class ConfigData {
  constructor(
    public pageInfo: PageInfo,
    public payload: ConfigObject[]
  ) {
  }
}
