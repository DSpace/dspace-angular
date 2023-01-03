import { typedObject } from '../../cache/builders/build-decorators';
import { inheritSerialization, autoserialize } from 'cerialize';
import { RATING_REVIEWER_ACTION_ADVANCED_INFO } from './reviewer-action-advanced-info.resource-type';
import { ReviewerActionAdvancedInfo } from './reviewer-action-advanced-info.model';

/**
 * A model class for a {@link RatingReviewerActionAdvancedInfo}
 */
@typedObject
@inheritSerialization(ReviewerActionAdvancedInfo)
export class RatingReviewerActionAdvancedInfo extends ReviewerActionAdvancedInfo {

  static type = RATING_REVIEWER_ACTION_ADVANCED_INFO;

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
