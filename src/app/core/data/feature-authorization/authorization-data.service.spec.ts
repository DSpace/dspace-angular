import { hasValue } from '@dspace/shared/utils/empty.util';
import {
  BehaviorSubject,
  combineLatest as observableCombineLatest,
  Observable,
  of,
  throwError,
} from 'rxjs';

import { RequestParam } from '../../cache/models/request-param.model';
import { EPerson } from '../../eperson/models/eperson.model';
import { Authorization } from '../../shared/authorization.model';
import { Feature } from '../../shared/feature.model';
import { Site } from '../../shared/site.model';
import { getMockObjectCacheService } from '../../testing/object-cache.service.mock';
import { createPaginatedList } from '../../testing/utils.test';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../../utilities/remote-data.utils';
import { testSearchDataImplementation } from '../base/search-data.spec';
import { FindListOptions } from '../find-list-options.model';
import { SiteDataService } from '../site-data.service';
import { AuthorizationDataService } from './authorization-data.service';
import { FeatureID } from './feature-id';

describe('AuthorizationDataService', () => {
  let service: AuthorizationDataService;
  let siteService: SiteDataService;
  let objectCache;
  let authService;

  let site: Site;
  let ePerson: EPerson;

  const requestService = jasmine.createSpyObj('requestService', {
    setStaleByHrefSubstring: jasmine.createSpy('setStaleByHrefSubstring'),
  });

  function init() {
    site = Object.assign(new Site(), {
      id: 'test-site',
      _links: {
        self: { href: 'test-site-href' },
      },
    });
    ePerson = Object.assign(new EPerson(), {
      id: 'test-eperson',
      uuid: 'test-eperson',
    });
    siteService = jasmine.createSpyObj('siteService', {
      find: of(site),
    });
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: of(true),
      isAuthenticationReady: of(true),
    });
    objectCache = getMockObjectCacheService();
    service = new AuthorizationDataService(requestService, undefined, objectCache, undefined, siteService, authService);
  }

  beforeEach(() => {
    init();
    spyOn(service, 'searchBy').and.returnValue(of(undefined));
  });

  describe('composition', () => {
    const initService = () => new AuthorizationDataService(null, null, null, null, null, null);
    testSearchDataImplementation(initService);
  });

  it('should call setStaleByHrefSubstring method', () => {
    service.invalidateAuthorizationsRequestCache();
    expect((service as any).requestService.setStaleByHrefSubstring).toHaveBeenCalledWith((service as any).linkPath);
  });

  describe('searchByObject', () => {
    const objectUrl = 'fake-object-url';
    const ePersonUuid = 'fake-eperson-uuid';

    function createExpected(providedObjectUrl: string, providedEPersonUuid?: string, providedFeatureId?: FeatureID): FindListOptions {
      const searchParams = [new RequestParam('uri', providedObjectUrl, false)];
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

    describe('dependencies', () => {
      let addDependencySpy;

      beforeEach(() => {
        (service.searchBy as any).and.returnValue(of('searchBy RD$'));
        addDependencySpy = spyOn(service as any, 'addDependency');
      });

      it('should add a dependency on the objectUrl', (done) => {
        addDependencySpy.and.callFake((href$: Observable<string>, dependsOn$: Observable<string>) => {
          observableCombineLatest([href$, dependsOn$]).subscribe(([href, dependsOn]) => {
            expect(href).toBe('searchBy RD$');
            expect(dependsOn).toBe('object-href');
          });
        });

        service.searchByObject(FeatureID.AdministratorOf, 'object-href').subscribe(() => {
          expect(addDependencySpy).toHaveBeenCalled();
          done();
        });
      });

      it('should add a dependency on the Site object if no objectUrl is given', (done) => {
        addDependencySpy.and.callFake((object$: Observable<any>, dependsOn$: Observable<string>) => {
          observableCombineLatest([object$, dependsOn$]).subscribe(([object, dependsOn]) => {
            expect(object).toBe('searchBy RD$');
            expect(dependsOn).toBe('test-site-href');
          });
        });

        service.searchByObject(FeatureID.AdministratorOf).subscribe(() => {
          expect(addDependencySpy).toHaveBeenCalled();
          done();
        });
      });
    });
  });

  describe('isAuthorized', () => {
    const featureID = FeatureID.AdministratorOf;
    const validPayload = [
      Object.assign(new Authorization(), {
        feature: createSuccessfulRemoteDataObject$(Object.assign(new Feature(), {
          id: 'invalid-feature',
        })),
      }),
      Object.assign(new Authorization(), {
        feature: createSuccessfulRemoteDataObject$(Object.assign(new Feature(), {
          id: featureID,
        })),
      }),
    ];
    const invalidPayload = [
      Object.assign(new Authorization(), {
        feature: createSuccessfulRemoteDataObject$(Object.assign(new Feature(), {
          id: 'invalid-feature',
        })),
      }),
      Object.assign(new Authorization(), {
        feature: createSuccessfulRemoteDataObject$(Object.assign(new Feature(), {
          id: 'another-invalid-feature',
        })),
      }),
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

    describe('anonymous authorization batching', () => {
      let search: jasmine.Spy;
      beforeEach(() => {
        authService.isAuthenticated.and.returnValue(of(false));
        search = spyOn(service, 'searchByObject').and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList(validPayload)));
      });

      it('should use the same unfiltered object request for different anonymous features', () => {
        const results = [];
        service.isAuthorized(featureID, 'item-url').subscribe((value) => results.push(value));
        service.isAuthorized(FeatureID.CanCreateVersion, 'item-url').subscribe((value) => results.push(value));
        expect(results).toEqual([true, false]);
        expect(search.calls.count()).toBe(2);
        expect(search.calls.argsFor(0)).toEqual(search.calls.argsFor(1));
        expect(search).toHaveBeenCalledWith(undefined, 'item-url', undefined, { elementsPerPage: 100 }, true, true, jasmine.anything());
      });

      it('should resolve the site URL for checks without an object', () => {
        service.isAuthorized(featureID).subscribe((value) => expect(value).toBeTrue());
        expect(search).toHaveBeenCalledWith(undefined, site.self, undefined, { elementsPerPage: 100 }, true, true, jasmine.anything());
      });

      [FeatureID.CanSeeQA, FeatureID.CoarNotifyEnabled, FeatureID.CanDownload, FeatureID.CanEditItem,
        FeatureID.CanEditMetadata, FeatureID.CanManageRelationships, FeatureID.CanCreateVersion].forEach((feature) => {
        it(`should preserve the backend result for ${feature}`, () => {
          const grant = Object.assign(new Authorization(), {
            feature: createSuccessfulRemoteDataObject$(Object.assign(new Feature(), { id: feature })),
          });
          search.and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList([grant])));
          service.isAuthorized(feature).subscribe((result) => expect(result).toBeTrue());
        });
      });

      it('should follow pagination before deciding a feature is absent', () => {
        const first = createPaginatedList(invalidPayload);
        first._links.next = { href: 'next-page' };
        search.and.returnValue(createSuccessfulRemoteDataObject$(first));
        const next = spyOn(service, 'findListByHref').and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList(validPayload)));
        spyOn(service as any, 'addDependency');
        service.isAuthorized(featureID, 'item-url', undefined, false, false).subscribe((value) => expect(value).toBeTrue());
        expect(next).toHaveBeenCalledWith('next-page', {}, false, false, jasmine.anything());
        expect((service as any).addDependency).toHaveBeenCalled();
      });

      [401, 403, 404, 500].forEach((status) => {
        it(`should fall back to the individual check when the batch fails (${status})`, () => {
          search.and.callFake((feature) => feature
            ? createSuccessfulRemoteDataObject$(createPaginatedList(validPayload))
            : createFailedRemoteDataObject$('Batch failed', status));
          service.isAuthorized(featureID, 'item-url', undefined, false, false).subscribe((value) => expect(value).toBeTrue());
          expect(search).toHaveBeenCalledWith(featureID, 'item-url', undefined, {}, false, false, jasmine.anything());
        });
      });

      it('should fall back on thrown errors', () => {
        search.and.callFake((feature) => feature
          ? createSuccessfulRemoteDataObject$(createPaginatedList(validPayload))
          : throwError(() => new Error('Batch failed')));
        service.isAuthorized(featureID).subscribe((value) => expect(value).toBeTrue());
      });

      it('should discard partial grants if a later page fails', () => {
        const first = createPaginatedList(validPayload);
        first._links.next = { href: 'failed-page' };
        search.and.callFake((feature) => createSuccessfulRemoteDataObject$(feature ? createPaginatedList([]) : first));
        spyOn(service, 'findListByHref').and.returnValue(createFailedRemoteDataObject$('Failed', 500));
        spyOn(service as any, 'addDependency');
        service.isAuthorized(featureID).subscribe((value) => expect(value).toBeFalse());
        expect(search).toHaveBeenCalledTimes(2);
      });

      it('should retain individual checks for authenticated visitors', () => {
        authService.isAuthenticated.and.returnValue(of(true));
        service.isAuthorized(featureID).subscribe((result) => expect(result).toBeTrue());
        expect(search).toHaveBeenCalledOnceWith(featureID, undefined, undefined, {}, true, true, jasmine.anything());
      });

      it('should retain explicit EPerson requests and request cache options', () => {
        service.isAuthorized(featureID, 'object-url', 'eperson-uuid', false, false).subscribe();
        expect(search).toHaveBeenCalledOnceWith(featureID, 'object-url', 'eperson-uuid', {}, false, false, jasmine.anything());
      });

      it('should leave requests without a specific feature unchanged', () => {
        search.and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList([])));
        service.isAuthorized().subscribe();
        expect(search).toHaveBeenCalledOnceWith(undefined, undefined, undefined, {}, true, true, jasmine.anything());
      });

      [true, false].forEach((authenticated) => {
        it(`should wait until authentication is ready (authenticated: ${authenticated})`, () => {
          const ready$ = new BehaviorSubject(false);
          const authenticated$ = new BehaviorSubject(false);
          authService.isAuthenticationReady.and.returnValue(ready$);
          authService.isAuthenticated.and.returnValue(authenticated$);
          const result = jasmine.createSpy('result');
          service.isAuthorized(featureID, 'item-url').subscribe(result);
          expect(result).not.toHaveBeenCalled();
          expect(search).not.toHaveBeenCalled();
          authenticated$.next(authenticated);
          ready$.next(true);
          expect(result).toHaveBeenCalledOnceWith(true);
          expect(search.calls.mostRecent().args[0]).toEqual(authenticated ? featureID : undefined);
        });
      });

      it('should reconsider authentication on subsequent calls after login', () => {
        service.isAuthorized(featureID, 'item-url').subscribe();
        authService.isAuthenticated.and.returnValue(of(true));
        service.invalidateAuthorizationsRequestCache();
        service.isAuthorized(featureID, 'item-url').subscribe();
        expect(search.calls.argsFor(0)[0]).toBeUndefined();
        expect(search.calls.argsFor(1)[0]).toBe(featureID);
        expect(requestService.setStaleByHrefSubstring).toHaveBeenCalledWith('authorizations');
      });
    });
  });
});
