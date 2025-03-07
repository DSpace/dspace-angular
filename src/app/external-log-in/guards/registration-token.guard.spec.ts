import {
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { Registration } from '../../core/shared/registration.model';
import { RouterMock } from '../../shared/mocks/router.mock';
import {
  createFailedRemoteDataObject$,
  createNoContentRemoteDataObject$,
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
      getAuthenticatedUserFromStore: () => observableOf(ePerson),
      setRedirectUrl: () => {
        return true;
      },
    } as any;
    const ePerson = Object.assign(new EPerson(), {
      id: 'test-eperson',
      uuid: 'test-eperson',
    });

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

    describe('when token provided', () => {
      it('can activate must return true when registration data includes groups', fakeAsync(() => {
        const activatedRoute = TestBed.inject(ActivatedRoute);

        const result$ = TestBed.runInInjectionContext(() => {
          return registrationTokenGuard(activatedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
        });

        let output = null;
        result$.subscribe((result) => (output = result));
        tick(100);
        expect(output).toBeTrue();
      }));
    });

    describe('when no token provided', () => {
      it('can activate must return false when registration data includes groups', fakeAsync(() => {
        const registrationWithDifferentUserFromLoggedIn = Object.assign(new Registration(), {
          email: 't1@email.org',
          token: 'test-token',
        });
        epersonRegistrationService.searchByTokenAndHandleError.and.returnValue(observableOf(registrationWithDifferentUserFromLoggedIn));
        let activatedRoute = TestBed.inject(ActivatedRoute);
        activatedRoute.snapshot.params.token = null;

        const result$ = TestBed.runInInjectionContext(() => {
          return registrationTokenGuard(activatedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
        });

        let output = null;
        result$.subscribe((result) => (output = result));
        expect(output).toBeFalse();
      }));
    });

    describe('when invalid token provided', () => {
      it('can activate must navigate through 404 when no content received', fakeAsync(() => {
        epersonRegistrationService.searchByTokenAndHandleError.and.returnValue(createNoContentRemoteDataObject$());
        let activatedRoute = TestBed.inject(ActivatedRoute);
        activatedRoute.snapshot.params.token = 'invalid-token';

        const result$ = TestBed.runInInjectionContext(() => {
          return registrationTokenGuard(activatedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
        });

        result$.subscribe((_) => { });
        expect(route.navigate).toHaveBeenCalledWith(['/404']);
      }));
      it('can activate must navigate through 404 when no failed response received', fakeAsync(() => {
        epersonRegistrationService.searchByTokenAndHandleError.and.returnValue(createFailedRemoteDataObject$('invalid token', 404));
        let activatedRoute = TestBed.inject(ActivatedRoute);
        activatedRoute.snapshot.params.token = 'error-invalid-token';

        const result$ = TestBed.runInInjectionContext(() => {
          return registrationTokenGuard(activatedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
        });

        result$.subscribe((_) => { });
        expect(route.navigate).toHaveBeenCalledWith(['/404']);
      }));
    });

  });
