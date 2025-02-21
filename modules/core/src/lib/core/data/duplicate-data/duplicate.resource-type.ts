import { ResourceType } from '@dspace/core';

/**
 * The resource type for Duplicate preview stubs
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const DUPLICATE = new ResourceType('duplicate');
