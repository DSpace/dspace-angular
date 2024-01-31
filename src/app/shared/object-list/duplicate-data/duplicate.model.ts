import {autoserialize, deserialize} from 'cerialize';
import { MetadataMap } from '../../../core/shared/metadata.models';
import { HALLink} from '../../../core/shared/hal-link.model';
import { CacheableObject } from '../../../core/cache/cacheable-object.model';
import { DUPLICATE } from './duplicate.resource-type';
import { ResourceType } from '../../../core/shared/resource-type';

export class Duplicate implements CacheableObject {

  static type = DUPLICATE;

  /**
   * The item title
   */
  @autoserialize
  title: string;
  @autoserialize
  uuid: string;
  @autoserialize
  workflowItemId: number;
  @autoserialize
  workspaceItemId: number;
  @autoserialize
  owningCollection: string;

  /**
   * Metadata for the bitstream (e.g. dc.description)
   */
  @autoserialize
  metadata: MetadataMap;

  @autoserialize
  type: ResourceType;

  /**
   * The {@link HALLink}s for this Bitstream
   */
  @deserialize
  _links: {
    self: HALLink;
  };
}
