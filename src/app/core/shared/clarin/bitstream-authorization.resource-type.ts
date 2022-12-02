/**
 * The resource type for the Clarin License endpoint
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
import { ResourceType } from '../resource-type';

export const BITSTREAM_AUTHRN = new ResourceType('authrn');
