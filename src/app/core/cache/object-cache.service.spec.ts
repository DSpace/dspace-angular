import { Store } from '@ngrx/store';
import * as ngrx from '@ngrx/store';
import { of as observableOf } from 'rxjs';
import { first } from 'rxjs/operators';

import { NormalizedItem } from './models/normalized-item.model';
import { AddToObjectCacheAction, RemoveFromObjectCacheAction } from './object-cache.actions';
import { ObjectCacheService } from './object-cache.service';
import { CoreState } from '../core.reducers';
import { ResourceType } from '../shared/resource-type';

describe('ObjectCacheService', () => {
  let service: ObjectCacheService;
  let store: Store<CoreState>;

  const selfLink = 'https://rest.api/endpoint/1698f1d3-be98-4c51-9fd8-6bfedcbd59b7';
  const timestamp = new Date().getTime();
  const msToLive = 900000;
  const objectToCache = {
    self: selfLink,
    type: ResourceType.Item
  };
  const cacheEntry = {
    data: objectToCache,
    timeAdded: timestamp,
    msToLive: msToLive
  };
  const invalidCacheEntry = Object.assign({}, cacheEntry, { msToLive: -1 });

  beforeEach(() => {
    store = new Store<CoreState>(undefined, undefined, undefined);
    spyOn(store, 'dispatch');
    service = new ObjectCacheService(store);

    spyOn(Date.prototype, 'getTime').and.callFake(() => {
      return timestamp;
    });
  });

  describe('add', () => {
    it('should dispatch an ADD action with the object to add, the time to live, and the current timestamp', () => {
      service.add(objectToCache, msToLive, selfLink);
      expect(store.dispatch).toHaveBeenCalledWith(new AddToObjectCacheAction(objectToCache, timestamp, msToLive, selfLink));
    });
  });

  describe('remove', () => {
    it('should dispatch a REMOVE action with the self link of the object to remove', () => {
      service.remove(selfLink);
      expect(store.dispatch).toHaveBeenCalledWith(new RemoveFromObjectCacheAction(selfLink));
    });
  });

  describe('getBySelfLink', () => {
    it('should return an observable of the cached object with the specified self link and type', () => {
      spyOnProperty(ngrx, 'select').and.callFake(() => {
        return () => {
          return () => observableOf(cacheEntry);
        };
      });

      // due to the implementation of spyOn above, this subscribe will be synchronous
      service.getBySelfLink(selfLink).pipe(first()).subscribe((o) => {
          expect(o.self).toBe(selfLink);
          // this only works if testObj is an instance of TestClass
          expect(o instanceof NormalizedItem).toBeTruthy();
        }
      );
    });

    it('should not return a cached object that has exceeded its time to live', () => {
      spyOnProperty(ngrx, 'select').and.callFake(() => {
        return () => {
          return () => observableOf(invalidCacheEntry);
        };
      });

      let getObsHasFired = false;
      const subscription = service.getBySelfLink(selfLink).subscribe((o) => getObsHasFired = true);
      expect(getObsHasFired).toBe(false);
      subscription.unsubscribe();
    });
  });

  describe('getList', () => {
    it('should return an observable of the array of cached objects with the specified self link and type', () => {
      const item = new NormalizedItem();
      item.self = selfLink;
      spyOn(service, 'getBySelfLink').and.returnValue(observableOf(item));

      service.getList([selfLink, selfLink]).pipe(first()).subscribe((arr) => {
        expect(arr[0].self).toBe(selfLink);
        expect(arr[0] instanceof NormalizedItem).toBeTruthy();
      });
    });
  });

  describe('has', () => {
    it('should return true if the object with the supplied self link is cached and still valid', () => {
      spyOnProperty(ngrx, 'select').and.callFake(() => {
        return () => {
          return () => observableOf(cacheEntry);
        };
      });

      expect(service.hasBySelfLink(selfLink)).toBe(true);
    });

    it("should return false if the object with the supplied self link isn't cached", () => {
      spyOnProperty(ngrx, 'select').and.callFake(() => {
        return () => {
          return () => observableOf(undefined);
        };
      });

      expect(service.hasBySelfLink(selfLink)).toBe(false);
    });

    it('should return false if the object with the supplied self link is cached but has exceeded its time to live', () => {
      spyOnProperty(ngrx, 'select').and.callFake(() => {
        return () => {
          return () => observableOf(invalidCacheEntry);
        };
      });

      expect(service.hasBySelfLink(selfLink)).toBe(false);
    });
  });

});
