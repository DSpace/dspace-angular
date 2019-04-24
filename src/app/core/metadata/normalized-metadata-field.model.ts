import { autoserialize, deserialize } from 'cerialize';
import { mapsTo, relationship } from '../cache/builders/build-decorators';
import { ResourceType } from '../shared/resource-type';
import { resourceType } from '../shared/resource-type.decorator';
import { MetadataField } from './metadata-field.model';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';

@mapsTo(MetadataField)
@resourceType(ResourceType.MetadataField)
export class NormalizedMetadataField extends NormalizedObject<MetadataField> implements ListableObject {
  @autoserialize
  id: number;

  @autoserialize
  self: string;

  @autoserialize
  element: string;

  @autoserialize
  qualifier: string;

  @autoserialize
  scopeNote: string;

  @deserialize
  @relationship(ResourceType.MetadataSchema)
  schema: string;
}
