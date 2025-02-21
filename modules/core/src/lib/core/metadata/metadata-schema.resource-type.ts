import { ResourceType } from '../shared';

/**
 * The resource type for MetadataSchema
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */

export const METADATA_SCHEMA = new ResourceType('metadataschema');
