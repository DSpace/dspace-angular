import { ReloadGuard } from './reload.guard';
import { Router } from '@angular/router';

describe('ReloadGuard', () => {
  let guard: ReloadGuard;
  let router: Router;

  beforeEach(() => {
    router = jasmine.createSpyObj('router', ['parseUrl', 'createUrlTree']);
    guard = new ReloadGuard(router);
  });

  describe('canActivate', () => {
    let route;

    describe('when the route\'s query params contain a redirect url', () => {
      let redirectUrl;

      beforeEach(() => {
        redirectUrl = '/redirect/url?param=extra';
        route = {
          queryParams: {
            redirect: redirectUrl
          }
        };
      });

      it('should create a UrlTree with the redirect URL', () => {
        guard.canActivate(route, undefined);
        expect(router.parseUrl).toHaveBeenCalledWith(redirectUrl);
      });
    });

    describe('when the route\'s query params doesn\'t contain a redirect url', () => {
      beforeEach(() => {
        route = {
          queryParams: {}
        };
      });

      it('should create a UrlTree to home', () => {
        guard.canActivate(route, undefined);
        expect(router.createUrlTree).toHaveBeenCalledWith(['home']);
      });
    });
  });
});
