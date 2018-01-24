import { SubmissionObject } from './submission-object.model';
import { Collection } from '../../shared/collection.model';
import { EpersonModel } from '../../eperson/models/eperson.model';
import { Item } from '../../shared/item.model';
import { SubmissionDefinitionsModel } from '../../shared/config/config-submission-definitions.model';
import { WorkspaceitemSectionsObject } from './workspaceitem-sections.model';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../data/remote-data';

export class Workspaceitem extends SubmissionObject {

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

  submitter: EpersonModel;

  errors: WorkspaceItemError[];

}

export interface WorkspaceItemError {
  message: string,
  paths: string[],
}
