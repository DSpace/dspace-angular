import { ResourceType } from '../shared';

/**
 * The resource type for MetadataField
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */

export const METADATA_FIELD = new ResourceType('metadatafield');
