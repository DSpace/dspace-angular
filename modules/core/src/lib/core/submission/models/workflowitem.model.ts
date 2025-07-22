import {
  deserializeAs,
  inheritSerialization,
} from 'cerialize';

import {
  IDToUUIDSerializer,
  inheritLinkAnnotations,
  typedObject,
} from '../../cache';
import { WORKFLOWITEM } from '../../eperson';
import { SubmissionObject } from './submission-object.model';

/**
 * A model class for a WorkflowItem.
 */
@typedObject
@inheritSerialization(SubmissionObject)
@inheritLinkAnnotations(SubmissionObject)
export class WorkflowItem extends SubmissionObject {
  static type = WORKFLOWITEM;

  /**
   * The universally unique identifier of this WorkflowItem
   * This UUID is generated client-side and isn't used by the backend.
   * It is based on the ID, so it will be the same for each refresh.
   */
  @deserializeAs(new IDToUUIDSerializer(WorkflowItem.type.value), 'id')
    uuid: string;
}
