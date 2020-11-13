import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { followLink, FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { FindListOptions } from '../../data/request.models';
import { HALLink } from '../../shared/hal-link.model';
import { HALResource } from '../../shared/hal-resource.model';
import { ResourceType } from '../../shared/resource-type';
import * as decorators from './build-decorators';
import { getDataServiceFor } from './build-decorators';
import { LinkService } from './link.service';

const spyOnFunction = <T>(obj: T, func: keyof T) => {
  const spy = jasmine.createSpy(func as string);
  spyOnProperty(obj, func, 'get').and.returnValue(spy);

  return spy;
};

const TEST_MODEL = new ResourceType('testmodel');
let result: any;

/* tslint:disable:max-classes-per-file */
class TestModel implements HALResource {
  static type = TEST_MODEL;

  type = TEST_MODEL;

  value: string;

  _links: {
    self: HALLink;
    predecessor: HALLink;
    successor: HALLink;
  };

  predecessor?: TestModel;
  successor?: TestModel;
}

@Injectable()
class TestDataService {
  findAllByHref(href: string, findListOptions: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<any>>) {
    return 'findAllByHref';
  }
  findByHref(href: string, ...linksToFollow: Array<FollowLinkConfig<any>>) {
    return 'findByHref';
  }
}

let testDataService: TestDataService;

let testModel: TestModel;

describe('LinkService', () => {
  let service: LinkService;

  beforeEach(() => {
    testModel = Object.assign(new TestModel(), {
      value: 'a test value',
      _links: {
        self: {
          href: 'http://self.link'
        },
        predecessor: {
          href: 'http://predecessor.link'
        },
        successor: {
          href: 'http://successor.link'
        },
      }
    });
    testDataService = new TestDataService();
    spyOn(testDataService, 'findAllByHref').and.callThrough();
    spyOn(testDataService, 'findByHref').and.callThrough();
    TestBed.configureTestingModule({
      providers: [LinkService, {
        provide: TestDataService,
        useValue: testDataService
      }]
    });
    service = TestBed.get(LinkService);
  });

  describe('resolveLink', () => {
    describe(`when the linkdefinition concerns a single object`, () => {
      beforeEach(() => {
        spyOnFunction(decorators, 'getLinkDefinition').and.returnValue({
          resourceType: TEST_MODEL,
          linkName: 'predecessor',
          propertyName: 'predecessor'
        });
        spyOnFunction(decorators, 'getDataServiceFor').and.returnValue(TestDataService);
        service.resolveLink(testModel, followLink('predecessor', {}, true, followLink('successor')))
      });
      it('should call dataservice.findByHref with the correct href and nested links', () => {
        expect(testDataService.findByHref).toHaveBeenCalledWith(testModel._links.predecessor.href, followLink('successor'));
      });
    });
    describe(`when the linkdefinition concerns a list`, () => {
      beforeEach(() => {
        spyOnFunction(decorators, 'getLinkDefinition').and.returnValue({
          resourceType: TEST_MODEL,
          linkName: 'predecessor',
          propertyName: 'predecessor',
          isList: true
        });
        spyOnFunction(decorators, 'getDataServiceFor').and.returnValue(TestDataService);
        service.resolveLink(testModel, followLink('predecessor', { some: 'options '} as any, true, followLink('successor')))
      });
      it('should call dataservice.findAllByHref with the correct href, findListOptions,  and nested links', () => {
        expect(testDataService.findAllByHref).toHaveBeenCalledWith(testModel._links.predecessor.href, { some: 'options '} as any, followLink('successor'));
      });
    });
    describe('either way', () => {
      beforeEach(() => {
        spyOnFunction(decorators, 'getLinkDefinition').and.returnValue({
          resourceType: TEST_MODEL,
          linkName: 'predecessor',
          propertyName: 'predecessor'
        });
        spyOnFunction(decorators, 'getDataServiceFor').and.returnValue(TestDataService);
        result = service.resolveLink(testModel, followLink('predecessor', {}, true, followLink('successor')))
      });

      it('should call getLinkDefinition with the correct model and link', () => {
        expect(decorators.getLinkDefinition).toHaveBeenCalledWith(testModel.constructor as any, 'predecessor');
      });

      it('should call getDataServiceFor with the correct resource type', () => {
        expect(decorators.getDataServiceFor).toHaveBeenCalledWith(TEST_MODEL);
      });

      it('should return the model with the resolved link', () => {
        expect(result.type).toBe(TEST_MODEL);
        expect(result.value).toBe('a test value');
        expect(result._links.self.href).toBe('http://self.link');
        expect(result.predecessor).toBe('findByHref');
      });
    });

    describe(`when the specified link doesn't exist on the model's class`, () => {
      beforeEach(() => {
        spyOnFunction(decorators, 'getLinkDefinition').and.returnValue(undefined);
      });
      it('should throw an error', () => {
        expect(() => {
          service.resolveLink(testModel, followLink('predecessor', {}, true, followLink('successor')))
        }).toThrow();
      });
    });

    describe(`when there is no dataservice for the resourcetype in the link`, () => {
      beforeEach(() => {
        spyOnFunction(decorators, 'getLinkDefinition').and.returnValue({
          resourceType: TEST_MODEL,
          linkName: 'predecessor',
          propertyName: 'predecessor'
        });
        spyOnFunction(decorators, 'getDataServiceFor').and.returnValue(undefined);
      });
      it('should throw an error', () => {
        expect(() => {
          service.resolveLink(testModel, followLink('predecessor', {}, true, followLink('successor')))
        }).toThrow();
      });
    });
  });

  describe('resolveLinks', () => {
    beforeEach(() => {
      spyOn(service, 'resolveLink');
      result = service.resolveLinks(testModel, followLink('predecessor'), followLink('successor'))
    });

    it('should call resolveLink with the model for each of the provided links', () => {
      expect(service.resolveLink).toHaveBeenCalledWith(testModel, followLink('predecessor'));
      expect(service.resolveLink).toHaveBeenCalledWith(testModel, followLink('successor'));
    });

    it('should return the model', () => {
      expect(result.type).toBe(TEST_MODEL);
      expect(result.value).toBe('a test value');
      expect(result._links.self.href).toBe('http://self.link');
    });
  });

  describe('removeResolvedLinks', () => {
    beforeEach(() => {
      testModel.predecessor = 'predecessor value' as any;
      testModel.successor = 'successor value' as any;
      spyOnFunction(decorators, 'getLinkDefinitions').and.returnValue([
        {
          resourceType: TEST_MODEL,
          linkName: 'predecessor',
          propertyName: 'predecessor',
        },
        {
          resourceType: TEST_MODEL,
          linkName: 'successor',
          propertyName: 'successor',
        }
      ])
    });

    it('should return a new version of the object without any resolved links', () => {
      result = service.removeResolvedLinks(testModel);
      expect(result.value).toBe(testModel.value);
      expect(result.type).toBe(testModel.type);
      expect(result._links).toBe(testModel._links);
      expect(result.predecessor).toBeUndefined();
      expect(result.successor).toBeUndefined();
    });

    it('should leave the original object untouched', () => {
      service.removeResolvedLinks(testModel);
      expect(testModel.predecessor as any).toBe('predecessor value');
      expect(testModel.successor as any).toBe('successor value');
    });
  });

  describe('when a link is missing', () => {
    beforeEach(() => {
      testModel = Object.assign(new TestModel(), {
        value: 'a test value',
        _links: {
          self: {
            href: 'http://self.link'
          },
          predecessor: {
            href: 'http://predecessor.link'
          }
        }
      });
      spyOnFunction(decorators, 'getDataServiceFor').and.returnValue(TestDataService);
    });

    describe('resolving the available link', () => {
      beforeEach(() => {
        spyOnFunction(decorators, 'getLinkDefinition').and.returnValue({
          resourceType: TEST_MODEL,
          linkName: 'predecessor',
          propertyName: 'predecessor'
        });
        result = service.resolveLinks(testModel, followLink('predecessor'));
      });

      it('should return the model with the resolved link', () => {
        expect(result.predecessor).toBe('findByHref');
      });
    });

    describe('resolving the missing link', () => {
      beforeEach(() => {
        spyOnFunction(decorators, 'getLinkDefinition').and.returnValue({
          resourceType: TEST_MODEL,
          linkName: 'successor',
          propertyName: 'successor'
        });
        result = service.resolveLinks(testModel, followLink('successor'));
      });

      it('should return the model with no resolved link', () => {
        expect(result.successor).toBeUndefined();
      });
    });
  });

});
/* tslint:enable:max-classes-per-file */
