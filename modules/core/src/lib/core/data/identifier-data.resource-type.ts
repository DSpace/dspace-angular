import { ResourceType } from '../shared';

/**
 * The resource type for Identifiers
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const IDENTIFIERS = new ResourceType('identifiers');
