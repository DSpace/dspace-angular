import { SubmissionObject } from './submission-object.model';
import { ResourceType } from '../../shared/resource-type';

/**
 * A model class for a WorkspaceItem.
 */
export class WorkspaceItem extends SubmissionObject {
  static type = new ResourceType('workspaceitem');

}
