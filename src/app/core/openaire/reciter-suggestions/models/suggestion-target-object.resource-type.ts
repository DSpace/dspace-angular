import { ResourceType } from '../../../shared/resource-type';

/**
 * The resource type for the Suggestion Target
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const SUGGESTION_TARGET_OBJECT = new ResourceType('suggestiontarget');
