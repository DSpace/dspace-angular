import { CacheableObject } from '../../cache/object-cache.reducer';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { DSpaceObject } from '../../shared/dspace-object.model';
import { Eperson } from '../../eperson/models/eperson.model';
import { RemoteData } from '../../data/remote-data';
import { Collection } from '../../shared/collection.model';
import { Item } from '../../shared/item.model';
import { SubmissionDefinitionsModel } from '../../shared/config/config-submission-definitions.model';
import { Observable } from 'rxjs/Observable';
import { WorkspaceitemSectionsObject } from './workspaceitem-sections.model';

export interface SubmissionObjectError {
  message: string,
  paths: string[],
}

/**
 * An abstract model class for a DSpaceObject.
 */
export abstract class SubmissionObject extends DSpaceObject implements CacheableObject, ListableObject {

  /**
   * The workspaceitem identifier
   */
  id: string;

  /**
   * The workspaceitem last modified date
   */
  lastModified: Date;

  collection: Observable<RemoteData<Collection[]>> | Collection[];

  item: Observable<RemoteData<Item[]>> | Item[];

  sections: WorkspaceitemSectionsObject;

  submissionDefinition: SubmissionDefinitionsModel;

  submitter: Observable<RemoteData<Eperson[]>> | Eperson[];

  errors: SubmissionObjectError[];
}
