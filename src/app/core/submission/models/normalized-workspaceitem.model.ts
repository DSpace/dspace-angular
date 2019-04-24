import { autoserialize, inheritSerialization } from 'cerialize';

import { WorkspaceItem } from './workspaceitem.model';
import { NormalizedSubmissionObject } from './normalized-submission-object.model';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { ResourceType } from '../../shared/resource-type';
import { WorkflowItem } from './workflowitem.model';
import { resourceType } from '../../shared/resource-type.decorator';

/**
 * An model class for a NormalizedWorkspaceItem.
 */
@mapsTo(WorkspaceItem)
@inheritSerialization(NormalizedDSpaceObject)
@inheritSerialization(NormalizedSubmissionObject)
@resourceType(ResourceType.WorkspaceItem)
export class NormalizedWorkspaceItem extends NormalizedSubmissionObject<WorkflowItem> {

  /**
   * The collection this workspaceitem belonging to
   */
  @autoserialize
  @relationship(ResourceType.Collection, false)
  collection: string;

  /**
   * The item created with this workspaceitem
   */
  @autoserialize
  @relationship(ResourceType.Item, false)
  item: string;

  /**
   * The configuration object that define this workspaceitem
   */
  @autoserialize
  @relationship(ResourceType.SubmissionDefinition, false)
  submissionDefinition: string;

  /**
   * The EPerson who submit this workspaceitem
   */
  @autoserialize
  @relationship(ResourceType.EPerson, false)
  submitter: string;
}
