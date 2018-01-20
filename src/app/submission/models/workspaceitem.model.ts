import { Collection } from '../../core/shared/collection.model';
import { Item } from '../../core/shared/item.model';
import { WorkspaceitemSectionsObject } from './workspaceitem-sections.model';
import { SubmissionDefinitionsModel } from '../../core/shared/config/config-submission-definitions.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { EpersonModel } from '../../core/eperson/models/eperson.model';

export class Workspaceitem extends DSpaceObject {

  /**
   * The workspaceitem identifier
   */
  id: string;

  /**
   * The workspaceitem last modified date
   */
  lastModified: Date;

  collection: Collection;

  item: Item;

  sections: WorkspaceitemSectionsObject;

  submissionDefinition: SubmissionDefinitionsModel;

  submitter: EpersonModel;

  errors: WorkspaceItemError[];

  get metadata() {
    return this.item.metadata;
  }
}

export interface WorkspaceItemError {
  message: string,
  paths: string[],
}
