import { AuthorizationDataService } from './authorization-data.service';
import { SiteDataService } from '../site-data.service';
import { AuthService } from '../../auth/auth.service';
import { Site } from '../../shared/site.model';
import { EPerson } from '../../eperson/models/eperson.model';
import { of as observableOf } from 'rxjs';
import { FindListOptions } from '../request.models';
import { FeatureID } from './feature-id';
import { hasValue } from '../../../shared/empty.util';
import { RequestParam } from '../../cache/models/request-param.model';
import { Authorization } from '../../shared/authorization.model';
import { createFailedRemoteDataObject$, createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { createPaginatedList } from '../../../shared/testing/utils.test';
import { Feature } from '../../shared/feature.model';

describe('AuthorizationDataService', () => {
  let service: AuthorizationDataService;
  let siteService: SiteDataService;
  let authService: AuthService;

  let site: Site;
  let ePerson: EPerson;

  const requestService = jasmine.createSpyObj('requestService', {
    setStaleByHrefSubstring: jasmine.createSpy('setStaleByHrefSubstring')
  });

  function init() {
    site = Object.assign(new Site(), {
      id: 'test-site',
      _links: {
        self: { href: 'test-site-href' }
      }
    });
    ePerson = Object.assign(new EPerson(), {
      id: 'test-eperson',
      uuid: 'test-eperson'
    });
    siteService = jasmine.createSpyObj('siteService', {
      find: observableOf(site)
    });
    authService = {
      isAuthenticated: () => observableOf(true),
      getAuthenticatedUserFromStore: () => observableOf(ePerson)
    } as AuthService;
    service = new AuthorizationDataService(requestService, undefined, undefined, undefined, undefined, undefined, undefined, undefined, authService, siteService);
  }

  beforeEach(() => {
    init();
    spyOn(service, 'searchBy').and.returnValue(observableOf(undefined));
  });

  it('should call setStaleByHrefSubstring method', () => {
    service.invalidateAuthorizationsRequestCache();
    expect((service as any).requestService.setStaleByHrefSubstring).toHaveBeenCalledWith((service as any).linkPath);
  });

  describe('searchByObject', () => {
    const objectUrl = 'fake-object-url';
    const ePersonUuid = 'fake-eperson-uuid';

    function createExpected(providedObjectUrl: string, providedEPersonUuid?: string, providedFeatureId?: FeatureID): FindListOptions {
      const searchParams = [new RequestParam('uri', providedObjectUrl)];
      if (hasValue(providedFeatureId)) {
        searchParams.push(new RequestParam('feature', providedFeatureId));
      }
      if (hasValue(providedEPersonUuid)) {
        searchParams.push(new RequestParam('eperson', providedEPersonUuid));
      }
      return Object.assign(new FindListOptions(), { searchParams });
    }

    describe('when no arguments are provided', () => {
      beforeEach(() => {
        service.searchByObject().subscribe();
      });

      it('should call searchBy with the site\'s url', () => {
        expect(service.searchBy).toHaveBeenCalledWith('object', createExpected(site.self), true, true);
      });
    });

    describe('when no arguments except for a feature are provided', () => {
      beforeEach(() => {
        service.searchByObject(FeatureID.LoginOnBehalfOf).subscribe();
      });

      it('should call searchBy with the site\'s url and the feature', () => {
        expect(service.searchBy).toHaveBeenCalledWith('object', createExpected(site.self, null, FeatureID.LoginOnBehalfOf), true, true);
      });
    });

    describe('when a feature and object url are provided', () => {
      beforeEach(() => {
        service.searchByObject(FeatureID.LoginOnBehalfOf, objectUrl).subscribe();
      });

      it('should call searchBy with the object\'s url and the feature', () => {
        expect(service.searchBy).toHaveBeenCalledWith('object', createExpected(objectUrl, null, FeatureID.LoginOnBehalfOf), true, true);
      });
    });

    describe('when all arguments are provided', () => {
      beforeEach(() => {
        service.searchByObject(FeatureID.LoginOnBehalfOf, objectUrl, ePersonUuid).subscribe();
      });

      it('should call searchBy with the object\'s url, user\'s uuid and the feature', () => {
        expect(service.searchBy).toHaveBeenCalledWith('object', createExpected(objectUrl, ePersonUuid, FeatureID.LoginOnBehalfOf), true, true);
      });
    });
  });

  describe('isAuthorized', () => {
    const featureID = FeatureID.AdministratorOf;
    const validPayload = [
      Object.assign(new Authorization(), {
        feature: createSuccessfulRemoteDataObject$(Object.assign(new Feature(), {
          id: 'invalid-feature'
        }))
      }),
      Object.assign(new Authorization(), {
        feature: createSuccessfulRemoteDataObject$(Object.assign(new Feature(), {
          id: featureID
        }))
      })
    ];
    const invalidPayload = [
      Object.assign(new Authorization(), {
        feature: createSuccessfulRemoteDataObject$(Object.assign(new Feature(), {
          id: 'invalid-feature'
        }))
      }),
      Object.assign(new Authorization(), {
        feature: createSuccessfulRemoteDataObject$(Object.assign(new Feature(), {
          id: 'another-invalid-feature'
        }))
      })
    ];
    const emptyPayload = [];

    describe('when searchByObject returns a 401', () => {
      beforeEach(() => {
        spyOn(service, 'searchByObject').and.returnValue(createFailedRemoteDataObject$('Unauthorized', 401));
      });

      it('should return false', (done) => {
        service.isAuthorized(featureID).subscribe((result) => {
          expect(result).toEqual(false);
          done();
        });
      });
    });

    describe('when searchByObject returns an empty list', () => {
      beforeEach(() => {
        spyOn(service, 'searchByObject').and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList(emptyPayload)));
      });

      it('should return false', (done) => {
        service.isAuthorized(featureID).subscribe((result) => {
          expect(result).toEqual(false);
          done();
        });
      });
    });

    describe('when searchByObject returns an invalid list', () => {
      beforeEach(() => {
        spyOn(service, 'searchByObject').and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList(invalidPayload)));
      });

      it('should return true', (done) => {
        service.isAuthorized(featureID).subscribe((result) => {
          expect(result).toEqual(false);
          done();
        });
      });
    });

    describe('when searchByObject returns a valid list', () => {
      beforeEach(() => {
        spyOn(service, 'searchByObject').and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList(validPayload)));
      });

      it('should return true', (done) => {
        service.isAuthorized(featureID).subscribe((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });
  });
});
