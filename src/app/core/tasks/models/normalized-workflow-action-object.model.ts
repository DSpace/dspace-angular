import { autoserialize, inheritSerialization } from 'cerialize';
import { mapsTo } from '../../cache/builders/build-decorators';
import { WorkflowAction } from './workflow-action-object.model';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';

/**
 * A normalized model class for a WorkflowAction
 */
@mapsTo(WorkflowAction)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedWorkflowAction extends NormalizedDSpaceObject<WorkflowAction> {
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
