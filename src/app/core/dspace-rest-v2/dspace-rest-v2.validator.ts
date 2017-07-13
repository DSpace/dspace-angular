import { Validator } from 'jsonschema';

import schema from './dspace-rest-v2.schema.json'

/**
 * Verifies a document is a valid response from
 * a DSpace REST API v2
 */
export class DSpaceRESTv2Validator {

  constructor(private document: any) {

  }

  /**
   * Throws an exception if this.document isn't a valid response from
   * a DSpace REST API v2. Succeeds otherwise.
   */
  validate(): void {
    const validator = new Validator();
    const result = validator.validate(this.document, schema);
    if (!result.valid) {
      if (result.errors && result.errors.length > 0) {
        const message = result.errors
          .map((error) => error.message)
          .join('\n');
        throw new Error(message);
      } else {
        throw new Error('JSON API validation failed for an unknown reason');
      }
    }
  }

}
