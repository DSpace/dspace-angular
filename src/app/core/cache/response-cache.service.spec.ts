import { OpaqueToken } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { ResponseCacheService } from './response-cache.service';
import { ResponseCacheState, ResponseCacheEntry } from './response-cache.reducer';

// describe('ResponseCacheService', () => {
//   let service: ResponseCacheService;
//   let store: Store<ResponseCacheState>;
//
//   const keys = ['125c17f89046283c5f0640722aac9feb', 'a06c3006a41caec5d635af099b0c780c'];
//   const serviceTokens = [new OpaqueToken('service1'), new OpaqueToken('service2')];
//   const resourceID = '9978';
//   const paginationOptions = { 'resultsPerPage': 10, 'currentPage': 1 };
//   const sortOptions = { 'field': 'id', 'direction': 0 };
//   const timestamp = new Date().getTime();
//   const validCacheEntry = (key) => {
//     return {
//       key: key,
//       timeAdded: timestamp,
//       msToLive: 24 * 60 * 60 * 1000 // a day
//     }
//   };
//   const invalidCacheEntry = (key) => {
//     return {
//       key: key,
//       timeAdded: 0,
//       msToLive: 0
//     }
//   };
//
//   beforeEach(() => {
//     store = new Store<ResponseCacheState>(undefined, undefined, undefined);
//     spyOn(store, 'dispatch');
//     service = new ResponseCacheService(store);
//     spyOn(window, 'Date').and.returnValue({ getTime: () => timestamp });
//   });
//
//   describe('findAll', () => {
//     beforeEach(() => {
//       spyOn(service, 'get').and.callFake((key) => Observable.of({key: key}));
//     });
//     describe('if the key isn't cached', () => {
//       beforeEach(() => {
//           spyOn(service, 'has').and.returnValue(false);
//       });
//       it('should dispatch a FIND_ALL action with the key, service, scopeID, paginationOptions and sortOptions', () => {
//         service.findAll(keys[0], serviceTokens[0], resourceID, paginationOptions, sortOptions);
//         expect(store.dispatch).toHaveBeenCalledWith(new ResponseCacheFindAllAction(keys[0], serviceTokens[0], resourceID, paginationOptions, sortOptions))
//       });
//       it('should return an observable of the newly cached request with the specified key', () => {
//         let result: ResponseCacheEntry;
//         service.findAll(keys[0], serviceTokens[0], resourceID, paginationOptions, sortOptions).take(1).subscribe(entry => result = entry);
//         expect(result.key).toEqual(keys[0]);
//       });
//     });
//     describe('if the key is already cached', () => {
//       beforeEach(() => {
//           spyOn(service, 'has').and.returnValue(true);
//       });
//       it('shouldn't dispatch anything', () => {
//         service.findAll(keys[0], serviceTokens[0], resourceID, paginationOptions, sortOptions);
//         expect(store.dispatch).not.toHaveBeenCalled();
//       });
//       it('should return an observable of the existing cached request with the specified key', () => {
//         let result: ResponseCacheEntry;
//         service.findAll(keys[0], serviceTokens[0], resourceID, paginationOptions, sortOptions).take(1).subscribe(entry => result = entry);
//         expect(result.key).toEqual(keys[0]);
//       });
//     });
//   });
//
//   describe('findById', () => {
//     beforeEach(() => {
//       spyOn(service, 'get').and.callFake((key) => Observable.of({key: key}));
//     });
//     describe('if the key isn't cached', () => {
//       beforeEach(() => {
//           spyOn(service, 'has').and.returnValue(false);
//       });
//       it('should dispatch a FIND_BY_ID action with the key, service, and resourceID', () => {
//         service.findById(keys[0], serviceTokens[0], resourceID);
//         expect(store.dispatch).toHaveBeenCalledWith(new ResponseCacheFindByIDAction(keys[0], serviceTokens[0], resourceID))
//       });
//       it('should return an observable of the newly cached request with the specified key', () => {
//         let result: ResponseCacheEntry;
//         service.findById(keys[0], serviceTokens[0], resourceID).take(1).subscribe(entry => result = entry);
//         expect(result.key).toEqual(keys[0]);
//       });
//     });
//     describe('if the key is already cached', () => {
//       beforeEach(() => {
//           spyOn(service, 'has').and.returnValue(true);
//       });
//       it('shouldn't dispatch anything', () => {
//         service.findById(keys[0], serviceTokens[0], resourceID);
//         expect(store.dispatch).not.toHaveBeenCalled();
//       });
//       it('should return an observable of the existing cached request with the specified key', () => {
//         let result: ResponseCacheEntry;
//         service.findById(keys[0], serviceTokens[0], resourceID).take(1).subscribe(entry => result = entry);
//         expect(result.key).toEqual(keys[0]);
//       });
//     });
//   });
//
//   describe('get', () => {
//     it('should return an observable of the cached request with the specified key', () => {
//       spyOn(store, 'select').and.callFake((...args:Array<any>) => {
//         return Observable.of(validCacheEntry(args[args.length - 1]));
//       });
//
//       let testObj: ResponseCacheEntry;
//       service.get(keys[1]).take(1).subscribe(entry => testObj = entry);
//       expect(testObj.key).toEqual(keys[1]);
//     });
//
//     it('should not return a cached request that has exceeded its time to live', () => {
//       spyOn(store, 'select').and.callFake((...args:Array<any>) => {
//         return Observable.of(invalidCacheEntry(args[args.length - 1]));
//       });
//
//       let getObsHasFired = false;
//       const subscription = service.get(keys[1]).subscribe(entry => getObsHasFired = true);
//       expect(getObsHasFired).toBe(false);
//       subscription.unsubscribe();
//     });
//   });
//
//   describe('has', () => {
//     it('should return true if the request with the supplied key is cached and still valid', () => {
//       spyOn(store, 'select').and.returnValue(Observable.of(validCacheEntry(keys[1])));
//       expect(service.has(keys[1])).toBe(true);
//     });
//
//     it('should return false if the request with the supplied key isn't cached', () => {
//       spyOn(store, 'select').and.returnValue(Observable.of(undefined));
//       expect(service.has(keys[1])).toBe(false);
//     });
//
//     it('should return false if the request with the supplied key is cached but has exceeded its time to live', () => {
//       spyOn(store, 'select').and.returnValue(Observable.of(invalidCacheEntry(keys[1])));
//       expect(service.has(keys[1])).toBe(false);
//     });
//   });
// });
