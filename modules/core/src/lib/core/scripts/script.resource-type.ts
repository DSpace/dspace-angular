/**
 * The resource type for Script
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
import { ResourceType } from '../shared';

export const SCRIPT = new ResourceType('script');
