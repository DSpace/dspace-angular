import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { ResourcePolicy } from '../../shared/resource-policy.model';

import { mapsTo } from '../builders/build-decorators';
import { IDToUUIDSerializer } from '../it-to-uuid-serializer';
import { NormalizedObject } from './normalized-object.model';

@mapsTo(ResourcePolicy)
@inheritSerialization(NormalizedObject)
export class NormalizedResourcePolicy extends NormalizedObject {

  @autoserialize
  name: string;

  @autoserializeAs(String, 'groupUUID')
  group: string;

  @autoserialize
  id: string;

  @autoserializeAs(new IDToUUIDSerializer('resource-policy'), 'id')
  uuid: string;
}
