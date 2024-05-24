import {
  deserializeAs,
  inheritSerialization,
} from 'cerialize';
import { Observable } from 'rxjs';

import {
  inheritLinkAnnotations,
  link,
  typedObject,
} from '../../cache/builders/build-decorators';
import { IDToUUIDSerializer } from '../../cache/id-to-uuid-serializer';
import { PaginatedList } from '../../data/paginated-list.model';
import { RemoteData } from '../../data/remote-data';
import { ResourceType } from '../../shared/resource-type';
import { EditItemMode } from './edititem-mode.model';
import { SubmissionObject } from './submission-object.model';

/**
 * A model class for a EditItem.
 */
@typedObject
@inheritSerialization(SubmissionObject)
@inheritLinkAnnotations(SubmissionObject)
export class EditItem extends SubmissionObject {
  static type = new ResourceType('edititem');

  /**
   * The universally unique identifier of this WorkspaceItem
   * This UUID is generated client-side and isn't used by the backend.
   * It is based on the ID, so it will be the same for each refresh.
   */
  @deserializeAs(new IDToUUIDSerializer(EditItem.type.value), 'id')
    uuid: string;

  /**
   * Existing EditItem modes for current EditItem
   * Will be undefined unless the modes {@link HALLink} has been resolved.
   */
  @link(EditItemMode.type)
    modes?: Observable<RemoteData<PaginatedList<EditItemMode>>>;
  /**
   * Existing EditItem modes for current EditItem
   * Will be undefined unless the modes {@link HALLink} has been resolved.
   */
  @link(EditItemMode.type)
    edititemmodes?: Observable<RemoteData<PaginatedList<EditItemMode>>>;
}
