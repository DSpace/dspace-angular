import { TestBed } from '@angular/core/testing';
import {
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

import { EndUserAgreementService } from './end-user-agreement.service';
import { endUserAgreementCookieGuard } from './end-user-agreement-cookie.guard';

describe('endUserAgreementCookieGuard', () => {

  let endUserAgreementService: EndUserAgreementService;
  let router: Router;

  beforeEach(() => {
    endUserAgreementService = jasmine.createSpyObj('endUserAgreementService', {
      isCookieAccepted: true,
    });
    router = jasmine.createSpyObj('router', {
      navigateByUrl: {},
      parseUrl: new UrlTree(),
      createUrlTree: new UrlTree(),
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: EndUserAgreementService, useValue: endUserAgreementService },
      ],
    });
  });

  describe('canActivate', () => {
    describe('when the cookie has been accepted', () => {
      it('should return true', (done) => {
        const result$ = TestBed.runInInjectionContext(() => {
          return endUserAgreementCookieGuard(undefined, { url: Object.assign({ url: 'redirect' }) } as any);
        }) as Observable<boolean | UrlTree>;

        result$.subscribe((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when the cookie hasn\'t been accepted', () => {
      beforeEach(() => {
        (endUserAgreementService.isCookieAccepted as jasmine.Spy).and.returnValue(false);
      });

      it('should return a UrlTree', (done) => {
        const result$ = TestBed.runInInjectionContext(() => {
          return endUserAgreementCookieGuard(undefined, { url: Object.assign({ url: 'redirect' }) } as any);
        }) as Observable<boolean | UrlTree>;

        result$.subscribe((result) => {
          expect(result).toEqual(jasmine.any(UrlTree));
          done();
        });
      });
    });
  });
});
