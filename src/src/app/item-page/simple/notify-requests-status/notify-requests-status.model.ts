// eslint-disable-next-line max-classes-per-file
import {
  autoserialize,
  deserialize,
  inheritSerialization,
} from 'cerialize';

import { typedObject } from '../../../core/cache/builders/build-decorators';
import { CacheableObject } from '../../../core/cache/cacheable-object.model';
import { HALLink } from '../../../core/shared/hal-link.model';
import { ResourceType } from '../../../core/shared/resource-type';
import { excludeFromEquals } from '../../../core/utilities/equals.decorators';
import { NOTIFYREQUEST } from './notify-requests-status.resource-type';
import { RequestStatusEnum } from './notify-status.enum';

/**
 * Represents the status of notify requests for an item.
 */
@typedObject
@inheritSerialization(CacheableObject)
export class NotifyRequestsStatus implements CacheableObject {
  static type = NOTIFYREQUEST;

  /**
   * The object type.
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The notify statuses.
   */
  @autoserialize
  notifyStatus: NotifyStatuses[];

  /**
   * The UUID of the item.
   */
  @autoserialize
  itemuuid: string;

  /**
   * The links associated with the notify requests status.
   */
  @deserialize
  _links: {
    self: HALLink;
    [k: string]: HALLink | HALLink[];
  };
}

/**
 * Represents the status of a notification request.
 */
export class NotifyStatuses {
  /**
   * The name of the service.
   */
  serviceName: string;

  /**
   * The URL of the service.
   */
  serviceUrl: string;

  /**
   * The status of the notification request.
   */
  status: RequestStatusEnum;
  /**
   * Type of request.
   */
  offerType: string;
}


