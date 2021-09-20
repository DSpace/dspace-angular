import { autoserialize } from 'cerialize';
import { typedObject } from '../cache/builders/build-decorators';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { ResourceType } from './resource-type';
import { ITEM_REQUEST } from './item-request.resource-type';

/**
 * Model class for a Configuration Property
 */
@typedObject
export class ItemRequest {
  static type = ITEM_REQUEST;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * opaque string which uniquely identifies this request
   */
  @autoserialize
  token: string;

  /**
   * true if the request is for all bitstreams of the item.
   */
  @autoserialize
  allfiles: boolean;
  /**
   * email address of the person requesting the files.
   */
  @autoserialize
  requestEmail: string;
  /**
   * Human-readable name of the person requesting the files.
   */
  @autoserialize
  requestName: string;
  /**
   * arbitrary message provided by the person requesting the files.
   */
  @autoserialize
  requestMessage: string;
  /**
   * date that the request was recorded.
   */
  @autoserialize
  requestDate: string;
  /**
   * true if the request has been granted.
   */
  @autoserialize
  acceptRequest: boolean;
  /**
   * date that the request was granted or denied.
   */
  @autoserialize
  decisionDate: string;
  /**
   * date on which the request is considered expired.
   */
  @autoserialize
  expires: string;
  /**
   * UUID of the requested Item.
   */
  @autoserialize
  itemId: string;
  /**
   * UUID of the requested bitstream.
   */
  @autoserialize
  bitstreamId: string;


}
