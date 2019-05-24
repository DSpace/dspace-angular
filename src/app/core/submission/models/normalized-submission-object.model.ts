import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';

import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { WorkspaceitemSectionsObject } from './workspaceitem-sections.model';
import { SubmissionObjectError } from './submission-object.model';
import { DSpaceObject } from '../../shared/dspace-object.model';

/**
 * An abstract model class for a NormalizedSubmissionObject.
 */
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedSubmissionObject<T extends DSpaceObject> extends NormalizedDSpaceObject<T> {

  /**
   * The workspaceitem/workflowitem identifier
   */
  @autoserialize
  id: string;

  /**
   * The workspaceitem/workflowitem identifier
   */
  @autoserializeAs(String, 'id')
  uuid: string;

  /**
   * The workspaceitem/workflowitem last modified date
   */
  @autoserialize
  lastModified: Date;

  /**
   * The workspaceitem/workflowitem last sections data
   */
  @autoserialize
  sections: WorkspaceitemSectionsObject;

  /**
   * The workspaceitem/workflowitem last sections errors
   */
  @autoserialize
  errors: SubmissionObjectError[];
}
