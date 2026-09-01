import { ResourceType } from '../../shared/resource-type';

/**
 * The resource type for {@link EditItem}
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const EDIT_ITEM = new ResourceType('edititem');
