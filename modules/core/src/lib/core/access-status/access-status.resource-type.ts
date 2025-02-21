import { ResourceType } from '@dspace/core';

/**
 * The resource type for Access Status
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const ACCESS_STATUS = new ResourceType('accessStatus');
