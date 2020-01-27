import { ResourceType } from './resource-type';

/**
 * The resource type for ResourceType
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const RESOURCE_TYPE = new ResourceType('externalSourceEntry');
