import { v4 as uuid } from 'uuid';

export class ContentSource {
  uuid: string;

  enabled = false;

  provider: string;

  set: string;

  format: string;

  harvestType: number;

  constructor() {
    this.uuid = uuid();
  }
}
