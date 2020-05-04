import { ResourceType } from '../resource-type';

/**
 * The resource type for ItemType
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */

export const ITEM_TYPE = new ResourceType('entitytype');
