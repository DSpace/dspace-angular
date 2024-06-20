/**
 * The resource type for ClarinLicenseResourceMapping
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
import {ResourceType} from '../resource-type';

export const CLARIN_LICENSE_RESOURCE_MAPPING = new ResourceType('clarinlicenseresourcemapping');
