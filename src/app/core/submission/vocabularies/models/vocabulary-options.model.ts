/**
 * Representing vocabulary properties
 */
export class VocabularyOptions {

  /**
   * The name of the vocabulary
   */
  name: string;

  /**
   * The metadata field name (e.g. "dc.type") for which the vocabulary is used:
   */
  metadata: string;

  /**
   * The uuid of the collection where the item is being submitted
   */
  scope: string;

  /**
   * A boolean representing if value is closely related to a vocabulary entry or not
   */
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
