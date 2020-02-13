import { HALLink } from './hal-link.model';

export class HALResource {
  _links: {
    self: HALLink
    [k: string]: HALLink;
  };
}
