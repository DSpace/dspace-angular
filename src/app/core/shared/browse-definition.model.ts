import { autoserialize, autoserializeAs, deserialize } from 'cerialize';
import { typedObject } from '../cache/builders/build-decorators';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { BROWSE_DEFINITION } from './browse-definition.resource-type';
import { HALLink } from './hal-link.model';
import { ResourceType } from './resource-type';
import { SortOption } from './sort-option.model';
import { CacheableObject } from '../cache/cacheable-object.model';
import { BrowseByDataType } from '../../browse-by/browse-by-switcher/browse-by-decorator';

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
