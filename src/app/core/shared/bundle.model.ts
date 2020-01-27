import { BUNDLE } from './bundle.resource-type';
import { DSpaceObject } from './dspace-object.model';
import { HALLink } from './hal-link.model';

export class Bundle extends DSpaceObject {
  static type = BUNDLE;

  /**
   * The bundle's name
   */
  name: string;

  _links: {
    self: HALLink;
    primaryBitstream: HALLink;
    bitstreams: HALLink;
  }
}
