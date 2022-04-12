import { autoserialize, deserialize, deserializeAs } from 'cerialize';
import { typedObject } from '../../cache/builders/build-decorators';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { HALLink } from '../../shared/hal-link.model';
import { ResourceType } from '../../shared/resource-type';
import { excludeFromEquals } from '../../utilities/equals.decorators';
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

}
