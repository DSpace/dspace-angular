import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { Relationship } from '../../../shared/entities/relationship.model';
import { ResourceType } from '../../../shared/resource-type';
import { mapsTo, relationship } from '../../builders/build-decorators';
import { NormalizedObject } from '../normalized-object.model';
import { IDToUUIDSerializer } from '../../id-to-uuid-serializer';

@mapsTo(Relationship)
@inheritSerialization(NormalizedObject)
export class NormalizedRelationship extends NormalizedObject {

  @autoserialize
  id: string;

  @autoserialize
  leftId: string;

  @autoserialize
  place: number;

  @autoserialize
  rightId: string;

  @autoserialize
  @relationship(ResourceType.RelationshipType, false)
  relationshipType: string;

  @autoserializeAs(new IDToUUIDSerializer(ResourceType.Relationship), 'id')
  uuid: string;
}
