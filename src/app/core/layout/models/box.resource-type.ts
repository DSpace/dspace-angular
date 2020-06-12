import { ResourceType } from '../../shared/resource-type';

/**
 * The resource type for Box
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */

export const BOX = new ResourceType('box');
