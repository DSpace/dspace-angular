import { autoserialize, inheritSerialization } from 'cerialize';

import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { WorkflowItem } from './workflowitem.model';
import { NormalizedSubmissionObject } from './normalized-submission-object.model';
import { ResourceType } from '../../shared/resource-type';
import { resourceType } from '../../shared/resource-type.decorator';

/**
 * An model class for a NormalizedWorkflowItem.
 */
@mapsTo(WorkflowItem)
@inheritSerialization(NormalizedSubmissionObject)
@resourceType(ResourceType.WorkflowItem)
export class NormalizedWorkflowItem extends NormalizedSubmissionObject<WorkflowItem> {

  /**
   * The collection this workflowitem belonging to
   */
  @autoserialize
  @relationship(ResourceType.Collection, false)
  collection: string;

  /**
   * The item created with this workflowitem
   */
  @autoserialize
  @relationship(ResourceType.Item, false)
  item: string;

  /**
   * The configuration object that define this workflowitem
   */
  @autoserialize
  @relationship(ResourceType.SubmissionDefinition, false)
  submissionDefinition: string;

  /**
   * The EPerson who submit this workflowitem
   */
  @autoserialize
  @relationship(ResourceType.EPerson, false)
  submitter: string;

}
