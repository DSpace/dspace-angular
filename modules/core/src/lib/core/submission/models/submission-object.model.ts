import {
  autoserialize,
  deserialize,
  inheritSerialization,
} from 'cerialize';
import { Observable } from 'rxjs';

import {
  CacheableObject,
  link,
} from '../../cache';
import { SubmissionDefinitionsModel } from '../../config';
import {
  PaginatedList,
  RemoteData,
} from '../../data';
import {
  EPERSON,
  EPerson,
} from '../../eperson';
import {
  COLLECTION,
  Collection,
  DSpaceObject,
  HALLink,
  ITEM,
} from '../../shared';
import {
  SUPERVISION_ORDER,
  SupervisionOrder,
} from '../../supervision-order';
import { excludeFromEquals } from '../../utilities';
import { WorkspaceitemSectionsObject } from './workspaceitem-sections.model';

export interface SubmissionObjectError {
  message: string;
  paths: string[];
}

/**
 * An abstract model class for a SubmissionObject.
 */
@inheritSerialization(DSpaceObject)
export abstract class SubmissionObject extends DSpaceObject implements CacheableObject {

  @excludeFromEquals
  @autoserialize
  id: string;

  /**
   * The SubmissionObject last modified date
   */
  @autoserialize
  lastModified: Date;

  /**
   * The collection this submission applies to
   * Will be undefined unless the collection {@link HALLink} has been resolved.
   */
  @link(COLLECTION)
  collection?: Observable<RemoteData<Collection>> | Collection;

  /**
   * The SubmissionObject's last section's data
   */
  @autoserialize
  sections: WorkspaceitemSectionsObject;

  /**
   * The SubmissionObject's last section's errors
   */
  @autoserialize
  errors: SubmissionObjectError[];

  /**
   * The {@link HALLink}s for this SubmissionObject
   */
  @deserialize
  _links: {
    self: HALLink;
    collection: HALLink;
    item: HALLink;
    submissionDefinition: HALLink;
    submitter: HALLink;
    supervisionOrders: HALLink;
  };

  get self(): string {
    return this._links.self.href;
  }

  /**
   * The submission item
   * Will be undefined unless the item {@link HALLink} has been resolved.
   */
  @link(ITEM)
  /* This was changed from 'Observable<RemoteData<Item>> | Item' to 'any' to prevent issues in templates with async */
    item?: any;

  /**
   * The configuration object that define this submission
   * Will be undefined unless the submissionDefinition {@link HALLink} has been resolved.
   */
  @link(SubmissionDefinitionsModel.type)
  submissionDefinition?: Observable<RemoteData<SubmissionDefinitionsModel>> | SubmissionDefinitionsModel;

  /**
   * The submitter for this SubmissionObject
   * Will be undefined unless the submitter {@link HALLink} has been resolved.
   */
  @link(EPERSON)
  submitter?: Observable<RemoteData<EPerson>> | EPerson;

  /**
   * The submission supervision order
   * Will be undefined unless the workspace item {@link HALLink} has been resolved.
   */
  @link(SUPERVISION_ORDER)
  /* This was changed from 'Observable<RemoteData<WorkspaceItem>> | WorkspaceItem' to 'any' to prevent issues in templates with async */
    supervisionOrders?: Observable<RemoteData<PaginatedList<SupervisionOrder>>>;

}
