import {
  SubmissionVisibilityType,
  SubmissionVisibilityValue
} from '../../core/config/models/config-submission-section.model';
import { SubmissionScopeType } from '../../core/submission/submission-scope-type';
import { isNotEmpty } from '../../shared/empty.util';

/**
 * Util class to deal with submission visibility checks
 */
export class SubmissionVisibility {

  /**
   * By the given visibility and scope, return whether or not if it's hidden
   * @param visibility The given visibility value to check
   * @param scope      The scope for which to check the visibility
   */
  public static isHidden(visibility: SubmissionVisibilityType, scope: SubmissionScopeType) {
    return isNotEmpty(visibility)
      && visibility.hasOwnProperty(scope)
      && visibility[scope] === SubmissionVisibilityValue.Hidden;
  }

  /**
   * By the given visibility and scope, return whether or not if it's read-only
   * @param visibility The given visibility value to check
   * @param scope      The scope for which to check the visibility
   */
  public static isReadOnly(visibility: SubmissionVisibilityType, scope: SubmissionScopeType) {
    return isNotEmpty(visibility)
      && visibility.hasOwnProperty(scope)
      && visibility[scope] === SubmissionVisibilityValue.ReadOnly;
  }
}
