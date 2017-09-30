import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ObjectCacheService } from './object-cache.service';
import { CacheableObject } from './object-cache.reducer';
import { AddToObjectCacheAction, RemoveFromObjectCacheAction } from './object-cache.actions';
import { CoreState } from '../core.reducers';

class TestClass implements CacheableObject {
  constructor(
    public self: string,
    public foo: string
  ) { }

  test(): string {
    return this.foo + this.self;
  }
}

describe('ObjectCacheService', () => {
  let service: ObjectCacheService;
  let store: Store<CoreState>;

  const selfLink = 'https://rest.api/endpoint/1698f1d3-be98-4c51-9fd8-6bfedcbd59b7';
  const timestamp = new Date().getTime();
  const msToLive = 900000;
  const objectToCache = {
    self: selfLink,
    foo: 'bar'
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
    it('should dispatch an ADD action with the object to panel-add, the time to live, and the current timestamp', () => {
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
      spyOn(store, 'select').and.returnValue(Observable.of(cacheEntry));

      let testObj: any;
      // due to the implementation of spyOn above, this subscribe will be synchronous
      service.getBySelfLink(selfLink, TestClass).take(1).subscribe((o) => testObj = o);
      expect(testObj.self).toBe(selfLink);
      expect(testObj.foo).toBe('bar');
      // this only works if testObj is an instance of TestClass
      expect(testObj.test()).toBe('bar' + selfLink);
    });

    it('should not return a cached object that has exceeded its time to live', () => {
      spyOn(store, 'select').and.returnValue(Observable.of(invalidCacheEntry));

      let getObsHasFired = false;
      const subscription = service.getBySelfLink(selfLink, TestClass).subscribe((o) => getObsHasFired = true);
      expect(getObsHasFired).toBe(false);
      subscription.unsubscribe();
    });
  });

  describe('getList', () => {
    it('should return an observable of the array of cached objects with the specified self link and type', () => {
      spyOn(service, 'getBySelfLink').and.returnValue(Observable.of(new TestClass(selfLink, 'bar')));

      let testObjs: any[];
      service.getList([selfLink, selfLink], TestClass).take(1).subscribe((arr) => testObjs = arr);
      expect(testObjs[0].self).toBe(selfLink);
      expect(testObjs[0].foo).toBe('bar');
      expect(testObjs[0].test()).toBe('bar' + selfLink);
      expect(testObjs[1].self).toBe(selfLink);
      expect(testObjs[1].foo).toBe('bar');
      expect(testObjs[1].test()).toBe('bar' + selfLink);
    });
  });

  describe('has', () => {
    it('should return true if the object with the supplied self link is cached and still valid', () => {
      spyOn(store, 'select').and.returnValue(Observable.of(cacheEntry));

      expect(service.hasBySelfLink(selfLink)).toBe(true);
    });

    it("should return false if the object with the supplied self link isn't cached", () => {
      spyOn(store, 'select').and.returnValue(Observable.of(undefined));

      expect(service.hasBySelfLink(selfLink)).toBe(false);
    });

    it('should return false if the object with the supplied self link is cached but has exceeded its time to live', () => {
      spyOn(store, 'select').and.returnValue(Observable.of(invalidCacheEntry));

      expect(service.hasBySelfLink(selfLink)).toBe(false);
    });
  });

});
