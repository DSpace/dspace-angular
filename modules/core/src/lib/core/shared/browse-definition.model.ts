import {
  autoserialize,
  autoserializeAs,
} from 'cerialize';

import { CacheableObject } from '../cache';
import { BrowseByDataType } from './browse-by-data-type';

/**
 * Base class for BrowseDefinition models
 */
export abstract class BrowseDefinition extends CacheableObject {

  @autoserialize
  id: string;

  @autoserializeAs('metadata')
  metadataKeys: string[];

  /**
   * Get the render type of the BrowseDefinition model
   */
  abstract getRenderType(): BrowseByDataType;
}
