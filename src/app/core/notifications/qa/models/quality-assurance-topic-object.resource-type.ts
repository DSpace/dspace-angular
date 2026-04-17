import { ResourceType } from '../../../shared/resource-type';

/**
 * The resource type for the Quality Assurance topic
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const QUALITY_ASSURANCE_TOPIC_OBJECT = new ResourceType('qualityassurancetopic');
