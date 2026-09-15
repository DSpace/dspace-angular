import { ResourceType } from '../../shared/resource-type';

/**
 * The resource type for {@link CorrectionType}
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const CORRECTION_TYPE = new ResourceType('correctiontype');
