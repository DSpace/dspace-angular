import { ResourceType } from './resource-type';

/**
 * The resource type for FlatBrowseDefinition
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const FLAT_BROWSE_DEFINITION = new ResourceType('flatBrowse');
