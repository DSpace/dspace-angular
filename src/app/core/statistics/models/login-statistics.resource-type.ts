import { ResourceType } from '../../shared/resource-type';

/**
 * The resource type for LoginStatistics
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const LOGIN_STATISTICS = new ResourceType('login');
