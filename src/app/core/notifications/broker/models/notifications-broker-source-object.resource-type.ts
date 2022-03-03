import { ResourceType } from '../../../shared/resource-type';

/**
 * The resource type for the Notifications Broker source
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const NOTIFICATIONS_BROKER_SOURCE_OBJECT = new ResourceType('nbsource');
