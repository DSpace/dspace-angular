import { ResourceType } from '../../shared/resource-type';

/**
 * The resource type for WorkflowStepStatistics
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const WORKFLOW_STEP_STATISTICS = new ResourceType('workflowStep');
