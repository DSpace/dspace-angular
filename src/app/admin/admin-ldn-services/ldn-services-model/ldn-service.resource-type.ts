/**
 * The resource type for Ldn-Services
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
import { ResourceType } from '../../../core/shared/resource-type';

export const LDN_SERVICE = new ResourceType('ldnservice');
export const LDN_SERVICE_CONSTRAINT_FILTERS = new ResourceType('itemfilters');

export const LDN_SERVICE_CONSTRAINT_FILTER = new ResourceType('itemfilter');
