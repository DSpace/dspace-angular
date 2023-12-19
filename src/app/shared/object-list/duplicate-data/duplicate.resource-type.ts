import { ResourceType } from 'src/app/core/shared/resource-type';

/**
 * The resource type for Access Status
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const DUPLICATE = new ResourceType('duplicate');
