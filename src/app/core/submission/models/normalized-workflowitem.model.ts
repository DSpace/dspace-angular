import { autoserialize, inheritSerialization } from 'cerialize';

import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { WorkflowItem } from './workflowitem.model';
import { NormalizedSubmissionObject } from './normalized-submission-object.model';
import { Collection } from '../../shared/collection.model';
import { Item } from '../../shared/item.model';
import { SubmissionDefinitionsModel } from '../../config/models/config-submission-definitions.model';
import { EPerson } from '../../eperson/models/eperson.model';

/**
 * An model class for a NormalizedWorkflowItem.
 */
@mapsTo(WorkflowItem)
@inheritSerialization(NormalizedSubmissionObject)
export class NormalizedWorkflowItem extends NormalizedSubmissionObject<WorkflowItem> {

  /**
   * The collection this workflowitem belonging to
   */
  @autoserialize
  @relationship(Collection, false)
  collection: string;

  /**
   * The item created with this workflowitem
   */
  @autoserialize
  @relationship(Item, false)
  item: string;

  /**
   * The configuration object that define this workflowitem
   */
  @autoserialize
  @relationship(SubmissionDefinitionsModel, false)
  submissionDefinition: string;

  /**
   * The EPerson who submit this workflowitem
   */
  @autoserialize
  @relationship(EPerson, false)
  submitter: string;

}
