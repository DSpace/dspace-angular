import {
  autoserialize,
  deserialize,
} from 'cerialize';

import { typedObject } from '../cache/builders/build-decorators';
import { CacheableObject } from '../cache/cacheable-object.model';
import { HALLink } from '../shared/hal-link.model';
import { ResourceType } from '../shared/resource-type';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { ROOT } from './root.resource-type';

/**
 * The root rest api resource
 */
@typedObject
export class Root implements CacheableObject {
  static type = ROOT;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The url for the dspace UI
   */
  @autoserialize
  dspaceUI: string;

  /**
   * The repository Name
   */
  @autoserialize
  dspaceName: string;

  /**
   * The url for the rest api
   */
  @autoserialize
  dspaceServer: string;

  /**
   * The current DSpace version
   */
  @autoserialize
  dspaceVersion: string;

  /**
   * The {@link HALLink}s for the root object
   */
  @deserialize
  _links: {
    self: HALLink;
    [k: string]: HALLink | HALLink[];
  };
}
