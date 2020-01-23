import { inheritSerialization, deserialize } from 'cerialize';

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
   * The Collection that this item is a template for
   */
  @deserialize
  @relationship(Collection, false)
  templateItemOf: string;

}
