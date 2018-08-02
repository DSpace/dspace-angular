import { PageInfo } from '../shared/page-info.model';
import { IntegrationModel } from './models/integration.model';

/**
 * A class to represent the data retrieved by an Integration service
 */
export class IntegrationData {
  constructor(
    public pageInfo: PageInfo,
    public payload: IntegrationModel[]
  ) { }
}
