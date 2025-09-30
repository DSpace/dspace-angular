import {
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  Params,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {
  Observable,
  of,
} from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { AuthRegistrationType } from '../../core/auth/models/auth.registration-type';
import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { Registration } from '../../core/shared/registration.model';
import { RouterMock } from '../../shared/mocks/router.mock';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../../shared/remote-data.utils';
import { ReviewAccountGuard } from './review-account.guard';

describe('ReviewAccountGuard', () => {
  let epersonRegistrationService: any;
  let authService: any;
  let router: any;

  const registrationMock = Object.assign(new Registration(), {
    email: 'test@email.org',
    registrationType: AuthRegistrationType.Validation,
  });

  beforeEach(() => {
    const paramObject: Params = { token: '1234' };
    epersonRegistrationService = jasmine.createSpyObj('epersonRegistrationService', {
      searchByTokenAndHandleError: createSuccessfulRemoteDataObject$(registrationMock),
    });
    authService = {
      isAuthenticated: () => of(true),
    } as any;
    router = new RouterMock();

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap(paramObject)),
            snapshot: {
              params: {
                token: '1234',
              },
            },
          },
        },
        { provide: EpersonRegistrationService, useValue: epersonRegistrationService },
        { provide: AuthService, useValue: authService },
      ],
    });
  });


  it('should return true when registration type is validation', fakeAsync(() => {
    const state = {} as RouterStateSnapshot;
    const activatedRoute = TestBed.inject(ActivatedRoute);

    const result$ = TestBed.runInInjectionContext(()=> {
      return ReviewAccountGuard(activatedRoute.snapshot, state) as Observable<boolean>;
    });

    let output = null;
    result$.subscribe((result) => (output = result));
    tick(100);
    expect(output).toBeTrue();
  }));


  it('should navigate to 404 if the registration search fails', fakeAsync(() => {
    const state = {} as RouterStateSnapshot;
    const activatedRoute = TestBed.inject(ActivatedRoute);
    epersonRegistrationService.searchByTokenAndHandleError.and.returnValue(createFailedRemoteDataObject$());

    const result$ = TestBed.runInInjectionContext(() => {
      return ReviewAccountGuard(activatedRoute.snapshot, state) as Observable<boolean>;
    });

    let output = null;
    result$.subscribe((result) => (output = result));
    tick(100);
    expect(output).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/404']);
  }));



  it('should navigate to 404 if the registration type is not validation and the user is not authenticated', fakeAsync(() => {
    registrationMock.registrationType = AuthRegistrationType.Orcid;
    epersonRegistrationService.searchByTokenAndHandleError.and.returnValue(createSuccessfulRemoteDataObject$(registrationMock));
    spyOn(authService, 'isAuthenticated').and.returnValue(of(false));
    const activatedRoute = TestBed.inject(ActivatedRoute);

    const result$ = TestBed.runInInjectionContext(() => {
      return ReviewAccountGuard(activatedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
    });

    let output = null;
    result$.subscribe((result) => (output = result));
    tick(100);
    expect(output).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/404']);
  }));
});

