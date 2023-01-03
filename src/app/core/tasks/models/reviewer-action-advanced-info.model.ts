import { typedObject } from '../../cache/builders/build-decorators';
import { autoserialize } from 'cerialize';
import { REVIEWER_ACTION_ADVANCED_INFO } from './reviewer-action-advanced-info.resource-type';

/**
 * A model class for a {@link ReviewerActionAdvancedInfo}
 */
@typedObject
export class ReviewerActionAdvancedInfo {

  static type = REVIEWER_ACTION_ADVANCED_INFO;

  @autoserialize
  id: string;

}
