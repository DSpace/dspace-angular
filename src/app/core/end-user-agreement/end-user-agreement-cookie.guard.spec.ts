import { EndUserAgreementService } from './end-user-agreement.service';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { EndUserAgreementCookieGuard } from './end-user-agreement-cookie.guard';

describe('EndUserAgreementCookieGuard', () => {
  let guard: EndUserAgreementCookieGuard;

  let endUserAgreementService: EndUserAgreementService;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    endUserAgreementService = jasmine.createSpyObj('endUserAgreementService', {
      isCookieAccepted: true
    });
    authService = jasmine.createSpyObj('authService', ['setRedirectUrl']);
    router = jasmine.createSpyObj('router', {
      navigateByUrl: {},
      parseUrl: new UrlTree()
    });

    guard = new EndUserAgreementCookieGuard(endUserAgreementService, authService, router);
  });

  describe('canActivate', () => {
    describe('when the cookie has been accepted', () => {
      it('should return true', (done) => {
        guard.canActivate(undefined, undefined).subscribe((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when the cookie hasn\'t been accepted', () => {
      beforeEach(() => {
        (endUserAgreementService.isCookieAccepted as jasmine.Spy).and.returnValue(false);
      });

      it('should navigate the user with a redirect url', (done) => {
        const redirect = 'redirect/url';
        guard.canActivate(undefined, Object.assign({ url: redirect })).subscribe(() => {
          expect(authService.setRedirectUrl).toHaveBeenCalledWith(redirect);
          expect(router.navigateByUrl).toHaveBeenCalled();
          done();
        });
      });
    });
  });
});
