import { ResourceType } from '../shared/resource-type';

/**
 * The resource type for Handle
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */

export const HANDLE = new ResourceType('handle');
export const SUCCESSFUL_RESPONSE_START_CHAR = '2';
export const COMMUNITY = 'Community';
export const COLLECTION = 'Collection';
export const ITEM = 'Item';
export const SITE = 'Site';
