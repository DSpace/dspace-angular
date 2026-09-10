import { ResourceType } from '../../../../core/shared/resource-type';

/**
 * The resource type for Facet
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const FACET = new ResourceType('facet');
