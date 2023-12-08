/* eslint-disable max-classes-per-file */
import { Injectable, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { followLink, FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { HALLink } from '../../shared/hal-link.model';
import { HALResource } from '../../shared/hal-resource.model';
import { ResourceType } from '../../shared/resource-type';
import { LinkService } from './link.service';
import { LINK_DEFINITION_FACTORY, LINK_DEFINITION_MAP_FACTORY } from './build-decorators';
import { isEmpty } from 'rxjs/operators';
import { FindListOptions } from '../../data/find-list-options.model';
import { DATA_SERVICE_FACTORY } from '../../data/base/data-service.decorator';
import { of } from 'rxjs';

const TEST_MODEL = new ResourceType('authorization');
let result: any;

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
  findListByHref(href: string, findListOptions: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<any>[]) {
    return of('findListByHref');
  }

  findByHref(href: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<any>[]) {
    return of('findByHref');
  }
}


let testDataService: TestDataService = new TestDataService();

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
    TestBed.configureTestingModule({
      providers: [LinkService, {
        provide: TestDataService,
        useValue: testDataService
      },
      {provide: Injector, useValue: {get: () => testDataService}},
      {
        provide: DATA_SERVICE_FACTORY,
        useValue: jasmine.createSpy('getDataServiceFor').and.returnValue(TestDataService),
      }, {
        provide: LINK_DEFINITION_FACTORY,
        useValue: jasmine.createSpy('getLinkDefinition').and.returnValue({
          resourceType: TEST_MODEL,
          linkName: 'predecessor',
          propertyName: 'predecessor'
        }),
      }, {
        provide: LINK_DEFINITION_MAP_FACTORY,
        useValue: jasmine.createSpy('getLinkDefinitions').and.returnValue([
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
        ]),
      }]
    });
    service = TestBed.inject(LinkService);
    testDataService = TestBed.inject(TestDataService);
  });
  describe('resolveLink', () => {
    describe(`when the linkdefinition concerns a single object`, () => {
      it('should call dataservice.findByHref with the correct href and nested links', (done) => {
        const testModell = testModel;
        spyOn(testDataService, 'findByHref').and.returnValue(of('test'));
        const linkToFollow = followLink('predecessor', {}, followLink('successor'));
        service.resolveLinkWithoutAttaching(testModell, linkToFollow).subscribe(() => {
          expect(testDataService.findByHref).toHaveBeenCalled();
          done();
        });
      });
    });
    describe(`when the linkdefinition concerns a list`, () => {
      beforeEach(() => {
        ((service as any).getLinkDefinition as jasmine.Spy).and.returnValue({
          resourceType: TEST_MODEL,
          linkName: 'predecessor',
          propertyName: 'predecessor',
          isList: true
        });
      });
      it('should call dataservice.findListByHref with the correct href, findListOptions,  and nested links', (done) => {
        spyOn(testDataService, 'findListByHref').and.returnValue(of('test'));
        const linkToFollow = followLink('predecessor', {}, followLink('successor'));
        service.resolveLinkWithoutAttaching(testModel, linkToFollow).subscribe(() => {
          expect(testDataService.findListByHref).toHaveBeenCalled();
          done();
        });
      });
    });
    describe('either way', () => {
      beforeEach(() => {
        result = service.resolveLink(testModel, followLink('predecessor', {}, followLink('successor')));
      });

      it('should call getLinkDefinition with the correct model and link', () => {
        expect((service as any).getLinkDefinition).toHaveBeenCalledWith(testModel.constructor as any, 'predecessor');
      });

      it('should return the model with the resolved link', (done) => {
        expect(result.type).toBe(TEST_MODEL);
        expect(result.value).toBe('a test value');
        expect(result._links.self.href).toBe('http://self.link');
        result.predecessor.pipe().subscribe((v) => {
          expect(v).toEqual('findByHref');
          done();
        });
      });
    });

    describe(`when the specified link doesn't exist on the model's class`, () => {
      beforeEach(() => {
        ((service as any).getLinkDefinition as jasmine.Spy).and.returnValue(undefined);
      });
      it('should throw an error', () => {
        expect(() => {
          service.resolveLink(testModel, followLink('predecessor', {}, followLink('successor')));
        }).toThrow();
      });
    });
  });

  describe('resolveLinks', () => {
    beforeEach(() => {
      spyOn(service, 'resolveLink');
      result = service.resolveLinks(testModel, followLink('predecessor'), followLink('successor'));
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
    });

    describe('resolving the available link', () => {
      beforeEach(() => {
        result = service.resolveLinks(testModel, followLink('predecessor'));
      });

      it('should return the model with the resolved link', (done) => {
        result.predecessor.pipe().subscribe((v) => {
          expect(v).toEqual('findByHref');
          done();
        });
      });
    });

    describe('resolving the missing link', () => {
      beforeEach(() => {
        ((service as any).getLinkDefinition as jasmine.Spy).and.returnValue(undefined);
        result = service.resolveLinks(testModel, followLink('successor', {isOptional: true}));
      });

      it('should resolve to an empty observable', (done) => {
        result.successor.pipe(isEmpty()).subscribe((v) => {
          expect(v).toEqual(true);
          done();
        });
      });
    });
  });

});
