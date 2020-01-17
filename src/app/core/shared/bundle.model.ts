import { DSpaceObject } from './dspace-object.model';
import { HALLink } from './hal-link.model';
import { ResourceType } from './resource-type';

export class Bundle extends DSpaceObject {
  static type = new ResourceType('bundle');

  /**
   * The bundle's name
   */
  name: string;

  _links: {
    self: HALLink;
    primaryBitstream: HALLink;
    parents: HALLink;
    owner: HALLink;
    bitstreams: HALLink;
  }
}
