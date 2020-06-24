import { FeatureAuthorizationGuard } from './feature-authorization.guard';
import { AuthorizationDataService } from '../authorization-data.service';
import { FeatureID } from '../feature-id';
import { of as observableOf } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Test implementation of abstract class FeatureAuthorizationGuard
 * Provide the return values of the overwritten getters as constructor arguments
 */
class FeatureAuthorizationGuardImpl extends FeatureAuthorizationGuard {
  constructor(protected authorizationService: AuthorizationDataService,
              protected router: Router,
              protected featureId: FeatureID,
              protected objectUrl: string,
              protected ePersonUuid: string) {
    super(authorizationService, router);
  }

  getFeatureID(): FeatureID {
    return this.featureId;
  }

  getObjectUrl(): string {
    return this.objectUrl;
  }

  getEPersonUuid(): string {
    return this.ePersonUuid;
  }
}

describe('FeatureAuthorizationGuard', () => {
  let guard: FeatureAuthorizationGuard;
  let authorizationService: AuthorizationDataService;
  let router: Router;

  let featureId: FeatureID;
  let objectUrl: string;
  let ePersonUuid: string;

  function init() {
    featureId = FeatureID.LoginOnBehalfOf;
    objectUrl = 'fake-object-url';
    ePersonUuid = 'fake-eperson-uuid';

    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: observableOf(true)
    });
    router = jasmine.createSpyObj('router', {
      parseUrl: {}
    });
    guard = new FeatureAuthorizationGuardImpl(authorizationService, router, featureId, objectUrl, ePersonUuid);
  }

  beforeEach(() => {
    init();
  });

  describe('canActivate', () => {
    it('should call authorizationService.isAuthenticated with the appropriate arguments', () => {
      guard.canActivate(undefined, undefined).subscribe();
      expect(authorizationService.isAuthorized).toHaveBeenCalledWith(featureId, objectUrl, ePersonUuid);
    });
  });
});
