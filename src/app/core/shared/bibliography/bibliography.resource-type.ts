import { ResourceType } from 'src/app/core/shared/resource-type';

/**
 * The resource type for Bibliography
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const BIBLIOGRAPHY = new ResourceType('bibliography');
