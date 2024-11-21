import {
  autoserialize,
  deserialize,
} from 'cerialize';

import { CacheableObject } from '../../../core/cache/cacheable-object.model';
import { HALLink } from '../../../core/shared/hal-link.model';
import { MetadataMap } from '../../../core/shared/metadata.models';
import { ResourceType } from '../../../core/shared/resource-type';
import { DUPLICATE } from './duplicate.resource-type';

/**
 * This implements the model of a duplicate preview stub, to be displayed to submitters or reviewers
 * if duplicate detection is enabled. The metadata map is configurable in the backend at duplicate-detection.cfg
 */
export class Duplicate implements CacheableObject {

  static type = DUPLICATE;

  /**
   * The item title
   */
  @autoserialize
  title: string;
  /**
   * The item uuid
   */
  @autoserialize
  uuid: string;
  /**
   * The workfow item ID, if any
   */
  @autoserialize
  workflowItemId: number;
  /**
   * The workspace item ID, if any
   */
  @autoserialize
  workspaceItemId: number;
  /**
   * The owning collection of the item
   */
  @autoserialize
  owningCollection: string;
  /**
   * Metadata for the preview item (e.g. dc.title)
   */
  @autoserialize
  metadata: MetadataMap;

  @autoserialize
  type: ResourceType;

  /**
   * The {@link HALLink}s for the URL that generated this item (in context of search results)
   */
  @deserialize
  _links: {
    self: HALLink;
  };
}
