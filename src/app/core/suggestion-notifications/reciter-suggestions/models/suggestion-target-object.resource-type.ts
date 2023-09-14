import { ResourceType } from '../../../shared/resource-type';

/**
 * The resource type for the Suggestion Target object
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const SUGGESTION_TARGET = new ResourceType('suggestiontarget');
