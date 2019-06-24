import { WorkspaceItem } from './workspaceitem.model';
import { ResourceType } from '../../shared/resource-type';

/**
 * A model class for a WorkflowItem.
 */
export class WorkflowItem extends WorkspaceItem {
  static type = new ResourceType('workflowitem');
}
