import { typedObject, link } from '../../cache/builders/build-decorators';
import { HALResource } from '../../shared/hal-resource.model';
import { deserialize, autoserialize, deserializeAs } from 'cerialize';
import { HALLink } from '../../shared/hal-link.model';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { ResourceType } from '../../shared/resource-type';
import { RESEARCHER_PROFILE } from './researcher-profile.resource-type';
import { Item } from '../../shared/item.model';
import { ITEM } from '../../shared/item.resource-type';
import { EPERSON } from '../../eperson/models/eperson.resource-type';
import { Observable } from 'rxjs';
import { RemoteData } from '../../data/remote-data';
import { EPerson } from '../../eperson/models/eperson.model';
import { CacheableObject } from '../../cache/object-cache.reducer';

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

}
