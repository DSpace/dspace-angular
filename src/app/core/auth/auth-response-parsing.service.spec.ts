import { async, TestBed } from '@angular/core/testing';

import { Store, StoreModule } from '@ngrx/store';

import { GlobalConfig } from '../../../config/global-config.interface';
import { AuthStatusResponse } from '../cache/response.models';
import { ObjectCacheService } from '../cache/object-cache.service';
import { AuthStatus } from './models/auth-status.model';
import { AuthResponseParsingService } from './auth-response-parsing.service';
import { AuthGetRequest, AuthPostRequest } from '../data/request.models';
import { MockStore } from '../../shared/testing/mock-store';

describe('AuthResponseParsingService', () => {
  let service: AuthResponseParsingService;

  const EnvConfig: GlobalConfig = { cache: { msToLive: 1000 } } as any;
  let store: any;
  let objectCacheService: ObjectCacheService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
      ],
      providers: [
        { provide: Store, useClass: MockStore }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    objectCacheService = new ObjectCacheService(store as any);
    service = new AuthResponseParsingService(EnvConfig, objectCacheService);
  });

  describe('parse', () => {
    const validRequest = new AuthPostRequest(
      '69f375b5-19f4-4453-8c7a-7dc5c55aafbb',
      'https://rest.api/dspace-spring-rest/api/authn/login',
      'password=test&user=myself@testshib.org');

    const validRequest2 = new AuthGetRequest(
      '69f375b5-19f4-4453-8c7a-7dc5c55aafbb',
      'https://rest.api/dspace-spring-rest/api/authn/status');

    const validResponse = {
      payload: {
        authenticated: true,
        id: null,
        okay: true,
        token: {
          accessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJlaWQiOiI0ZGM3MGFiNS1jZDczLTQ5MmYtYjAwNy0zMTc5ZDJkOTI5NmIiLCJzZyI6W10sImV4cCI6MTUyNjMxODMyMn0.ASmvcbJFBfzhN7D5ncloWnaVZr5dLtgTuOgHaCKiimc',
          expires: 1526318322000
        },
      } as AuthStatus,
      statusCode: 200,
      statusText: '200'
    };

    const validResponse1 = {
      payload: {},
      statusCode: 404,
      statusText: '404'
    };

    const validResponse2 = {
      payload: {
        authenticated: true,
        id: null,
        okay: true,
        type: 'status',
        _embedded: {
          eperson: {
            canLogIn: true,
            email: 'myself@testshib.org',
            groups: [],
            handle: null,
            id: '4dc70ab5-cd73-492f-b007-3179d2d9296b',
            lastActive: '2018-05-14T17:03:31.277+0000',
            metadata: {
              'eperson.firstname': [
                {
                  language: null,
                  value: 'User'
                }
              ],
              'eperson.lastname': [
                {
                  language: null,
                  value: 'Test'
                }
              ],
              'eperson.language': [
                {
                  language: null,
                  value: 'en'
                }
              ]
            },
            name: 'User Test',
            netid: 'myself@testshib.org',
            requireCertificate: false,
            selfRegistered: false,
            type: 'eperson',
            uuid: '4dc70ab5-cd73-492f-b007-3179d2d9296b',
            _links: {
              self: {
                href: 'https://hasselt-dspace.dev01.4science.it/dspace-spring-rest/api/eperson/epersons/4dc70ab5-cd73-492f-b007-3179d2d9296b'
              }
            }
          }
        },
        _links: {
          eperson: {
            href: 'https://hasselt-dspace.dev01.4science.it/dspace-spring-rest/api/eperson/epersons/4dc70ab5-cd73-492f-b007-3179d2d9296b'
          },
          self: {
            href: 'https://hasselt-dspace.dev01.4science.it/dspace-spring-rest/api/authn/status'
          }
        }
      },
      statusCode: 200,
      statusText: '200'

    };

    it('should return a AuthStatusResponse if data contains a valid AuthStatus object as payload', () => {
      const response = service.parse(validRequest, validResponse);
      expect(response.constructor).toBe(AuthStatusResponse);
    });

    it('should return a AuthStatusResponse if data contains a valid endpoint response', () => {
      const response = service.parse(validRequest2, validResponse2);
      expect(response.constructor).toBe(AuthStatusResponse);
    });

    it('should return a AuthStatusResponse if data contains an empty 404 endpoint response', () => {
      const response = service.parse(validRequest, validResponse1);
      expect(response.constructor).toBe(AuthStatusResponse);
    });

  });
});
