import { ResourceType } from '../../../shared/resource-type';

/**
 * The resource type for the Notifications Broker topic
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const NOTIFICATIONS_BROKER_TOPIC_OBJECT = new ResourceType('nbtopic');
