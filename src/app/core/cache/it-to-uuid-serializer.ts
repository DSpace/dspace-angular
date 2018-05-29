import { hasValue } from '../../shared/empty.util';

export class IDToUUIDSerializer {
  constructor(private prefix: string) {
  }

  Serialize(uuid: string): any {
    return undefined; // ui-only uuid doesn't need to be sent back to the server
  }

  Deserialize(id: string): string {
    if (hasValue(id)) {
      return `${this.prefix}-${id}`;
    } else {
      return id;
    }

  }
}
