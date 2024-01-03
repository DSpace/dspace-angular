import { ResourceType } from './resource-type';

/**
 * The resource type for BitstreamChecksum
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const BITSTREAM_CHECKSUM = new ResourceType('bitstreamchecksum');
