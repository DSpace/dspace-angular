import { autoserialize, deserialize } from 'cerialize';
import { typedObject } from '../../cache/builders/build-decorators';
import { CacheableObject } from '../../cache/cacheable-object.model';
import { HALLink } from '../../shared/hal-link.model';
import { ResourceType } from '../../shared/resource-type';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { ITEM_EXPORT_FORMAT } from './item-export-format.resource-type';

export interface ItemExportFormatMap {
  [entityType: string]: ItemExportFormat[]
}

/**
 * Class the represents an Item Export Format.
 */
@typedObject
export class ItemExportFormat extends CacheableObject {

  static type = ITEM_EXPORT_FORMAT;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier of this Item Export Format.
   */
  @autoserialize
  id: string;

  /**
   * The mimeType of this Item Export Format.
   */
  @autoserialize
  mimeType: string;

  /**
   * The entityType of this Item Export Format.
   */
  @autoserialize
  entityType: string;

  /**
   * The molteplicity of this Item Export Format.
   */
  @autoserialize
  molteplicity: string;

  /**
   * The {@link HALLink}s for this Researcher Profile
   */
  @deserialize
  _links: {
    self: HALLink
  };

}
