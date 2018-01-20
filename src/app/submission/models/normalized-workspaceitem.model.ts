import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { mapsTo, relationship } from '../../core/cache/builders/build-decorators';
import { NormalizedDSpaceObject } from '../../core/cache/models/normalized-dspace-object.model';
import { License } from '../../core/shared/license.model';
import { NormalizedCollection } from '../../core/cache/models/normalized-collection.model';
import { NormalizedItem } from '../../core/cache/models/normalized-item.model';

import { SubmissionDefinitionsModel } from '../../core/shared/config/config-submission-definitions.model';
import { WorkspaceItemError, Workspaceitem } from './workspaceitem.model';
import { WorkspaceitemSectionsObject } from './workspaceitem-sections.model';
import { ResourceType } from '../../core/shared/resource-type';
import { EpersonModel } from '../../core/eperson/models/eperson.model';

@mapsTo(Workspaceitem)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedWorkspaceItem extends NormalizedDSpaceObject {

  /**
   * The workspaceitem identifier
   */
  @autoserialize
  id: string;

  /**
   * The workspaceitem last modified date
   */
  @autoserialize
  lastModified: Date;

  @autoserializeAs(NormalizedCollection)
  collection: NormalizedCollection[];

  @autoserialize
  @relationship(ResourceType.Item, true)
  item: string[];

  @autoserialize
  sections: WorkspaceitemSectionsObject;

  @autoserializeAs(SubmissionDefinitionsModel)
  submissionDefinition: SubmissionDefinitionsModel;

  @autoserializeAs(EpersonModel)
  submitter: EpersonModel;

  @autoserialize
  errors: WorkspaceItemError[]
}
