import { AuthorizationDataService } from '../authorization-data.service';
import { FeatureID } from '../feature-id';
import { of as observableOf } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { singleFeatureAuthorizationGuard } from './single-feature-authorization.guard';


describe('SingleFeatureAuthorizationGuard', () => {
  let guard: any;
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

    guard = singleFeatureAuthorizationGuard;
  }

  beforeEach(() => {
    init();
  });

  describe('canActivate', () => {
    it('should call authorizationService.isAuthorized with the appropriate arguments', (done) => {
      guard(observableOf(featureId), observableOf(objectUrl), observableOf(ePersonUuid))(undefined, { url: 'current-url' } as any).subscribe(() => {
        expect(authorizationService.isAuthorized).toHaveBeenCalledWith(featureId, objectUrl, ePersonUuid);
        done();
      });

    }, 10000);
  });
});

