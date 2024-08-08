import { ResourceType } from '../../../shared/resource-type';

/**
 * The resource type for the Suggestion object
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const SUGGESTION = new ResourceType('suggestion');
