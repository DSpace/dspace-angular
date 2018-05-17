import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';

import { mapsTo } from '../builders/build-decorators';
import { BitstreamFormat } from '../../shared/bitstream-format.model';
import { NormalizedObject } from './normalized-object.model';
import { ResourcePolicy } from '../../shared/resource-policy.model';

// While ResourcePolicyUUIDSerializer don't have a UUID, but need to be cachable: use this serializer. Remove it when the REST API returns them with UUID
const ResourcePolicyUUIDSerializer = {
  Serialize(json: any): any {
    // No need to serialize again, de ID is already serialized by the id field itself
    return {};
  },
  Deserialize(json: any): any {
    return 'resource-policy-' + json.id;
  }
};

@mapsTo(ResourcePolicy)
@inheritSerialization(NormalizedObject)
export class NormalizedResourcePolicy extends NormalizedObject {

  @autoserialize
  name: string;

  @autoserializeAs(String, 'groupUUID')
  group: string;

  @autoserialize
  id: string;

  @autoserializeAs(ResourcePolicyUUIDSerializer)
  uuid: string;
}
