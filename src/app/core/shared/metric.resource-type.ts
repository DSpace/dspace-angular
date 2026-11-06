/**
 * The resource type for Metric
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
import { ResourceType } from './resource-type';

export const METRIC = new ResourceType('metric');
