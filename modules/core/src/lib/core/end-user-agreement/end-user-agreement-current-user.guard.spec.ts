import { TestBed } from '@angular/core/testing';
import {
  Router,
  UrlTree,
} from '@angular/router';
import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { APP_CONFIG } from '../config';
import { EndUserAgreementService } from '@dspace/core';
import { endUserAgreementCurrentUserGuard } from '@dspace/core';

describe('endUserAgreementGuard', () => {
  let endUserAgreementService: EndUserAgreementService;
  let router: Router;
  let environment;

  beforeEach(() => {
    endUserAgreementService = jasmine.createSpyObj('endUserAgreementService', {
      hasCurrentUserAcceptedAgreement: observableOf(true),
    });

    router = jasmine.createSpyObj('router', {
      navigateByUrl: {},
      parseUrl: new UrlTree(),
      createUrlTree: new UrlTree(),
    });

    environment = TestBed.inject(APP_CONFIG);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: EndUserAgreementService, useValue: endUserAgreementService },
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
        (endUserAgreementService.hasCurrentUserAcceptedAgreement as jasmine.Spy).and.returnValue(observableOf(false));
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
      it('should return true', (done) => {
        environment.info.enableEndUserAgreement = false;

        const result$ = TestBed.runInInjectionContext(() => {
          return endUserAgreementCurrentUserGuard(undefined, Object.assign({ url: 'redirect' }));
        }) as Observable<boolean | UrlTree>;

        result$.subscribe((result) => {
          expect(result).toEqual(true);
          done();
        });
      });

      it('should not resolve to the end user agreement page', (done) => {
        environment.info.enableEndUserAgreement = false;
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
