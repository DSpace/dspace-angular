import { ResourceType } from '../../shared/resource-type';

/**
 * The resource type for MachineToken
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const MACHINE_TOKEN = new ResourceType('machinetoken');
