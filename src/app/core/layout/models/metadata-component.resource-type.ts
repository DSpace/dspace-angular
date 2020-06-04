import { ResourceType } from '../../shared/resource-type';

/**
 * The resource type for metadatacomponent
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */

export const METADATACOMPONENT = new ResourceType('metadatacomponent');
