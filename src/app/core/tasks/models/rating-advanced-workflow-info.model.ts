import {
  autoserialize,
  inheritSerialization,
} from 'cerialize';

import { typedObject } from '../../cache/builders/build-decorators';
import { ResourceType } from '../../shared/resource-type';
import { AdvancedWorkflowInfo } from './advanced-workflow-info.model';
import { RATING_ADVANCED_WORKFLOW_INFO } from './advanced-workflow-info.resource-type';

/**
 * A model class for a {@link RatingAdvancedWorkflowInfo}
 */
@typedObject
@inheritSerialization(AdvancedWorkflowInfo)
export class RatingAdvancedWorkflowInfo extends AdvancedWorkflowInfo {

  static type: ResourceType = RATING_ADVANCED_WORKFLOW_INFO;

  /**
   * Whether the description is required.
   */
  @autoserialize
  descriptionRequired: boolean;

  /**
   * The maximum value.
   */
  @autoserialize
  maxValue: number;

}
