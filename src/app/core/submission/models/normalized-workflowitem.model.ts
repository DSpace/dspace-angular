import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { Workflowitem } from './workflowitem.model';
import { NormalizedWorkspaceItem } from './normalized-workspaceitem.model';
import { NormalizedSubmissionObject } from './normalized-submission-object.model';
import { ResourceType } from '../../shared/resource-type';
import { SubmissionDefinitionsModel } from '../../shared/config/config-submission-definitions.model';
import { WorkspaceitemSectionsObject } from './workspaceitem-sections.model';
import { WorkspaceItemError } from './workspaceitem.model';

@mapsTo(Workflowitem)
@inheritSerialization(NormalizedWorkspaceItem)
export class NormalizedWorkflowItem extends NormalizedSubmissionObject {

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

  @autoserialize
  @relationship(ResourceType.Collection, true)
  collection: string[];

  @autoserialize
  @relationship(ResourceType.Item, true)
  item: string[];

  @autoserialize
  sections: WorkspaceitemSectionsObject;

  @autoserializeAs(SubmissionDefinitionsModel)
  submissionDefinition: SubmissionDefinitionsModel;

  @autoserialize
  @relationship(ResourceType.Eperson, true)
  submitter: string[];

  @autoserialize
  errors: WorkspaceItemError[]
}
