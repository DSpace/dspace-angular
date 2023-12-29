import { ResourceType } from '../../../core/shared/resource-type';

/**
 * The resource type for AdminNotifyMessage
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const ADMIN_NOTIFY_MESSAGE = new ResourceType('message');
