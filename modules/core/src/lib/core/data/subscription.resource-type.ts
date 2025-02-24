/**
 * The resource type for Subscription
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
import { ResourceType } from '../shared/resource-type';

export const SUBSCRIPTION = new ResourceType('subscription');
