import { CacheableObject } from '../../cache/object-cache.reducer';
import { typedObject } from '../../cache/builders/build-decorators';
import { METADATACOMPONENT } from './metadata-component.resource-type';
import { autoserialize, deserialize } from 'cerialize';
import { HALLink } from '../../shared/hal-link.model';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { ResourceType } from '../../shared/resource-type';

interface Row {
  fields: Field[];
}
interface Bitstream {
  bundle: string;
  metadataField: string;
  metadataValue: string;
}
interface Field {
  metadata?: string;
  bitstream?: Bitstream;
  label: string;
  rendering: string;
  fieldType: string;
  style: string;
}

/**
 * Describes a type of metadatacomponent
 */
@typedObject
export class MetadataComponent extends CacheableObject {
  static type = METADATACOMPONENT;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier of the related Box (shortname)
   */
  @autoserialize
  id: string;

  @autoserialize
  rows: Row[];

  /**
   * The {@link HALLink}s for this metadatacomponent
   */
  @deserialize
  _links: {
      self: HALLink
  };
}
