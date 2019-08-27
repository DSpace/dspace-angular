import { autoserialize, inheritSerialization } from 'cerialize';

import { WorkspaceItem } from './workspaceitem.model';
import { NormalizedSubmissionObject } from './normalized-submission-object.model';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { Item } from '../../shared/item.model';
import { Collection } from '../../shared/collection.model';
import { SubmissionDefinitionModel } from '../../config/models/config-submission-definition.model';
import { EPerson } from '../../eperson/models/eperson.model';

/**
 * An model class for a NormalizedWorkspaceItem.
 */
@mapsTo(WorkspaceItem)
@inheritSerialization(NormalizedDSpaceObject)
@inheritSerialization(NormalizedSubmissionObject)
export class NormalizedWorkspaceItem extends NormalizedSubmissionObject<WorkspaceItem> {

  /**
   * The collection this workspaceitem belonging to
   */
  @autoserialize
  @relationship(Collection, false)
  collection: string;

  /**
   * The item created with this workspaceitem
   */
  @autoserialize
  @relationship(Item, false)
  item: string;

  /**
   * The configuration object that define this workspaceitem
   */
  @autoserialize
  @relationship(SubmissionDefinitionModel, false)
  submissionDefinition: string;

  /**
   * The EPerson who submit this workspaceitem
   */
  @autoserialize
  @relationship(EPerson, false)
  submitter: string;
}
