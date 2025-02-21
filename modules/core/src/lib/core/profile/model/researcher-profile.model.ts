import {
  autoserialize,
  deserialize,
  deserializeAs,
} from 'cerialize';
import { Observable } from 'rxjs';

import {
  link,
  typedObject,
} from '../../cache';
import { CacheableObject } from '../../cache';
import { RemoteData } from '../../data';
import { HALLink } from '../../shared';
import { Item } from '../../shared';
import { ITEM } from '../../shared';
import { ResourceType } from '../../shared';
import { excludeFromEquals } from '../../utilities';
import { RESEARCHER_PROFILE } from './researcher-profile.resource-type';

/**
 * Class the represents a Researcher Profile.
 */
@typedObject
export class ResearcherProfile extends CacheableObject {

  static type = RESEARCHER_PROFILE;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier of this Researcher Profile
   */
  @autoserialize
  id: string;

  @deserializeAs('id')
  uuid: string;

  /**
   * The visibility of this Researcher Profile
   */
  @autoserialize
  visible: boolean;

  /**
   * The {@link HALLink}s for this Researcher Profile
   */
  @deserialize
  _links: {
    self: HALLink,
    item: HALLink,
    eperson: HALLink
  };

  /**
   * The related person Item
   * Will be undefined unless the item {@link HALLink} has been resolved.
   */
  @link(ITEM)
  item?: Observable<RemoteData<Item>>;

}
