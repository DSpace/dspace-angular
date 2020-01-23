import { inheritSerialization, deserialize, autoserializeAs } from 'cerialize';

import { mapsTo, relationship } from '../builders/build-decorators';
import { TemplateItem } from '../../shared/template-item.model';
import { NormalizedItem } from './normalized-item.model';
import { Collection } from '../../shared/collection.model';

/**
 * Normalized model class for a DSpace Template Item
 */
@mapsTo(TemplateItem)
@inheritSerialization(NormalizedItem)
export class NormalizedTemplateItem extends NormalizedItem {

  /**
   * The human-readable identifier of this DSpaceObject
   */
  @autoserializeAs(String)
  id: string;

  /**
   * The universally unique identifier of this DSpaceObject
   */
  @autoserializeAs(String, 'id')
  uuid: string;

  /**
   * The Collection that this item is a template for
   */
  @deserialize
  @relationship(Collection, false)
  templateItemOf: string;

}
