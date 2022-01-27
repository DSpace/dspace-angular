import { ResourceType } from '../../shared/resource-type';

/**
 * The resource type for WorkflowOwnerStatistics
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const WORKFLOW_OWNER_STATISTICS = new ResourceType('workflowOwner');
