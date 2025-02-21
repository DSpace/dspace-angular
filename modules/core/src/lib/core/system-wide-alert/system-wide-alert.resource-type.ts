/**
 * The resource type for SystemWideAlert
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */

import { ResourceType } from '../shared';

export const SYSTEMWIDEALERT = new ResourceType('systemwidealert');
