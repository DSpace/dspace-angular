import { JSONAPISerializer } from "./json-api.serializer";
import { COLLECTIONS } from "../../../../backend/collections";

class TestModel {
  id: string;
  name: string;
}

const testmodels = [
  {
    "id": "d4466d54-d73b-4d8f-b73f-c702020baa14",
    "name": "Model 1",
  },
  {
    "id": "752a1250-949a-46ad-9bea-fbc45f0b656d",
    "name": "Model 2",
  }
];

describe("JSONAPISerializer", () => {

  describe("serialize", () => {

    it("should turn a model in to a valid JSON API document", () => {
      const serializer = new JSONAPISerializer<TestModel>();
      const doc = serializer.serialize(testmodels[0]);

      expect(testmodels[0].id).toBe(doc.data.id);
      expect(testmodels[0].name).toBe(doc.data.attributes.name);
    });

  });

  describe("serializeArray", () => {

    it("should turn an array of models in to a valid JSON API document", () => {
      const serializer = new JSONAPISerializer<TestModel>();
      const doc = serializer.serializeArray(testmodels);

      expect(testmodels[0].id).toBe(doc.data[0].id);
      expect(testmodels[0].name).toBe(doc.data[0].attributes.name);
      expect(testmodels[1].id).toBe(doc.data[1].id);
      expect(testmodels[1].name).toBe(doc.data[1].attributes.name);
    });

  });

  describe("deserialize", () => {

    it("should turn a valid JSON API document describing a single entity in to a valid model", () => {
      const serializer = new JSONAPISerializer<TestModel>();
      const doc = {
        "data": COLLECTIONS[0],
      };

      const model = serializer.deserialize(doc);

      expect(model.id).toBe(doc.data.id);
      expect(model.name).toBe(doc.data.attributes.name);
    });

  });

  describe("deserializeArray", () => {

    it("should turn a valid JSON API document describing a collection in to an array of valid models", () => {
      const serializer = new JSONAPISerializer<TestModel>();
      const doc = {
        "data": COLLECTIONS
      };

      const models = serializer.deserializeArray(doc);

      expect(models[0].id).toBe(doc.data[0].id);
      expect(models[0].name).toBe(doc.data[0].attributes.name);
      expect(models[1].id).toBe(doc.data[1].id);
      expect(models[1].name).toBe(doc.data[1].attributes.name);
    });

  });

});
