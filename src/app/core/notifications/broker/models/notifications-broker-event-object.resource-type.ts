import { ResourceType } from '../../../shared/resource-type';

/**
 * The resource type for the Notifications Broker event
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const NOTIFICATIONS_BROKER_EVENT_OBJECT = new ResourceType('nbevent');
