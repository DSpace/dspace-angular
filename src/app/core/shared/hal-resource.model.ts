import { HALLink } from './hal-link.model';

export class HALResource {

  get self(): string {
    return this._links.self.href;
  }

  _links: {
    self: HALLink
    [k: string]: HALLink;
  };
}
