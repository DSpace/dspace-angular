import { BITSTREAM_CHECKSUM } from './bitstream-checksum.resource';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { autoserialize, deserialize } from 'cerialize';
import { ResourceType } from './resource-type';
import { HALLink } from './hal-link.model';
import { typedObject } from '../cache/builders/build-decorators';
import { TypedObject } from '../cache/typed-object.model';


/**
 * Model class containing the checksums of a bitstream (local, S3, DB)
 */
@typedObject
export class BitstreamChecksum extends TypedObject {
  /**
   * The `bitstreamchecksum` object type.
   */
  static type = BITSTREAM_CHECKSUM;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier of this BitstreamChecksum object
   */
  @autoserialize
  id: string;

  /**
   * The checksum of the active store (local/S3)
   */
  @autoserialize
  activeStore: CheckSum;

  /**
   * The checksum from the database
   */
  @autoserialize
  databaseChecksum: CheckSum;

  /**
   * The checksum of the synchronized store (S3, local)
   */
  @autoserialize
  synchronizedStore: CheckSum;

  @deserialize
  _links: {
    self: HALLink
  };
}

/**
 * Model class containing a checksum value and algorithm
 */
export interface CheckSum {
  checkSumAlgorithm: string;
  value: string;
}
