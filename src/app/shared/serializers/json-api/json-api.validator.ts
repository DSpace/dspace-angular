import { Validator } from "jsonschema";
import * as schema from "./json-api.schema.json";

/**
 * A class to check the validity of a JSON API document
 */
export class JSONAPIValidator {

  /**
   * Checks the validity of a JSON API document
   *
   * This method throws an exception if the document doesn't
   * follow the JSON API spec. It completes silently otherwise.
   *
   * @param document the document to test
   */
  static validate(document: any): void {
    const validator = new Validator();
    const result = validator.validate(document, schema);
    if (!result.valid) {
      if (result.errors && result.errors.length > 0) {
        const message = result.errors
          .map((error) => error.message)
          .join("\n");
        throw new Error(message);
      }
      else {
        throw new Error("JSON API validation failed for an unknown reason");
      }
    }
  }
}
