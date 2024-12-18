import { autoserialize } from 'cerialize';

import { BrowseByDataType } from '../../browse-by/browse-by-switcher/browse-by-data-type';
import { CacheableObject } from '../cache/cacheable-object.model';
import { SortDirection } from '../cache/models/sort-options.model';

/**
 * Base class for BrowseDefinition models
 */
export abstract class BrowseDefinition extends CacheableObject {

  @autoserialize
  id: string;

  @autoserialize
  order: SortDirection;

  /**
   * Get the render type of the BrowseDefinition model
   */
  abstract getRenderType(): BrowseByDataType;
}
