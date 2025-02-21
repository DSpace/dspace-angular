import { ResourceType } from '../../../shared';

/**
 * The resource type for the Suggestion Source object
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const SUGGESTION_SOURCE = new ResourceType('suggestionsource');
