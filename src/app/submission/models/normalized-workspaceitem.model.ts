import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { mapsTo, relationship } from '../../core/cache/builders/build-decorators';
import { NormalizedDSpaceObject } from '../../core/cache/models/normalized-dspace-object.model';
import { License } from '../../core/shared/license.model';
import { ResourceType } from '../../core/shared/resource-type';
import { ConfigType } from '../../core/shared/config/config-type';
import { NormalizedCollection } from '../../core/cache/models/normalized-collection.model';
import { NormalizedItem } from '../../core/cache/models/normalized-item.model';
import { WorkspaceitemSectionsObject } from './workspaceitem-sections.model';

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

  @autoserializeAs(ConfigType.SubmissionDefinition)
  submissionDefinition: ConfigType.SubmissionDefinition;

}
