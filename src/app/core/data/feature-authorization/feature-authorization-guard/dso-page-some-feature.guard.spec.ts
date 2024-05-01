import { AuthorizationDataService } from '../authorization-data.service';
import { Router, UrlTree, ResolveFn } from '@angular/router';
import { RemoteData } from '../../remote-data';
import { Observable, of as observableOf } from 'rxjs';
import { DSpaceObject } from '../../../shared/dspace-object.model';
import { AuthService } from '../../../auth/auth.service';
import { dsoPageSomeFeatureGuard } from './dso-page-some-feature.guard';
import { TestBed } from '@angular/core/testing';
import { FeatureID } from '../feature-id';


describe('DsoPageSomeFeatureGuard', () => {
  let authorizationService: AuthorizationDataService;
  let router: Router;
  let authService: AuthService;
  // let resolver: Resolve<RemoteData<any>>;
  let resolver: ResolveFn<Observable<RemoteData<any>>>;
  let object: DSpaceObject;
  let route;
  let parentRoute;

  let featureIds: FeatureID[];

  function init() {
    object = {
      self: 'test-selflink'
    } as DSpaceObject;

    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: observableOf(true)
    });
    router = jasmine.createSpyObj('router', {
      parseUrl: {}
    });
    // resolver = jasmine.createSpyObj('resolver', {
    //   resolve: createSuccessfulRemoteDataObject$(object)
    // });
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: observableOf(true)
    });
    parentRoute = {
      params: {
        id: '3e1a5327-dabb-41ff-af93-e6cab9d032f0'
      }
    };
    route = {
      params: {
      },
      parent: parentRoute
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
      ]
    });

  }

  beforeEach(() => {
    init();
  });

  describe('getObjectUrl', () => {
    it('should return the resolved object\'s selflink', (done) => {

      const result$ = TestBed.runInInjectionContext(() => {
        return dsoPageSomeFeatureGuard(
          () => resolver, () => observableOf(featureIds)
        )(route, { url: 'current-url' } as any);
      }) as Observable<boolean | UrlTree>;

      console.log('result$', result$);

      result$.subscribe(() => {
        expect(authorizationService.isAuthorized).toHaveBeenCalledWith(featureIds[0]);
        done();
      });

      // guard.getObjectUrl(route, undefined).subscribe((selflink) => {
      //   expect(selflink).toEqual(object.self);
      //   done();
      // });
    });
  });

  // describe('getRouteWithDSOId', () => {
  //   it('should return the route that has the UUID of the DSO', () => {
  //     const foundRoute = (guard as any).getRouteWithDSOId(route);
  //     expect(foundRoute).toBe(parentRoute);
  //   });
  // });
});
