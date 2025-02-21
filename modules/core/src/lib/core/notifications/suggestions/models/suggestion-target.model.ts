import {
  autoserialize,
  deserialize,
} from 'cerialize';

import { typedObject } from '../../../cache';
import { CacheableObject } from '../../../cache';
import { HALLink } from '../../../shared';
import { ResourceType } from '../../../shared';
import { excludeFromEquals } from '../../../utilities';
import { SUGGESTION_TARGET } from './suggestion-target-object.resource-type';

/**
 * The interface representing the Suggestion Target model
 */
@typedObject
export class SuggestionTarget implements CacheableObject {
  /**
   * A string representing the kind of object, e.g. community, item, …
   */
  static type = SUGGESTION_TARGET;

  /**
   * The Suggestion Target id
   */
  @autoserialize
  id: string;

  /**
   * The Suggestion Target name to display
   */
  @autoserialize
  display: string;

  /**
   * The Suggestion Target source to display
   */
  @autoserialize
  source: string;

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
    suggestions: HALLink,
    target: HALLink
  };
}
