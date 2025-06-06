import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  Router,
  UrlTree,
} from '@angular/router';
import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { AuthService } from '../../../auth/auth.service';
import { AuthorizationDataService } from '../authorization-data.service';
import { FeatureID } from '../feature-id';
import { singleFeatureAuthorizationGuard } from './single-feature-authorization.guard';

describe('singleFeatureAuthorizationGuard', () => {
  let authorizationService: AuthorizationDataService;
  let router: Router;
  let authService: AuthService;

  let featureId: FeatureID;
  let objectUrl: string;
  let ePersonUuid: string;

  function init() {
    featureId = FeatureID.LoginOnBehalfOf;
    objectUrl = 'fake-object-url';
    ePersonUuid = 'fake-eperson-uuid';

    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: observableOf(true),
    });
    router = jasmine.createSpyObj('router', {
      parseUrl: {},
    });
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: observableOf(true),
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
      ],
    });
  }

  beforeEach(waitForAsync(() => {
    init();
  }));

  describe('canActivate', () => {
    it('should call authorizationService.isAuthenticated with the appropriate arguments', (done: DoneFn) => {
      const result$ = TestBed.runInInjectionContext(() => {
        return singleFeatureAuthorizationGuard(
          () => observableOf(featureId),
          () => observableOf(objectUrl),
          () => observableOf(ePersonUuid),
        )(undefined, { url: 'current-url' } as any);
      }) as Observable<boolean | UrlTree>;


      result$.subscribe(() => {
        expect(authorizationService.isAuthorized).toHaveBeenCalledWith(featureId, objectUrl, ePersonUuid);
        done();
      });
    });

  });
});
