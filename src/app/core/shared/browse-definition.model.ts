import { autoserialize } from 'cerialize';
import { CacheableObject } from '../cache/cacheable-object.model';

/**
 * Base class for BrowseDefinition models
 */
export abstract class BrowseDefinition extends CacheableObject {

  @autoserialize
  id: string;

  /**
   * Get the render type of the BrowseDefinition model
   */
  abstract getRenderType(): string;
}
