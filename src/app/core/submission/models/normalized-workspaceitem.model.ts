import { autoserialize, inheritSerialization } from 'cerialize';

import { Workspaceitem } from './workspaceitem.model';
import { NormalizedSubmissionObject } from './normalized-submission-object.model';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { ResourceType } from '../../shared/resource-type';
import { Workflowitem } from './workflowitem.model';

@mapsTo(Workspaceitem)
@inheritSerialization(NormalizedDSpaceObject)
@inheritSerialization(NormalizedSubmissionObject)
export class NormalizedWorkspaceItem extends NormalizedSubmissionObject<Workflowitem> {

  @autoserialize
  @relationship(ResourceType.Collection, false)
  collection: string;

  @autoserialize
  @relationship(ResourceType.Item, false)
  item: string;

  @autoserialize
  @relationship(ResourceType.SubmissionDefinition, false)
  submissionDefinition: string;

  @autoserialize
  @relationship(ResourceType.EPerson, false)
  submitter: string;
}
