import { ResourceType } from '../../shared/resource-type';

/**
 * The resource type for DynamicLayoutTab
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */

export const TAB = new ResourceType('tab');
