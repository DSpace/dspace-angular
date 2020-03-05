import { autoserialize, deserialize, inheritSerialization } from 'cerialize';

import { IntegrationModel } from './integration.model';
import { HALLink } from '../../shared/hal-link.model';
import { AUTHORITY_VALUE } from './authority.resource-type';
import { typedObject } from '../../cache/builders/build-decorators';

/**
 * Model class for an Authority
 */
@typedObject
@inheritSerialization(IntegrationModel)
export class Authority extends IntegrationModel {
  static type = AUTHORITY_VALUE;

  /**
   * True if the Authority is scrollable
   */
  @autoserialize
  scrollable: boolean;

  /**
   * True if the Authority is hierarchical
   */
  @autoserialize
  hierarchical: boolean;

  /**
   * The number of levels of a hierarchical Authority that should be pre-loaded
   */
  @autoserialize
  preloadLevel: number;

  /**
   * The {@link HALLink}s for this AuthorityValue
   */
  @deserialize
  _links: {
    self: HALLink,
  };
}
