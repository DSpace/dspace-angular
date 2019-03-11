import { autoserialize, inheritSerialization } from 'cerialize';

import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { Workflowitem } from './workflowitem.model';
import { NormalizedSubmissionObject } from './normalized-submission-object.model';
import { ResourceType } from '../../shared/resource-type';

@mapsTo(Workflowitem)
@inheritSerialization(NormalizedSubmissionObject)
export class NormalizedWorkflowItem extends NormalizedSubmissionObject<Workflowitem> {

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
