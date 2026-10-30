import { ResourceType } from '@dspace/core/shared/resource-type';

/**
 * The resource type for Identifier
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const IDENTIFIER = new ResourceType('identifier');
