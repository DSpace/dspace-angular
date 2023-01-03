import { ResourceType } from '../../shared/resource-type';

/**
 * The resource type for {@link ReviewerActionAdvancedInfo}
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const REVIEWER_ACTION_ADVANCED_INFO = new ResourceType('revieweraction');

/**
 * The resource type for {@link RatingReviewerActionAdvancedInfo}
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const RATING_REVIEWER_ACTION_ADVANCED_INFO = new ResourceType('ratingrevieweraction');

/**
 * The resource type for {@link SelectReviewerActionAdvancedInfo}
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const SELECT_REVIEWER_ACTION_ADVANCED_INFO = new ResourceType('selectrevieweraction');
