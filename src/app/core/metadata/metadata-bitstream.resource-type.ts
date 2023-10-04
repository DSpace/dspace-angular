import { ResourceType } from '../shared/resource-type';

/**
 * The resource type for MetadataBitstream
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const METADATA_BITSTREAM = new ResourceType('metadatabitstream');
