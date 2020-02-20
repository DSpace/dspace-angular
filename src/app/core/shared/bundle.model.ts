import { deserialize, inheritSerialization } from 'cerialize';
import { typedObject } from '../cache/builders/build-decorators';
import { BUNDLE } from './bundle.resource-type';
import { DSpaceObject } from './dspace-object.model';
import { HALLink } from './hal-link.model';

@typedObject
@inheritSerialization(DSpaceObject)
export class Bundle extends DSpaceObject {
  static type = BUNDLE;

  /**
   * The {@link HALLink}s for this Bundle
   */
  @deserialize
  _links: {
    self: HALLink;
    primaryBitstream: HALLink;
    bitstreams: HALLink;
  }
}
