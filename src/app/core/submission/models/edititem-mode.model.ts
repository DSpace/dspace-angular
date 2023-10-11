import { CacheableObject } from '../../cache/cacheable-object.model';
import { typedObject } from '../../cache/builders/build-decorators';
import { ResourceType } from '../../shared/resource-type';
import { autoserialize, deserialize, deserializeAs } from 'cerialize';
import { IDToUUIDSerializer } from '../../cache/id-to-uuid-serializer';
import { HALLink } from '../../shared/hal-link.model';
import { excludeFromEquals } from '../../utilities/equals.decorators';

/**
 * Describes a EditItem mode
 */
@typedObject
export class EditItemMode extends CacheableObject {

  static type = new ResourceType('edititemmode');

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The universally unique identifier of this WorkspaceItem
   * This UUID is generated client-side and isn't used by the backend.
   * It is based on the ID, so it will be the same for each refresh.
   */
  @deserializeAs(new IDToUUIDSerializer(EditItemMode.type.value), 'name')
  uuid: string;

  /**
   * Name of the EditItem Mode
   */
  @autoserialize
  name: string;

  /**
   * Label used for i18n
   */
  @autoserialize
  label: string;

  /**
   * Name of the Submission Definition used
   * for this EditItem mode
   */
  @autoserialize
  submissionDefinition: string;

  /**
   * The {@link HALLink}s for this EditItemMode
   */
  @deserialize
  _links: {
    self: HALLink;
  };
}
