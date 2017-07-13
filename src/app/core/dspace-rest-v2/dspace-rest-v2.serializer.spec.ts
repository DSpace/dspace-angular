import { autoserialize, autoserializeAs } from 'cerialize';

import { DSpaceRESTv2Serializer } from './dspace-rest-v2.serializer';

class TestModel {
  @autoserialize
  id: string;

  @autoserialize
  name: string;

  @autoserializeAs(TestModel)
  parents?: TestModel[];
}

const testModels = [
  {
    id: 'd4466d54-d73b-4d8f-b73f-c702020baa14',
    name: 'Model 1',
  },
  {
    id: '752a1250-949a-46ad-9bea-fbc45f0b656d',
    name: 'Model 2',
  }
];

const testResponses = [
  {
    _links: {
      self: '/testmodels/9e32a2e2-6b91-4236-a361-995ccdc14c60',
      parents: [
        { href: '/testmodels/21539b1d-9ef1-4eda-9c77-49565b5bfb78' },
        { href: '/testmodels/be8325f7-243b-49f4-8a4b-df2b793ff3b5' }
      ]
    },
    id: '9e32a2e2-6b91-4236-a361-995ccdc14c60',
    type: 'testModels',
    name: 'A Test Model'
  },
  {
    _links: {
      self: '/testmodels/598ce822-c357-46f3-ab70-63724d02d6ad',
      parents: [
        { href: '/testmodels/be8325f7-243b-49f4-8a4b-df2b793ff3b5' },
        { href: '/testmodels/21539b1d-9ef1-4eda-9c77-49565b5bfb78' }
      ]
    },
    id: '598ce822-c357-46f3-ab70-63724d02d6ad',
    type: 'testModels',
    name: 'Another Test Model'
  }
];

const parentHrefRegex = /^\/testmodels\/(.+)$/g;

describe('DSpaceRESTv2Serializer', () => {

  describe('serialize', () => {

    it('should turn a model in to a valid document', () => {
      const serializer = new DSpaceRESTv2Serializer(TestModel);
      const doc = serializer.serialize(testModels[0]);
      expect(testModels[0].id).toBe(doc.id);
      expect(testModels[0].name).toBe(doc.name);
    });

  });

  describe('serializeArray', () => {

    it('should turn an array of models in to a valid document', () => {
      const serializer = new DSpaceRESTv2Serializer(TestModel);
      const doc = serializer.serializeArray(testModels);

      expect(testModels[0].id).toBe(doc[0].id);
      expect(testModels[0].name).toBe(doc[0].name);
      expect(testModels[1].id).toBe(doc[1].id);
      expect(testModels[1].name).toBe(doc[1].name);
    });

  });

  describe('deserialize', () => {

    it('should turn a valid document describing a single entity in to a valid model', () => {
      const serializer = new DSpaceRESTv2Serializer(TestModel);
      const model = serializer.deserialize(testResponses[0]);

      expect(model.id).toBe(testResponses[0].id);
      expect(model.name).toBe(testResponses[0].name);
    });

    // TODO: cant implement/test this yet - depends on how relationships
    // will be handled in the rest api
    // it('should retain relationship information', () => {
    //   const serializer = new DSpaceRESTv2Serializer(TestModel);
    //   const doc = {
    //     '_embedded': testResponses[0],
    //   };
    //
    //   const model = serializer.deserialize(doc);
    //
    //   console.log(model);
    //
    //   const modelParentIds = model.parents.map(parent => parent.id).sort();
    //   const responseParentIds = doc._embedded._links.parents
    //     .map(parent => parent.href)
    //     .map(href => href.replace(parentHrefRegex, '$1'))
    //     .sort();
    //
    //   expect(modelParentIds).toEqual(responseParentIds);
    // });

    // TODO enable once validation is enabled in the serializer
    // it('should throw an error when dealing with an invalid document', () => {
    //   const serializer = new DSpaceRESTv2Serializer(TestModel);
    //   const doc = testResponses[0];
    //
    //   expect(() => {
    //     serializer.deserialize(doc);
    //   }).toThrow();
    // });

    it('should throw an error when dealing with a document describing an array', () => {
      const serializer = new DSpaceRESTv2Serializer(TestModel);
      expect(() => {
        serializer.deserialize(testResponses);
      }).toThrow();
    });

  });

  describe('deserializeArray', () => {

    // TODO: rewrite to incorporate normalisation.
    // it('should turn a valid document describing a collection of objects in to an array of valid models', () => {
    //   const serializer = new DSpaceRESTv2Serializer(TestModel);
    //   const doc = {
    //     '_embedded': testResponses
    //   };
    //
    //   const models = serializer.deserializeArray(doc);
    //
    //   expect(models[0].id).toBe(doc._embedded[0].id);
    //   expect(models[0].name).toBe(doc._embedded[0].name);
    //   expect(models[1].id).toBe(doc._embedded[1].id);
    //   expect(models[1].name).toBe(doc._embedded[1].name);
    // });

    // TODO: cant implement/test this yet - depends on how relationships
    // will be handled in the rest api
    // it('should retain relationship information', () => {
    //   const serializer = new DSpaceRESTv2Serializer(TestModel);
    //   const doc = {
    //     '_embedded': testResponses,
    //   };
    //
    //   const models = serializer.deserializeArray(doc);
    //
    //   models.forEach((model, i) => {
    //     const modelParentIds = model.parents.map(parent => parent.id).sort();
    //     const responseParentIds = doc._embedded[i]._links.parents
    //       .map(parent => parent.href)
    //       .map(href => href.replace(parentHrefRegex, '$1'))
    //       .sort();
    //
    //     expect(modelParentIds).toEqual(responseParentIds);
    //   });
    // });

    // TODO enable once validation is enabled in the serializer
    // it('should throw an error when dealing with an invalid document', () => {
    //   const serializer = new DSpaceRESTv2Serializer(TestModel);
    //   const doc = testResponses[0];
    //
    //   expect(() => {
    //     serializer.deserializeArray(doc);
    //   }).toThrow();
    // });

    it('should throw an error when dealing with a document describing a single model', () => {
      const serializer = new DSpaceRESTv2Serializer(TestModel);
      const doc = {
        _embedded: testResponses[0]
      };

      expect(() => {
        serializer.deserializeArray(doc);
      }).toThrow();
    });

  });

});
