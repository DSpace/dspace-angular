export class AuthorityOptions {
  name: string;
  metadata: string;
  scope: string;
  closed: boolean;

  constructor(name: string,
              metadata: string,
              scope: string,
              closed: boolean = false) {
    this.name = name;
    this.metadata = metadata;
    this.scope = scope;
    this.closed = closed;
  }
}
