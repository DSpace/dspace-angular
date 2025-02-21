import {
  autoserialize,
  autoserializeAs,
} from 'cerialize';

import { BrowseByDataType } from './browse-by-data-type';
import { CacheableObject } from '../cache';

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
