/**
 * Representing vocabulary properties
 */
export class VocabularyOptions {

  /**
   * The name of the vocabulary
   */
  name: string;

  /**
   * A boolean representing if value is closely related to a vocabulary entry or not
   */
  closed: boolean;

  /**
   * The type of the vocabulary (source): xml, authority, suggest
   */
  type?: string;

  constructor(name: string,
    closed: boolean = false, type: string = 'xml') {
    this.name = name;
    this.closed = closed;
    this.type = type;
  }
}
