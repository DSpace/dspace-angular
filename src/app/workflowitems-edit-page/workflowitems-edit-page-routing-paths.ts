import { URLCombiner } from '../core/url-combiner/url-combiner';
import { getWorkflowItemModuleRoute } from '../app-routing-paths';
import { RATING_REVIEWER_ACTION_ADVANCED_INFO } from '../core/tasks/models/reviewer-action-advanced-info.resource-type';

export function getWorkflowItemPageRoute(wfiId: string) {
  return new URLCombiner(getWorkflowItemModuleRoute(), wfiId).toString();
}

export function getWorkflowItemEditRoute(wfiId: string) {
  return new URLCombiner(getWorkflowItemModuleRoute(), wfiId, WORKFLOW_ITEM_EDIT_PATH).toString();
}
export function getWorkflowItemViewRoute(wfiId: string) {
  return new URLCombiner(getWorkflowItemModuleRoute(), wfiId, WORKFLOW_ITEM_VIEW_PATH).toString();
}

export function getWorkflowItemDeleteRoute(wfiId: string) {
  return new URLCombiner(getWorkflowItemModuleRoute(), wfiId, WORKFLOW_ITEM_DELETE_PATH).toString();
}

export function getWorkflowItemSendBackRoute(wfiId: string) {
  return new URLCombiner(getWorkflowItemModuleRoute(), wfiId, WORKFLOW_ITEM_SEND_BACK_PATH).toString();
}

export function getWorkflowSelectReviewerRoute(wfiId: string) {
  return new URLCombiner(getWorkflowItemModuleRoute(), wfiId, WORKFLOW_SELECT_REVIEWER_PATH).toString();
}
export function getWorkflowRatingReviewerRoute(wfiId: string) {
  return new URLCombiner(getWorkflowItemModuleRoute(), wfiId, WORKFLOW_RATING_REVIEWER_PATH).toString();
}

export const WORKFLOW_ITEM_EDIT_PATH = 'edit';
export const WORKFLOW_ITEM_DELETE_PATH = 'delete';
export const WORKFLOW_ITEM_VIEW_PATH = 'view';
export const WORKFLOW_ITEM_SEND_BACK_PATH = 'sendback';
export const WORKFLOW_SELECT_REVIEWER_PATH = 'selectreviewer';
export const WORKFLOW_RATING_REVIEWER_PATH = 'ratingreviewer';
