import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { CacheableObject } from '../cache/object-cache.reducer';
import { ResourceType } from './resource-type';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../data/remote-data';
import { GenericConstructor } from './generic-constructor';
import { PaginatedList } from '../data/paginated-list';
import { Version } from './version.model';

/**
 * Class representing a DSpace Version History
 */
export class VersionHistory extends ListableObject implements CacheableObject {
  static type = new ResourceType('versionhistory');

  /**
   * Link to itself
   */
  @excludeFromEquals
  self: string;

  /**
   * The identifier of this Version History
   */
  id: number;

  /**
   * The list of versions within this history
   */
  @excludeFromEquals
  versions: Observable<RemoteData<PaginatedList<Version>>>;

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): Array<string | GenericConstructor<ListableObject>> {
    return [this.constructor as GenericConstructor<ListableObject>];
  }
}
