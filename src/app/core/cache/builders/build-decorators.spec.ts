/* eslint-disable max-classes-per-file */
import { HALLink } from '../../shared/hal-link.model';
import { HALResource } from '../../shared/hal-resource.model';
import { ResourceType } from '../../shared/resource-type';
import { dataService, getDataServiceFor, getLinkDefinition, link, } from './build-decorators';

class TestService {
}

class AnotherTestService {
}

class TestHALResource implements HALResource {
  _links: {
    self: HALLink;
    foo: HALLink;
  };

  bar?: any;
}

let testType;

describe('build decorators', () => {
  beforeEach(() => {
    testType = new ResourceType('testType-' + new Date().getTime());
  });
  describe('@dataService/getDataServiceFor', () => {

    it('should register a resourcetype for a dataservice', () => {
      dataService(testType)(TestService);
      expect(getDataServiceFor(testType)).toBe(TestService);
    });

    describe(`when the resource type isn't specified`, () => {
      it(`should throw an error`, () => {
        expect(() => {
          dataService(undefined)(TestService);
        }).toThrow();
      });
    });

    describe(`when there already is a registered dataservice for a resourcetype`, () => {
      it(`should throw an error`, () => {
        dataService(testType)(TestService);
        expect(() => {
          dataService(testType)(AnotherTestService);
        }).toThrow();
      });
    });

  });

  describe(`@link/getLinkDefinitions`, () => {
    it(`should register a link`, () => {
      const target = new TestHALResource();
      link(testType, true, 'foo')(target, 'bar');
      const result = getLinkDefinition(TestHALResource, 'foo');
      expect(result.resourceType).toBe(testType);
      expect(result.isList).toBe(true);
      expect(result.linkName).toBe('foo');
      expect(result.propertyName).toBe('bar');
    });

    describe(`when the linkname isn't specified`, () => {
      it(`should use the propertyname`, () => {
        const target = new TestHALResource();
        link(testType)(target, 'foo');
        const result = getLinkDefinition(TestHALResource, 'foo');
        expect(result.linkName).toBe('foo');
        expect(result.propertyName).toBe('foo');
      });
    });

    describe(`when there's no @link`, () => {
      it(`should return undefined`, () => {
        const result = getLinkDefinition(TestHALResource, 'self');
        expect(result).toBeUndefined();
      });
    });
  });
});
