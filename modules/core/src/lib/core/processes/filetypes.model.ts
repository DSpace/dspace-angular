import { autoserialize } from 'cerialize';

import { typedObject } from '../cache';
import { ResourceType } from '../shared';
import { excludeFromEquals } from '../utilities';
import { FILETYPES } from './filetypes.resource-type';

/**
 * Object representing the file types of the {@link Bitstream}s of a {@link Process}
 */
@typedObject
export class Filetypes {

  static type = FILETYPES;

  /**
   * The id of this {@link Filetypes}
   */
  @autoserialize
  id: string;

  /**
   * The values of this {@link Filetypes}
   */
  @autoserialize
  values: string[];

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

}
