import { ResourceType } from './resource-type';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { CacheableObject } from '../cache/object-cache.reducer';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { GenericConstructor } from './generic-constructor';
import { Item } from './item.model';
import { RemoteData } from '../data/remote-data';
import { Observable } from 'rxjs/internal/Observable';
import { VersionHistory } from './version-history.model';

/**
 * Class representing a DSpace Version
 */
export class Version extends ListableObject implements CacheableObject {
  static type = new ResourceType('version');

  /**
   * Link to itself
   */
  @excludeFromEquals
  self: string;

  /**
   * The identifier of this Version
   */
  id: number;

  /**
   * The version number of the version's history this version represents
   */
  version: number;

  /**
   * The summary for the changes made in this version
   */
  summary: string;

  /**
   * The Date this version was created
   */
  created: Date;

  /**
   * The full version history this version is apart of
   */
  @excludeFromEquals
  versionhistory: Observable<RemoteData<VersionHistory>>;

  /**
   * The item this version represents
   */
  @excludeFromEquals
  item: Observable<RemoteData<Item>>;

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): Array<string | GenericConstructor<ListableObject>> {
    return [this.constructor as GenericConstructor<ListableObject>];
  }
}
