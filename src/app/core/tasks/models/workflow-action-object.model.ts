import { ResourceType } from '../../shared/resource-type';
import { DSpaceObject } from '../../shared/dspace-object.model';

/**
 * A model class for a WorkflowAction
 */
export class WorkflowAction extends DSpaceObject {
  static type = new ResourceType('workflowaction');

  /**
   * The workflow action's identifier
   */
  id: string;

  /**
   * The options available for this workflow action
   */
  options: string[];
}
