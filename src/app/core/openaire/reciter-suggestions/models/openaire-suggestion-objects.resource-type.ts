import { ResourceType } from '../../../shared/resource-type';

/**
 * The resource type for the Suggestion Target object
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const SUGGESTION_TARGET = new ResourceType('suggestiontarget');

/**
 * The resource type for the Suggestion Source object
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const SUGGESTION_SOURCE = new ResourceType('suggestionsource');

/**
 * The resource type for the Suggestion object
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const SUGGESTION = new ResourceType('suggestion');
