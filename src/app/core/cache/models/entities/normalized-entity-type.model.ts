import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { EntityType } from '../../../shared/entities/entity-type.model';
import { ResourceType } from '../../../shared/resource-type';
import { mapsTo } from '../../builders/build-decorators';
import { IDToUUIDSerializer } from '../../it-to-uuid-serializer';
import { NormalizedObject } from '../normalized-object.model';

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
