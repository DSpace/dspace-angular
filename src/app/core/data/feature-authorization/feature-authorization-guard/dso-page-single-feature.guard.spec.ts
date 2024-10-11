import { TestBed } from '@angular/core/testing';
import {
  ResolveFn,
  Router,
  UrlTree,
} from '@angular/router';
import {
  Observable,
  of,
} from 'rxjs';

import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { AuthService } from '../../../auth/auth.service';
import { DSpaceObject } from '../../../shared/dspace-object.model';
import { RemoteData } from '../../remote-data';
import { AuthorizationDataService } from '../authorization-data.service';
import { FeatureID } from '../feature-id';
import { dsoPageSingleFeatureGuard } from './dso-page-single-feature.guard';
import {
  defaultDSOGetObjectUrl,
  getRouteWithDSOId,
} from './dso-page-some-feature.guard';


describe('DsoPageSingleFeatureGuard', () => {
  let authorizationService: AuthorizationDataService;
  let router: Router;
  let authService: AuthService;
  let resolver: ResolveFn<RemoteData<any>>;
  let object: DSpaceObject;
  let route;
  let parentRoute;

  let featureId: FeatureID;

  function init() {
    object = {
      self: 'test-selflink',
    } as DSpaceObject;

    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: of(true),
    });
    router = jasmine.createSpyObj('router', {
      parseUrl: {},
    });
    resolver = () => createSuccessfulRemoteDataObject$(object);
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: of(true),
    });
    parentRoute = {
      params: {
        id: '3e1a5327-dabb-41ff-af93-e6cab9d032f0',
      },
    };
    route = {
      params: {
      },
      parent: parentRoute,
    };

    featureId = FeatureID.LoginOnBehalfOf;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
      ],
    });
  }

  beforeEach(() => {
    init();
  });

  describe('defaultDSOGetObjectUrl', () => {
    it('should return the resolved object\'s selflink', (done) => {
      defaultDSOGetObjectUrl(resolver)(route, undefined).subscribe((selflink) => {
        expect(selflink).toEqual(object.self);
        done();
      });
    });
  });

  describe('getRouteWithDSOId', () => {
    it('should return the route that has the UUID of the DSO', () => {
      const foundRoute = getRouteWithDSOId(route);
      expect(foundRoute).toBe(parentRoute);
    });
  });

  describe('dsoPageSingleFeatureGuard', () => {
    it('should call authorizationService.isAuthenticated with the appropriate arguments', (done) => {
      const result$ = TestBed.runInInjectionContext(() => {
        return dsoPageSingleFeatureGuard(
          () => resolver, () => of(featureId),
        )(route, { url: 'current-url' } as any);
      }) as Observable<boolean | UrlTree>;

      result$.subscribe(() => {
        expect(authorizationService.isAuthorized).toHaveBeenCalledWith(featureId, object.self, undefined);
        done();
      });
    });
  });
});
