import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { mapsTo } from '../../core/cache/builders/build-decorators';
import { NormalizedDSpaceObject } from '../../core/cache/models/normalized-dspace-object.model';
import { License } from '../../core/shared/license.model';
import { NormalizedCollection } from '../../core/cache/models/normalized-collection.model';
import { NormalizedItem } from '../../core/cache/models/normalized-item.model';
import { WorkspaceitemSectionsObject } from './workspaceitem-sections.model';
import { SubmissionDefinitionsModel } from '../../core/shared/config/config-submission-definitions.model';
import { WorkspaceItemError } from './workspaceitem.model';

@mapsTo(License)
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

  @autoserializeAs(NormalizedItem)
  item: NormalizedItem[];

  @autoserialize
  sections: WorkspaceitemSectionsObject;

  @autoserializeAs(SubmissionDefinitionsModel)
  submissionDefinition: SubmissionDefinitionsModel;

  @autoserialize
  errors: WorkspaceItemError[]
}
