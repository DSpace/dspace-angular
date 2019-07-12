import { v4 as uuid } from 'uuid';

/**
 * A model class that holds information about the Content Source of a Collection
 */
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
    // TODO: Remove this once the Content Source is fetched from the REST API and a custom generated UUID is not necessary anymore
    this.uuid = uuid();
  }
}
