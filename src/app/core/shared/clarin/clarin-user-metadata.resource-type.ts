/**
 * The resource type for ClarinUserMetadata
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
import { ResourceType } from '../resource-type';

export const CLARIN_USER_METADATA = new ResourceType('clarinusermetadata');
export const CLARIN_USER_METADATA_MANAGE = 'manage';
