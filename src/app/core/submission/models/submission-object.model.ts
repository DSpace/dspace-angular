import { Observable } from 'rxjs';

import { CacheableObject } from '../../cache/object-cache.reducer';
import { DSpaceObject } from '../../shared/dspace-object.model';
import { EPerson } from '../../eperson/models/eperson.model';
import { RemoteData } from '../../data/remote-data';
import { Collection } from '../../shared/collection.model';
import { Item } from '../../shared/item.model';
import { SubmissionDefinitionsModel } from '../../config/models/config-submission-definitions.model';
import { WorkspaceitemSectionsObject } from './workspaceitem-sections.model';

export interface SubmissionObjectError {
  message: string,
  paths: string[],
}

/**
 * An abstract model class for a SubmissionObject.
 */
export abstract class SubmissionObject extends DSpaceObject implements CacheableObject {

  /**
   * The workspaceitem/workflowitem identifier
   */
  id: string;

  /**
   * The workspaceitem/workflowitem identifier
   */
  uuid: string;

  /**
   * The workspaceitem/workflowitem last modified date
   */
  lastModified: Date;

  /**
   * The collection this submission applies to
   */
  collection: Observable<RemoteData<Collection>> | Collection;

  /**
   * The submission item
   */
  item: Observable<RemoteData<Item>> | Item;

  /**
   * The workspaceitem/workflowitem last sections data
   */
  sections: WorkspaceitemSectionsObject;

  /**
   * The configuration object that define this submission
   */
  submissionDefinition: Observable<RemoteData<SubmissionDefinitionsModel>> | SubmissionDefinitionsModel;

  /**
   * The workspaceitem submitter
   */
  submitter: Observable<RemoteData<EPerson>> | EPerson;

  /**
   * The workspaceitem/workflowitem last sections errors
   */
  errors: SubmissionObjectError[];
}
