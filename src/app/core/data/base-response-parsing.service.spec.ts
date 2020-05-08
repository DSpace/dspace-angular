import { BaseResponseParsingService } from './base-response-parsing.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CacheableObject } from '../cache/object-cache.reducer';
import { GetRequest, RestRequest } from './request.models';
import { DSpaceObject } from '../shared/dspace-object.model';

/* tslint:disable:max-classes-per-file */
class TestService extends BaseResponseParsingService {
  toCache = true;

  constructor(protected objectCache: ObjectCacheService) {
    super();
  }

  // Overwrite methods to make them public for testing
  public process<ObjectDomain>(data: any, request: RestRequest): any {
    super.process(data, request);
  }

  public cache<ObjectDomain>(obj, request: RestRequest, data: any) {
    super.cache(obj, request, data);
  }
}

describe('BaseResponseParsingService', () => {
  let service: TestService;
  let objectCache: ObjectCacheService;

  const requestUUID = 'request-uuid';
  const requestHref = 'request-href';
  const request = new GetRequest(requestUUID, requestHref);
  let obj: CacheableObject;

  beforeEach(() => {
    obj = undefined;
    objectCache = jasmine.createSpyObj('objectCache', {
      add: {}
    });
    service = new TestService(objectCache);
  });

  describe('cache', () => {
    describe('when the object is undefined', () => {
      it('should not throw an error', () => {
        expect(() => { service.cache(obj, request, {}) }).not.toThrow();
      });

      it('should not call objectCache add', () => {
        service.cache(obj, request, {});
        expect(objectCache.add).not.toHaveBeenCalled();
      });
    });

    describe('when the object has a self link', () => {
      beforeEach(() => {
        obj = Object.assign(new DSpaceObject(), {
          _links: {
            self: { href: 'obj-selflink' }
          }
        });
      });

      it('should call objectCache add', () => {
        service.cache(obj, request, {});
        expect(objectCache.add).toHaveBeenCalledWith(obj, request.responseMsToLive, request.uuid);
      });
    });
  });

  describe('process', () => {
    let data: any;
    let result: any;

    describe('when data is valid, but not a real type', () => {
      beforeEach(() => {
        data = {
          type: 'NotARealType',
          _links: {
            self: { href: 'data-selflink' }
          }
        };
      });

      it('should not throw an error', () => {
        expect(() => { result = service.process(data, request) }).not.toThrow();
      });

      it('should return undefined', () => {
        result = service.process(data, request);
        expect(result).toBeUndefined();
      });

      it('should not call objectCache add', () => {
        result = service.process(data, request);
        expect(objectCache.add).not.toHaveBeenCalled();
      });
    });
  });
});
/* tslint:enable:max-classes-per-file */
