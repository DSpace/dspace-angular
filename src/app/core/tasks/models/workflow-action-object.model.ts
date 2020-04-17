import { inheritSerialization, autoserialize } from 'cerialize';
import { typedObject } from '../../cache/builders/build-decorators';
import { DSpaceObject } from '../../shared/dspace-object.model';
import { WORKFLOW_ACTION } from './workflow-action-object.resource-type';

/**
 * A model class for a WorkflowAction
 */
@typedObject
@inheritSerialization(DSpaceObject)
export class WorkflowAction extends DSpaceObject {
  static type = WORKFLOW_ACTION;

  /**
   * The workflow action's identifier
   */
  @autoserialize
  id: string;

  /**
   * The options available for this workflow action
   */
  @autoserialize
  options: string[];
}
