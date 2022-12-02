import { typedObject } from '../../cache/builders/build-decorators';
import { HALResource } from '../hal-resource.model';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { autoserialize, deserialize } from 'cerialize';
import { ResourceType } from '../resource-type';
import { BITSTREAM_AUTHRN } from './bitstream-authorization.resource-type';
import { HALLink } from '../hal-link.model';

/**
 * Class which is user do wrap Authorization response data for endpoint `/api/authrn`
 */
@typedObject
export class AuthrnBitstream implements HALResource {
  /**
   * The `authrn` object type.
   */
  static type = BITSTREAM_AUTHRN;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier of this Clarin License
   */
  @autoserialize
  id: number;

  /**
   * The name of this Clarin License object
   */
  @autoserialize
  errorName: string;

  @autoserialize
  responseStatusCode: string;

  /**
   * The {@link HALLink}s for this Clarin License
   */
  @deserialize
  _links: {
    self: HALLink
  };
}
