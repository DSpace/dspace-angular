import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { RelationshipType } from '../../../shared/entities/relationship-type.model';
import { ResourceType } from '../../../shared/resource-type';
import { mapsTo, relationship } from '../../builders/build-decorators';
import { IDToUUIDSerializer } from '../../it-to-uuid-serializer';
import { NormalizedDSpaceObject } from '../normalized-dspace-object.model';
import { NormalizedObject } from '../normalized-object.model';

@mapsTo(RelationshipType)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedRelationshipType extends NormalizedObject {
  @autoserialize
  id: string;

  @autoserialize
  leftLabel: string;

  @autoserialize
  leftMaxCardinality: number;

  @autoserialize
  leftMinCardinality: number;

  @autoserialize
  rightLabel: string;

  @autoserialize
  rightMaxCardinality: number;

  @autoserialize
  rightMinCardinality: number;

  @autoserialize
  @relationship(ResourceType.EntityType, false)
  leftType: string;

  @autoserialize
  @relationship(ResourceType.EntityType, false)
  rightType: string;

  @autoserializeAs(new IDToUUIDSerializer(ResourceType.RelationshipType), 'id')
  uuid: string;
}
