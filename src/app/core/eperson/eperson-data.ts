import { PageInfo } from '../shared/page-info.model';
import { EpersonModel } from './models/eperson.model';

/**
 * A class to represent the data retrieved by a Eperson service
 */
export class EpersonData {
  constructor(
    public pageInfo: PageInfo,
    public payload: EpersonModel[]
  ) { }
}
