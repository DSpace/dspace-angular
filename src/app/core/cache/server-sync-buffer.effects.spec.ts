import { TestBed } from '@angular/core/testing';

import { Observable, of as observableOf } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';

import { ServerSyncBufferEffects } from './server-sync-buffer.effects';
import { GLOBAL_CONFIG } from '../../../config';
import { CommitSSBAction, EmptySSBAction, ServerSyncBufferActionTypes } from './server-sync-buffer.actions';
import { RestRequestMethod } from '../data/rest-request-method';
import { Store, StoreModule } from '@ngrx/store';
import { RequestService } from '../data/request.service';
import { ObjectCacheService } from './object-cache.service';
import { MockStore } from '../../shared/testing/mock-store';
import * as operators from 'rxjs/operators';
import { spyOnOperator } from '../../shared/testing/utils';
import { DSpaceObject } from '../shared/dspace-object.model';
import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { ApplyPatchObjectCacheAction } from './object-cache.actions';

describe('ServerSyncBufferEffects', () => {
  let ssbEffects: ServerSyncBufferEffects;
  let actions: Observable<any>;
  const testConfig = {
    cache:
      {
        autoSync:
          {
            timePerMethod: {},
            defaultTime: 0
          }
      }
  };
  const selfLink = 'https://rest.api/endpoint/1698f1d3-be98-4c51-9fd8-6bfedcbd59b7';
  let store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
      ],
      providers: [
        ServerSyncBufferEffects,
        provideMockActions(() => actions),
        { provide: GLOBAL_CONFIG, useValue: testConfig },
        { provide: RequestService, useValue: getMockRequestService() },
        {
          provide: ObjectCacheService, useValue: {
            getObjectBySelfLink: (link) => {
              const object = new DSpaceObject();
              object.self = link;
              return observableOf(object);
            }
          }
        },
        { provide: Store, useClass: MockStore }
        // other providers
      ],
    });

    store = TestBed.get(Store);
    ssbEffects = TestBed.get(ServerSyncBufferEffects);
  });

  describe('setTimeoutForServerSync', () => {
    beforeEach(() => {
      spyOnOperator(operators, 'delay').and.returnValue((v) => v);
    });

    it('should return a COMMIT action in response to an ADD action', () => {
      actions = hot('a', {
        a: {
          type: ServerSyncBufferActionTypes.ADD,
          payload: { href: selfLink, method: RestRequestMethod.PUT }
        }
      });

      const expected = cold('b', { b: new CommitSSBAction(RestRequestMethod.PUT) });

      expect(ssbEffects.setTimeoutForServerSync).toBeObservable(expected);
    });
  });

  describe('commitServerSyncBuffer', () => {
    describe('when the buffer is not empty', () => {
      beforeEach(() => {
        store
          .subscribe((state) => {
            (state as any).core = Object({});
            (state as any).core['cache/syncbuffer'] = {
              buffer: [{
                href: selfLink,
                method: RestRequestMethod.PATCH
              }]
            };
          });
      });
      it('should return a list of actions in response to a COMMIT action', () => {
        actions = hot('a', {
          a: {
            type: ServerSyncBufferActionTypes.COMMIT,
            payload: RestRequestMethod.PATCH
          }
        });

        const expected = cold('(bc)', {
            b: new ApplyPatchObjectCacheAction(selfLink),
            c: new EmptySSBAction(RestRequestMethod.PATCH)
          });

        expect(ssbEffects.commitServerSyncBuffer).toBeObservable(expected);
      });
    });

    describe('when the buffer is empty', () => {
      beforeEach(() => {
        store
          .subscribe((state) => {
            (state as any).core = Object({});
            (state as any).core['cache/syncbuffer'] = {
              buffer: []
            };
          });
      });
      it('should return a placeholder action in response to a COMMIT action', () => {
        store.subscribe();
        actions = hot('a', {
          a: {
            type: ServerSyncBufferActionTypes.COMMIT,
            payload: { method: RestRequestMethod.PATCH }
          }
        });
        const expected = cold('b', { b: { type: 'NO_ACTION' } });

        expect(ssbEffects.commitServerSyncBuffer).toBeObservable(expected);
      });
    });
  });
});
