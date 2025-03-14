import {
  autoserialize,
  autoserializeAs,
} from 'cerialize';

import { BrowseByDataType } from '../../browse-by/browse-by-switcher/browse-by-data-type';
import { CacheableObject } from '../cache/cacheable-object.model';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { BROWSE_DEFINITION } from './browse-definition.resource-type';

/**
 * Base class for BrowseDefinition models
 */
export abstract class BrowseDefinition extends CacheableObject {
  static type = BROWSE_DEFINITION;

  @excludeFromEquals
  type = BROWSE_DEFINITION;


  @autoserialize
  id: string;

  @autoserializeAs('metadata')
  metadataKeys: string[];

  /**
   * Get the render type of the BrowseDefinition model
   */
  abstract getRenderType(): BrowseByDataType;
}
