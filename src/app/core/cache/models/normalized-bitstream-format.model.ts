import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';

import { mapsTo } from '../builders/build-decorators';
import { BitstreamFormat } from '../../shared/bitstream-format.model';
import { NormalizedObject } from './normalized-object.model';
import { NormalizedDSpaceObject } from './normalized-dspace-object.model';

// While BitstreamFormats don't have a UUID, but need to be cachable: use this serializer. Remove it when the REST API returns them with UUID
const BitstreamFormatUUIDSerializer = {
  Serialize(json: any): any {
    // No need to serialize again, de ID is already serialized by the id field itself
    return {};
  },
  Deserialize(json: any): any {
    return 'bitstream-format-' + json.id;
  }
};

@mapsTo(BitstreamFormat)
@inheritSerialization(NormalizedObject)
export class NormalizedBitstreamFormat extends NormalizedObject {

  @autoserialize
  shortDescription: string;

  @autoserialize
  description: string;

  @autoserialize
  mimetype: string;

  @autoserialize
  supportLevel: number;

  @autoserialize
  internal: boolean;

  @autoserialize
  extensions: string;

  @autoserialize
  id: string;

  @autoserializeAs(BitstreamFormatUUIDSerializer)
  uuid: string;
}
