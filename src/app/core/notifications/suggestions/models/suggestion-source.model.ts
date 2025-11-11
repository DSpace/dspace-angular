import { typedObject } from '@dspace/core/cache/builders/build-decorators';
import { CacheableObject } from '@dspace/core/cache/cacheable-object.model';
import { HALLink } from '@dspace/core/shared/hal-link.model';
import { ResourceType } from '@dspace/core/shared/resource-type';
import { excludeFromEquals } from '@dspace/core/utilities/equals.decorators';
import {
  autoserialize,
  deserialize,
} from 'cerialize';

import { SUGGESTION_SOURCE } from './suggestion-source-object.resource-type';

/**
 * The interface representing the Suggestion Source model
 */
@typedObject
export class SuggestionSource implements CacheableObject {
  /**
   * A string representing the kind of object, e.g. community, item, …
   */
  static type = SUGGESTION_SOURCE;

  /**
   * The Suggestion Target id
   */
  @autoserialize
  id: string;

  /**
   * The total number of suggestions provided by Suggestion Target for
   */
  @autoserialize
  total: number;

  /**
   * The type of this ConfigObject
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The links to all related resources returned by the rest api.
   */
  @deserialize
  _links: {
    self: HALLink,
    suggestiontargets: HALLink
  };
}
