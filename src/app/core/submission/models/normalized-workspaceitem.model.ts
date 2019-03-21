import { autoserialize, inheritSerialization } from 'cerialize';

import { Workspaceitem } from './workspaceitem.model';
import { NormalizedSubmissionObject } from './normalized-submission-object.model';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { ResourceType } from '../../shared/resource-type';
import { Workflowitem } from './workflowitem.model';

/**
 * An model class for a NormalizedWorkspaceItem.
 */
@mapsTo(Workspaceitem)
@inheritSerialization(NormalizedDSpaceObject)
@inheritSerialization(NormalizedSubmissionObject)
export class NormalizedWorkspaceItem extends NormalizedSubmissionObject<Workflowitem> {

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
