import { ResourceType } from '../../shared';

/**
 * The resource type for Accesses section
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const SUBMISSION_ACCESSES = new ResourceType('submissionaccesses');
