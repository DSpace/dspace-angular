import { PageInfo } from '../shared/page-info.model';
import { NormalizedObject } from '../cache/models/normalized-object.model';

/**
 * A class to represent the data retrieved by a Eperson service
 */
export class EpersonData {
  constructor(
    public pageInfo: PageInfo,
    public payload: NormalizedObject[]
  ) { }
}
