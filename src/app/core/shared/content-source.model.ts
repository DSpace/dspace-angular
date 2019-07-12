import { v4 as uuid } from 'uuid';

export class ContentSource {
  /**
   * Unique identifier
   */
  uuid: string;

  /**
   * Does this collection harvest its content from an external source ?
   */
  enabled = false;

  /**
   * OAI Provider
   */
  provider: string;

  /**
   * OAI Specific set ID
   */
  set: string;

  /**
   * Metadata Format
   */
  format = 'dc';

  /**
   * Type of content being harvested
   */
  harvest = 3;

  constructor() {
    this.uuid = uuid();
  }
}
