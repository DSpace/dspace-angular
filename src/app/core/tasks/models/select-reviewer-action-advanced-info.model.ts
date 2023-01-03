import { typedObject } from '../../cache/builders/build-decorators';
import { inheritSerialization, autoserialize } from 'cerialize';
import { SELECT_REVIEWER_ACTION_ADVANCED_INFO } from './reviewer-action-advanced-info.resource-type';
import { ReviewerActionAdvancedInfo } from './reviewer-action-advanced-info.model';

/**
 * A model class for a {@link SelectReviewerActionAdvancedInfo}
 */
@typedObject
@inheritSerialization(ReviewerActionAdvancedInfo)
export class SelectReviewerActionAdvancedInfo extends ReviewerActionAdvancedInfo {

  static type = SELECT_REVIEWER_ACTION_ADVANCED_INFO;

  @autoserialize
  group: string;

}
