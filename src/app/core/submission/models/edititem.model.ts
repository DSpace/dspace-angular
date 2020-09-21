import { ResourceType } from '../../shared/resource-type';
import { typedObject, inheritLinkAnnotations } from '../../cache/builders/build-decorators';
import { inheritSerialization, deserializeAs } from 'cerialize';
import { SubmissionObject } from './submission-object.model';
import { IDToUUIDSerializer } from '../../cache/id-to-uuid-serializer';

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
}
