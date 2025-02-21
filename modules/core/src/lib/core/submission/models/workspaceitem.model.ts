import {
  deserializeAs,
  inheritSerialization,
} from 'cerialize';

import {
  inheritLinkAnnotations,
  typedObject,
} from '../../cache';
import { IDToUUIDSerializer } from '../../cache';
import { WORKSPACEITEM } from '../../eperson';
import { SubmissionObject } from './submission-object.model';

/**
 * A model class for a WorkspaceItem.
 */
@typedObject
@inheritSerialization(SubmissionObject)
@inheritLinkAnnotations(SubmissionObject)
export class WorkspaceItem extends SubmissionObject {
  static type = WORKSPACEITEM;

  /**
   * The universally unique identifier of this WorkspaceItem
   * This UUID is generated client-side and isn't used by the backend.
   * It is based on the ID, so it will be the same for each refresh.
   */
  @deserializeAs(new IDToUUIDSerializer(WorkspaceItem.type.value), 'id')
    uuid: string;
}
