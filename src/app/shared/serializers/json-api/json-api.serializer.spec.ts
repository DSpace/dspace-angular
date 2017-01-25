import { JSONAPISerializer } from "./json-api.serializer";

class TestModel {
  id: string;
  name: string;
  parents?: Array<TestModel>;
}

const testModels = [
  {
    "id": "d4466d54-d73b-4d8f-b73f-c702020baa14",
    "name": "Model 1",
  },
  {
    "id": "752a1250-949a-46ad-9bea-fbc45f0b656d",
    "name": "Model 2",
  }
];

const testResponses = [
  {
    "id": "9e32a2e2-6b91-4236-a361-995ccdc14c60",
    "type": "testModels",
    "attributes": {
      "name": "A Test Model",
    },
    "relationships": {
      "parents": {
        "data": [
          { "type": "testModels", "id": "21539b1d-9ef1-4eda-9c77-49565b5bfb78" },
          { "type": "testModels", "id": "be8325f7-243b-49f4-8a4b-df2b793ff3b5" }
        ]
      }
    }
  },
  {
    "id": "598ce822-c357-46f3-ab70-63724d02d6ad",
    "type": "testModels",
    "attributes": {
      "name": "Another Test Model",
    },
    "relationships": {
      "parents": {
        "data": [
          { "type": "testModels", "id": "be8325f7-243b-49f4-8a4b-df2b793ff3b5" },
          { "type": "testModels", "id": "21539b1d-9ef1-4eda-9c77-49565b5bfb78" }
        ]
      }
    }
  }
];


describe("JSONAPISerializer", () => {

  describe("serialize", () => {

    it("should turn a model in to a valid JSON API document", () => {
      const serializer = new JSONAPISerializer<TestModel>();
      const doc = serializer.serialize(testModels[0]);

      expect(testModels[0].id).toBe(doc.data.id);
      expect(testModels[0].name).toBe(doc.data.attributes.name);
    });

  });

  describe("serializeArray", () => {

    it("should turn an array of models in to a valid JSON API document", () => {
      const serializer = new JSONAPISerializer<TestModel>();
      const doc = serializer.serializeArray(testModels);

      expect(testModels[0].id).toBe(doc.data[0].id);
      expect(testModels[0].name).toBe(doc.data[0].attributes.name);
      expect(testModels[1].id).toBe(doc.data[1].id);
      expect(testModels[1].name).toBe(doc.data[1].attributes.name);
    });

  });

  describe("deserialize", () => {

    it("should turn a valid JSON API document describing a single entity in to a valid model", () => {
      const serializer = new JSONAPISerializer<TestModel>();
      const doc = {
        "data": testResponses[0],
      };

      const model = serializer.deserialize(doc);

      expect(model.id).toBe(doc.data.id);
      expect(model.name).toBe(doc.data.attributes.name);
    });

    it("should retain relationship information", () => {
      const serializer = new JSONAPISerializer<TestModel>();
      const doc = {
        "data": testResponses[0],
      };

      const model = serializer.deserialize(doc);

      const modelParentIds = model.parents.map(parent => parent.id).sort();
      const responseParentIds = doc.data.relationships.parents.data.map(parent => parent.id).sort();

      expect(modelParentIds).toEqual(responseParentIds);
    });

    it("should throw an error when dealing with an invalid JSON API document", () => {
      const serializer = new JSONAPISerializer<TestModel>();
      const doc = testResponses[0];

      expect(() => {
        serializer.deserialize(doc);
      }).toThrow();
    });

    it("should throw an error when dealing with a JSON API document describing an array", () => {
      const serializer = new JSONAPISerializer<TestModel>();
      const doc = {
        "data": testResponses
      };

      expect(() => {
        serializer.deserialize(doc);
      }).toThrow();
    });

  });

  describe("deserializeArray", () => {

    it("should turn a valid JSON API document describing a collection of objects in to an array of valid models", () => {
      const serializer = new JSONAPISerializer<TestModel>();
      const doc = {
        "data": testResponses
      };

      const models = serializer.deserializeArray(doc);

      expect(models[0].id).toBe(doc.data[0].id);
      expect(models[0].name).toBe(doc.data[0].attributes.name);
      expect(models[1].id).toBe(doc.data[1].id);
      expect(models[1].name).toBe(doc.data[1].attributes.name);
    });

    it("should retain relationship information", () => {
      const serializer = new JSONAPISerializer<TestModel>();
      const doc = {
        "data": testResponses,
      };

      const models = serializer.deserializeArray(doc);

      models.forEach((model, i) => {
        const modelParentIds = model.parents.map(parent => parent.id).sort();
        const responseParentIds = doc.data[i].relationships.parents.data.map(parent => parent.id).sort();

        expect(modelParentIds).toEqual(responseParentIds);
      });
    });

    it("should throw an error when dealing with an invalid JSON API document", () => {
      const serializer = new JSONAPISerializer<TestModel>();
      const doc = testResponses[0];

      expect(() => {
        serializer.deserializeArray(doc);
      }).toThrow();
    });

    it("should throw an error when dealing with a JSON API document describing a single model", () => {
      const serializer = new JSONAPISerializer<TestModel>();
      const doc = {
        "data": testResponses[0]
      };

      expect(() => {
        serializer.deserializeArray(doc);
      }).toThrow();
    });

  });

});
