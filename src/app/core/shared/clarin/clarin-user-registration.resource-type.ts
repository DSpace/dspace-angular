/**
 * The resource type for ClarinUserRegistration.
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
import { ResourceType } from '../resource-type';

export const CLARIN_USER_REGISTRATION = new ResourceType('clarinuserregistration');
