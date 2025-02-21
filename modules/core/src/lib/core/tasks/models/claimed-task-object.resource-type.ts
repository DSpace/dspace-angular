import { ResourceType } from '../../shared';

/**
 * The resource type for ClaimedTask
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const CLAIMED_TASK = new ResourceType('claimedtask');
