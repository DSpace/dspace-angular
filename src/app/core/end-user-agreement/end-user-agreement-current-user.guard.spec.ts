import { TestBed } from '@angular/core/testing';
import {
  Router,
  UrlTree,
} from '@angular/router';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import {
  Observable,
  of,
} from 'rxjs';

import { EndUserAgreementService } from './end-user-agreement.service';
import { endUserAgreementCurrentUserGuard } from './end-user-agreement-current-user.guard';

describe('endUserAgreementGuard', () => {
  let endUserAgreementService: EndUserAgreementService;
  let router: Router;
  let environment: AppConfig;

  beforeEach(() => {
    endUserAgreementService = jasmine.createSpyObj('endUserAgreementService', {
      hasCurrentUserAcceptedAgreement: of(true),
    });

    router = jasmine.createSpyObj('router', {
      navigateByUrl: {},
      parseUrl: new UrlTree(),
      createUrlTree: new UrlTree(),
    });

    environment = {
      info: { enableEndUserAgreement: true },
    } as AppConfig;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: EndUserAgreementService, useValue: endUserAgreementService },
        { provide: APP_CONFIG, useValue: environment },
      ],
    });

  });

  describe('canActivate', () => {
    describe('when the user has accepted the agreement', () => {
      it('should return true', (done) => {
        const result$ = TestBed.runInInjectionContext(() => {
          return endUserAgreementCurrentUserGuard(undefined, Object.assign({ url: 'redirect' }));
        }) as Observable<boolean | UrlTree>;

        result$.subscribe((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when the user hasn\'t accepted the agreement', () => {
      beforeEach(() => {
        (endUserAgreementService.hasCurrentUserAcceptedAgreement as jasmine.Spy).and.returnValue(of(false));
      });

      it('should return a UrlTree', (done) => {
        const result$ = TestBed.runInInjectionContext(() => {
          return endUserAgreementCurrentUserGuard(undefined, Object.assign({ url: 'redirect' }));
        }) as Observable<boolean | UrlTree>;

        result$.subscribe((result) => {
          expect(result).toEqual(jasmine.any(UrlTree));
          done();
        });
      });
    });

    describe('when the end user agreement is disabled', () => {
      beforeEach(() => {
        environment.info.enableEndUserAgreement = false;
      });
      it('should return true', (done) => {
        const result$ = TestBed.runInInjectionContext(() => {
          return endUserAgreementCurrentUserGuard(undefined, Object.assign({ url: 'redirect' }));
        }) as Observable<boolean | UrlTree>;

        result$.subscribe((result) => {
          expect(result).toEqual(true);
          done();
        });
      });

      it('should not resolve to the end user agreement page', (done) => {
        const result$ = TestBed.runInInjectionContext(() => {
          return endUserAgreementCurrentUserGuard(undefined, Object.assign({ url: 'redirect' }));
        }) as Observable<boolean | UrlTree>;

        result$.subscribe((result) => {
          expect(router.navigateByUrl).not.toHaveBeenCalled();
          done();
        });
      });
    });
  });
});
