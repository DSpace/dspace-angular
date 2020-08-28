import { EndUserAgreementGuard } from './end-user-agreement.guard';
import { EndUserAgreementService } from './end-user-agreement.service';
import { Router, UrlTree } from '@angular/router';
import { of as observableOf } from 'rxjs';
import { AuthService } from '../auth/auth.service';

describe('EndUserAgreementGuard', () => {
  let guard: EndUserAgreementGuard;

  let endUserAgreementService: EndUserAgreementService;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    endUserAgreementService = jasmine.createSpyObj('endUserAgreementService', {
      hasCurrentUserAcceptedAgreement: observableOf(true)
    });
    authService = jasmine.createSpyObj('authService', ['setRedirectUrl']);
    router = jasmine.createSpyObj('router', {
      navigateByUrl: {},
      parseUrl: new UrlTree()
    });

    guard = new EndUserAgreementGuard(endUserAgreementService, authService, router);
  });

  describe('canActivate', () => {
    describe('when the user has accepted the agreement', () => {
      it('should return true', (done) => {
        guard.canActivate(undefined, undefined).subscribe((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when the user hasn\'t accepted the agreement', () => {
      beforeEach(() => {
        (endUserAgreementService.hasCurrentUserAcceptedAgreement as jasmine.Spy).and.returnValue(observableOf(false));
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
