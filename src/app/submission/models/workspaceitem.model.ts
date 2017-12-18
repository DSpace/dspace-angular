import { Collection } from '../../core/shared/collection.model';
import { Item } from '../../core/shared/item.model';
import { WorkspaceitemSectionsObject } from './workspaceitem-sections.model';
import { SubmissionDefinitionsModel } from '../../core/shared/config/config-submission-definitions.model';

export interface WorkspaceitemObject {

  /**
   * The workspaceitem identifier
   */
  id: string;

  /**
   * The workspaceitem last modified date
   */
  lastModified: Date;

  collection: Collection;

  item: Item[];

  sections: WorkspaceitemSectionsObject;

  submissionDefinition: SubmissionDefinitionsModel;

  errors: WorkspaceItemError[];
}

export interface WorkspaceItemError {
  message: string,
  paths: string[],
}
