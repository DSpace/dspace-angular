import {
  autoserialize,
  deserialize,
} from 'cerialize';

import { typedObject } from '../../../cache/builders/build-decorators';
import { CacheableObject } from '../../../cache/cacheable-object.model';
import { HALLink } from '../../../shared/hal-link.model';
import { ResourceType } from '../../../shared/resource-type';
import { excludeFromEquals } from '../../../utilities/equals.decorators';
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
