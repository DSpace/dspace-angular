import { AuthorizationDataService } from '../authorization-data.service';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { RemoteData } from '../../remote-data';
import { of as observableOf } from 'rxjs';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { DSpaceObject } from '../../../shared/dspace-object.model';
import { DsoPageFeatureGuard } from './dso-page-feature.guard';
import { FeatureID } from '../feature-id';
import { Observable } from 'rxjs/internal/Observable';

/**
 * Test implementation of abstract class DsoPageAdministratorGuard
 */
class DsoPageFeatureGuardImpl extends DsoPageFeatureGuard<any> {
  constructor(protected resolver: Resolve<RemoteData<any>>,
              protected authorizationService: AuthorizationDataService,
              protected router: Router,
              protected featureID: FeatureID) {
    super(resolver, authorizationService, router);
  }

  getFeatureID(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureID> {
    return observableOf(this.featureID);
  }
}

describe('DsoPageAdministratorGuard', () => {
  let guard: DsoPageFeatureGuard<any>;
  let authorizationService: AuthorizationDataService;
  let router: Router;
  let resolver: Resolve<RemoteData<any>>;
  let object: DSpaceObject;

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
    resolver = jasmine.createSpyObj('resolver', {
      resolve: createSuccessfulRemoteDataObject$(object)
    });
    guard = new DsoPageFeatureGuardImpl(resolver, authorizationService, router, undefined);
  }

  beforeEach(() => {
    init();
  });

  describe('getObjectUrl', () => {
    it('should return the resolved object\'s selflink', (done) => {
      guard.getObjectUrl(undefined, undefined).subscribe((selflink) => {
        expect(selflink).toEqual(object.self);
        done();
      });
    });
  });
});
