import { JSONAPIValidator } from "./json-api.validator";

describe("JSONAPIValidator", () => {

  // The goal is to test whether the validator succeeds with a valid doc
  // and throws an error with an invalid one, the goal is not to test
  // all the intricacies of the spec, as the spec's jsonschema is supplied
  // by the json-api team and assumed to be correct
  describe("validate", () => {

    it("should succeed when the document follows the JSON API spec", () => {
      expect(() => {
        JSONAPIValidator.validate({ data: {
          type: "foo",
          id: "bar"
        }});
      }).not.toThrow();
    });

    it("should throw an error when the document doesn't follow the JSON API spec", () => {
      expect(() => {
        JSONAPIValidator.validate({ foo: "bar" });
      }).toThrow();
    });

  });

});
