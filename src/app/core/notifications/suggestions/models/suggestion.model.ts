import { typedObject } from '@dspace/core/cache/builders/build-decorators';
import { CacheableObject } from '@dspace/core/cache/cacheable-object.model';
import { HALLink } from '@dspace/core/shared/hal-link.model';
import {
  MetadataMap,
  MetadataMapSerializer,
} from '@dspace/core/shared/metadata.models';
import { ResourceType } from '@dspace/core/shared/resource-type';
import { excludeFromEquals } from '@dspace/core/utilities/equals.decorators';
import {
  autoserialize,
  autoserializeAs,
  deserialize,
} from 'cerialize';

import { SUGGESTION } from './suggestion-objects.resource-type';

/**
 * The interface representing Suggestion Evidences such as scores (authorScore, datescore)
 */
export interface SuggestionEvidences {
  [sectionId: string]: {
    score: string;
    notes: string
  };
}
/**
 * The interface representing the Suggestion Source model
 */
@typedObject
export class Suggestion implements CacheableObject {
  /**
   * A string representing the kind of object, e.g. community, item, …
   */
  static type = SUGGESTION;

  /**
   * The Suggestion id
   */
  @autoserialize
  id: string;

  /**
   * The Suggestion name to display
   */
  @autoserialize
  display: string;

  /**
   * The Suggestion source to display
   */
  @autoserialize
  source: string;

  /**
   * The Suggestion external source uri
   */
  @autoserialize
  externalSourceUri: string;

  /**
   * The Total Score of the suggestion
   */
  @autoserialize
  score: string;

  /**
   * The total number of suggestions provided by Suggestion Target for
   */
  @autoserialize
  evidences: SuggestionEvidences;

  /**
   * All metadata of this suggestion object
   */
  @excludeFromEquals
  @autoserializeAs(MetadataMapSerializer)
  metadata: MetadataMap;

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
    target: HALLink
  };
}
