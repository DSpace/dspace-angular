import { ResourceType } from '../../shared';

/**
 * The resource type for AuthStatus
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const AUTH_STATUS = new ResourceType('status');
