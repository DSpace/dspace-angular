import { FeatureAuthorizationGuard } from './feature-authorization.guard';
import { AuthorizationDataService } from '../authorization-data.service';
import { FeatureID } from '../feature-id';
import { of as observableOf } from 'rxjs';

/**
 * Test implementation of abstract class FeatureAuthorizationGuard
 * Provide the return values of the overwritten getters as constructor arguments
 */
class FeatureAuthorizationGuardImpl extends FeatureAuthorizationGuard {
  constructor(protected authorizationService: AuthorizationDataService,
              protected featureId: FeatureID,
              protected objectUrl: string,
              protected ePersonUuid: string) {
    super(authorizationService);
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

  let featureId: FeatureID;
  let objectUrl: string;
  let ePersonUuid: string;

  function init() {
    featureId = FeatureID.LoginOnBehalfOf;
    objectUrl = 'fake-object-url';
    ePersonUuid = 'fake-eperson-uuid';

    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthenticated: observableOf(true)
    });
    guard = new FeatureAuthorizationGuardImpl(authorizationService, featureId, objectUrl, ePersonUuid);
  }

  beforeEach(() => {
    init();
  });

  describe('canActivate', () => {
    it('should call authorizationService.isAuthenticated with the appropriate arguments', () => {
      guard.canActivate(undefined, undefined).subscribe();
      expect(authorizationService.isAuthenticated).toHaveBeenCalledWith(featureId, objectUrl, ePersonUuid);
    });
  });

  describe('canLoad', () => {
    it('should call authorizationService.isAuthenticated with the appropriate arguments', () => {
      guard.canLoad(undefined, undefined).subscribe();
      expect(authorizationService.isAuthenticated).toHaveBeenCalledWith(featureId, objectUrl, ePersonUuid);
    });
  });
});
