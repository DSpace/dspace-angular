import { ResourceType } from '../../shared';

/**
 * The resource type for ResearcherProfile
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const RESEARCHER_PROFILE = new ResourceType('profile');
