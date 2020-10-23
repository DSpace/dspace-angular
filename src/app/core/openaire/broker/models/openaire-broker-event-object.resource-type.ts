import { ResourceType } from '../../../shared/resource-type';

/**
 * The resource type for the OpenAIRE Broker event
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const OPENAIRE_BROKER_EVENT_OBJECT = new ResourceType('nbevent');
