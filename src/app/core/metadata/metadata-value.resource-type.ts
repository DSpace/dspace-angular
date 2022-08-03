import { ResourceType } from '../shared/resource-type';

/**
 * The resource type for the metadata value endpoint
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const METADATA_VALUE = new ResourceType('metadatavalue');
