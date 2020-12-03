import { TestBed, waitForAsync } from '@angular/core/testing';

import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Operation } from 'fast-json-patch';
import { of as observableOf } from 'rxjs';
import { first } from 'rxjs/operators';

import { coreReducers, CoreState } from '../core.reducers';
import { RestRequestMethod } from '../data/rest-request-method';
import { Item } from '../shared/item.model';
import {
  AddPatchObjectCacheAction,
  AddToObjectCacheAction,
  ApplyPatchObjectCacheAction,
  RemoveFromObjectCacheAction
} from './object-cache.actions';
import { Patch } from './object-cache.reducer';
import { ObjectCacheService } from './object-cache.service';
import { AddToSSBAction } from './server-sync-buffer.actions';
import { storeModuleConfig } from '../../app.reducer';

describe('ObjectCacheService', () => {
  let service: ObjectCacheService;
  let store: Store<CoreState>;
  let mockStore: MockStore<CoreState>;
  let linkServiceStub;
  let initialState: any;

  const selfLink = 'https://rest.api/endpoint/1698f1d3-be98-4c51-9fd8-6bfedcbd59b7';
  const requestUUID = '4d3a4ce8-a375-4b98-859b-39f0a014d736';
  const timestamp = new Date().getTime();
  const msToLive = 900000;
  let objectToCache = {
    type: Item.type,
    _links: {
      self: { href: selfLink }
    }
  };
  let cacheEntry;
  let invalidCacheEntry;
  const operations = [{ op: 'replace', path: '/name', value: 'random string' } as Operation];

  function init() {
    objectToCache = {
      type: Item.type,
      _links: {
        self: { href: selfLink }
      }
    };
    cacheEntry = {
      data: objectToCache,
      timeAdded: timestamp,
      msToLive: msToLive
    };
    invalidCacheEntry = Object.assign({}, cacheEntry, { msToLive: -1 });
    initialState = {
      core: {
        'cache/object': {  },
        'cache/syncbuffer': {  },
        'cache/object-updates': {  },
        'data/request': {  },
        'index': {  },
      }
    };
  }

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(coreReducers, storeModuleConfig)
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: ObjectCacheService, useValue: service }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    init();
    store = TestBed.inject(Store);
    mockStore = store as MockStore<CoreState>;
    mockStore.setState(initialState);
    linkServiceStub = {
      removeResolvedLinks: (a) => a
    };
    spyOn(linkServiceStub, 'removeResolvedLinks').and.callThrough();
    spyOn(store, 'dispatch');
    service = new ObjectCacheService(store, linkServiceStub);

    spyOn(Date.prototype, 'getTime').and.callFake(() => {
      return timestamp;
    });
  });

  describe('add', () => {
    it('should dispatch an ADD action with the object to add, the time to live, and the current timestamp', () => {
      service.add(objectToCache, msToLive, requestUUID);
      expect(store.dispatch).toHaveBeenCalledWith(new AddToObjectCacheAction(objectToCache, timestamp, msToLive, requestUUID));
      expect(linkServiceStub.removeResolvedLinks).toHaveBeenCalledWith(objectToCache);
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
      const state = Object.assign({}, initialState, {
        core: Object.assign({}, initialState.core, {
          'cache/object': {
            'https://rest.api/endpoint/1698f1d3-be98-4c51-9fd8-6bfedcbd59b7': cacheEntry
          }
        })
      });
      mockStore.setState(state);

      // due to the implementation of spyOn above, this subscribe will be synchronous
      service.getObjectBySelfLink(selfLink).pipe(first()).subscribe((o) => {
          expect(o._links.self.href).toBe(selfLink);
          // this only works if testObj is an instance of TestClass
          expect(o instanceof Item).toBeTruthy();
        }
      );
    });

    it('should not return a cached object that has exceeded its time to live', () => {
      const state = Object.assign({}, initialState, {
        core: Object.assign({}, initialState.core, {
          'cache/object': {
            'https://rest.api/endpoint/1698f1d3-be98-4c51-9fd8-6bfedcbd59b7': invalidCacheEntry
          }
        })
      });
      mockStore.setState(state);

      let getObsHasFired = false;
      const subscription = service.getObjectBySelfLink(selfLink).subscribe((o) => getObsHasFired = true);
      expect(getObsHasFired).toBe(false);
      subscription.unsubscribe();
    });
  });

  describe('getList', () => {
    it('should return an observable of the array of cached objects with the specified self link and type', () => {
      const item = Object.assign(new Item(), {
        _links: { self: { href: selfLink } }
      });
      spyOn(service, 'getObjectBySelfLink').and.returnValue(observableOf(item));

      service.getList([selfLink, selfLink]).pipe(first()).subscribe((arr) => {
        expect(arr[0]._links.self.href).toBe(selfLink);
        expect(arr[0] instanceof Item).toBeTruthy();
      });
    });
  });

  describe('has', () => {
    it('should return true if the object with the supplied self link is cached and still valid', () => {
      const state = Object.assign({}, initialState, {
        core: Object.assign({}, initialState.core, {
          'cache/object': {
            'https://rest.api/endpoint/1698f1d3-be98-4c51-9fd8-6bfedcbd59b7': cacheEntry
          }
        })
      });
      mockStore.setState(state);

      expect(service.hasBySelfLink(selfLink)).toBe(true);
    });

    it('should return false if the object with the supplied self link isn\'t cached', () => {
      const state = Object.assign({}, initialState, {
        core: Object.assign({}, initialState.core, {
          'cache/object': {
            'https://rest.api/endpoint/1698f1d3-be98-4c51-9fd8-6bfedcbd59b7': undefined
          }
        })
      });
      mockStore.setState(state);
      expect(service.hasBySelfLink(selfLink)).toBe(false);
    });

    it('should return false if the object with the supplied self link is cached but has exceeded its time to live', () => {
      const state = Object.assign({}, initialState, {
        core: Object.assign({}, initialState.core, {
          'cache/object': {
            'https://rest.api/endpoint/1698f1d3-be98-4c51-9fd8-6bfedcbd59b7': invalidCacheEntry
          }
        })
      });
      expect(service.hasBySelfLink(selfLink)).toBe(false);
    });
  });

  describe('patch methods', () => {
    it('should dispatch the correct actions when addPatch is called', () => {
      service.addPatch(selfLink, operations);
      expect(store.dispatch).toHaveBeenCalledWith(new AddPatchObjectCacheAction(selfLink, operations));
      expect(store.dispatch).toHaveBeenCalledWith(new AddToSSBAction(selfLink, RestRequestMethod.PATCH));
    });

    it('isDirty should return true when the patches list in the cache entry is not empty', () => {
      cacheEntry.patches = [
        {
          operations: operations
        } as Patch];
      const result = (service as any).isDirty(cacheEntry);
      expect(result).toBe(true);
    });

    it('isDirty should return false when the patches list in the cache entry is empty', () => {
      cacheEntry.patches = [];
      const result = (service as any).isDirty(cacheEntry);
      expect(result).toBe(false);
    });
    it('should dispatch the correct actions when applyPatchesToCachedObject is called', () => {
      (service as any).applyPatchesToCachedObject(selfLink);
      expect(store.dispatch).toHaveBeenCalledWith(new ApplyPatchObjectCacheAction(selfLink));
    });
  });
});
