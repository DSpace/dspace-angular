import { ResourceType } from '../../../../../modules/core/src/lib/core/shared/resource-type';

/**
 * The resource type for Subscription
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */

export const SUBSCRIPTION = new ResourceType('subscription');
