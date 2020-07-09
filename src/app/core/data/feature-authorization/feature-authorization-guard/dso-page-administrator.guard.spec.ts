import { DsoPageAdministratorGuard } from './dso-page-administrator.guard';
import { AuthorizationDataService } from '../authorization-data.service';
import { Resolve, Router } from '@angular/router';
import { RemoteData } from '../../remote-data';
import { of as observableOf } from 'rxjs';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { DSpaceObject } from '../../../shared/dspace-object.model';

/**
 * Test implementation of abstract class DsoPageAdministratorGuard
 */
class DsoPageAdministratorGuardImpl extends DsoPageAdministratorGuard<any> {
  constructor(protected resolver: Resolve<RemoteData<any>>,
              protected authorizationService: AuthorizationDataService,
              protected router: Router) {
    super(resolver, authorizationService, router);
  }
}

describe('DsoPageAdministratorGuard', () => {
  let guard: DsoPageAdministratorGuard<any>;
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
    guard = new DsoPageAdministratorGuardImpl(resolver, authorizationService, router);
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
