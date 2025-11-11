import { ResourceType } from '../../resource-type';

/**
 * The resource type for SearchObjects
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const SEARCH_OBJECTS = new ResourceType('discovery-objects');
