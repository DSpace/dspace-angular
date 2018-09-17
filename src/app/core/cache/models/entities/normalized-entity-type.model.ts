import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { EntityType } from '../../../shared/entities/entity-type.model';
import { ResourceType } from '../../../shared/resource-type';
import { mapsTo } from '../../builders/build-decorators';
import { NormalizedObject } from '../normalized-object.model';
import { IDToUUIDSerializer } from '../../id-to-uuid-serializer';

@mapsTo(EntityType)
@inheritSerialization(NormalizedObject)
export class NormalizedEntityType extends NormalizedObject {

  @autoserialize
  label: string;

  @autoserialize
  id: string;

  @autoserializeAs(new IDToUUIDSerializer(ResourceType.EntityType), 'id')
  uuid: string;
}
