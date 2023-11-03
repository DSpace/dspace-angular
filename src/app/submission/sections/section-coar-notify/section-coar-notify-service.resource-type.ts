/**
 * The resource type for Ldn-Services
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
import { ResourceType } from '../../../core/shared/resource-type';


export const SUBMISSION_COAR_NOTIFY_CONFIG = new ResourceType('submissioncoarnotifyconfig');

export const COAR_NOTIFY_WORKSPACEITEM = new ResourceType('workspaceitem');

