import {
  autoserialize,
  autoserializeAs,
  deserialize,
} from 'cerialize';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { typedObject } from '../cache/builders/build-decorators';
import { GenericConstructor } from '../shared/generic-constructor';
import { HALLink } from '../shared/hal-link.model';
import { HALResource } from '../shared/hal-resource.model';
import { ResourceType } from '../shared/resource-type';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { METADATA_BITSTREAM } from './metadata-bitstream.resource-type';
import { FileInfo } from './file-info.model';

/**
 * Class that represents a MetadataBitstream
 */
@typedObject
export class MetadataBitstream extends ListableObject implements HALResource {
  static type = METADATA_BITSTREAM;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier of this metadata field
   */
  @autoserialize
  id: number;

  /**
   * The name of this bitstream
   */
  @autoserialize
  name: string;

  /**
   * The description of this bitstream
   */
  @autoserialize
  description: string;

  /**
   * The fileSize of this bitstream
   */
  @autoserialize
  fileSize: string;

  /**
   * The checksum of this bitstream
   */
  @autoserialize
  checksum: string;

  /**
   * The fileInfo of this bitstream
   */
  @autoserializeAs(FileInfo, 'fileInfo') fileInfo: FileInfo[];

  /**
   * The format of this bitstream
   */
  @autoserialize
  format: string;

  /**
   * The href of this bitstream
   */
  @autoserialize
  href: string;

  /**
   * The canPreview of this bitstream
   */
  @autoserialize
  canPreview: boolean;

  /**
   * The {@link HALLink}s for this MetadataField
   */
  @deserialize
  _links: {
    self: HALLink;
    schema: HALLink;
  };

  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    return [this.constructor as GenericConstructor<ListableObject>];
  }
}
export { FileInfo };

