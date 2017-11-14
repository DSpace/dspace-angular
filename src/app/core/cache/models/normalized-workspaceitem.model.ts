import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { mapsTo, relationship } from '../builders/build-decorators';
import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { License } from '../../shared/license.model';
import { ResourceType } from '../../shared/resource-type';
import { ConfigType } from '../../shared/config/config-type';
import { NormalizedCollection } from './normalized-collection.model';
import { NormalizedItem } from './normalized-item.model';

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

  @autoserializeAs(ConfigType.SubmissionDefinition)
  submissionDefinition: ConfigType.SubmissionDefinition;

}
