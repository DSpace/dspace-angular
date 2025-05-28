import {
  fakeAsync,
  TestBed,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {
  Observable,
  of,
} from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { Registration } from '../../core/shared/registration.model';
import { RouterMock } from '../../shared/mocks/router.mock';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../../shared/remote-data.utils';
import { registrationTokenGuard } from './registration-token-guard';

describe('RegistrationTokenGuard',
  () => {
    const route = new RouterMock();
    const registrationWithGroups = Object.assign(new Registration(),
      {
        email: 'test@email.org',
        token: 'test-token',
      });
    const epersonRegistrationService = jasmine.createSpyObj('epersonRegistrationService', {
      searchByTokenAndHandleError: createSuccessfulRemoteDataObject$(registrationWithGroups),
    });
    const authService = {
      getAuthenticatedUserFromStore: () => of(ePerson),
      setRedirectUrl: () => {
        return true;
      },
    } as any;
    const ePerson = Object.assign(new EPerson(), {
      id: 'test-eperson',
      uuid: 'test-eperson',
    });

    describe('when token provided', () => {

      let arouteStub = {
        snapshot: {
          params: {
            token: '123456789',
          },
        },
      };

      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [{ provide: Router, useValue: route },
            {
              provide: ActivatedRoute,
              useValue: arouteStub,
            },
            { provide: EpersonRegistrationService, useValue: epersonRegistrationService },
            { provide: AuthService, useValue: authService },
          ],
        });
      });

      it('can activate must return true when registration data includes groups', ((async) => {
        const activatedRoute = TestBed.inject(ActivatedRoute);
        epersonRegistrationService.searchByTokenAndHandleError.and.returnValue(createSuccessfulRemoteDataObject$(registrationWithGroups));
        activatedRoute.snapshot.params.token = arouteStub.snapshot.params.token;

        const result$ = TestBed.runInInjectionContext(() => {
          return registrationTokenGuard(activatedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
        });

        result$.subscribe((result) => {
          expect(result).toBeTrue();
          async();
        });
      }));
    });

    describe('when no token provided', () => {

      let noTokenRoute = {
        snapshot: {
          params: {
            token: null,
          },
        },
      };

      const registrationWithDifferentUserFromLoggedIn = Object.assign(new Registration(), {
        email: 't1@email.org',
        token: 'test-token',
      });

      const epersonDifferentUserFromLoggedIn = jasmine.createSpyObj('epersonRegistrationService', {
        searchByTokenAndHandleError: of(registrationWithDifferentUserFromLoggedIn),
      });

      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [{ provide: Router, useValue: route },
            {
              provide: ActivatedRoute,
              useValue: noTokenRoute,
            },
            { provide: EpersonRegistrationService, useValue: epersonDifferentUserFromLoggedIn },
            { provide: AuthService, useValue: authService },
          ],
        });
      });

      it('can activate must return false when registration data includes groups', fakeAsync(() => {
        let activatedRoute = TestBed.inject(ActivatedRoute);

        const result$ = TestBed.runInInjectionContext(() => {
          return registrationTokenGuard(activatedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
        });

        let output = null;
        result$.subscribe((result) => (output = result));
        expect(output).toBeFalse();
        expect(route.navigate).toHaveBeenCalledWith(['/404']);
      }));
    });

    describe('when invalid token provided', () => {
      let invalidTokenRoute = {
        snapshot: {
          params: {
            token: 'invalid-token',
          },
        },
      };

      const failedRegistationService = jasmine.createSpyObj('epersonRegistrationService', {
        searchByTokenAndHandleError: createFailedRemoteDataObject$('invalid token', 404),
      });

      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [{ provide: Router, useValue: route },
            {
              provide: ActivatedRoute,
              useValue: invalidTokenRoute,
            },
            { provide: EpersonRegistrationService, useValue: failedRegistationService },
            { provide: AuthService, useValue: authService },
          ],
        });
      });

      it('can activate must navigate through 404 when failed response received', fakeAsync(() => {
        let activatedRoute = TestBed.inject(ActivatedRoute);

        const result$ = TestBed.runInInjectionContext(() => {
          return registrationTokenGuard(activatedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
        });

        result$.subscribe((_) => { });
        expect(route.navigate).toHaveBeenCalledWith(['/404']);
      }));
    });

  });
