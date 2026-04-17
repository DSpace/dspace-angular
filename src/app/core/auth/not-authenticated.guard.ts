import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs/operators';
import { PAGE_NOT_FOUND_PATH } from 'src/app/app-routing-paths';

import { HardRedirectService } from '../services/hard-redirect.service';
import { AuthService } from './auth.service';

export const notAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const redirectService = inject(HardRedirectService);

  return authService.isAuthenticated().pipe(
    map((isLoggedIn) => {
      if (isLoggedIn) {
        redirectService.redirect(PAGE_NOT_FOUND_PATH);
        return false;
      }

      return true;
    }),
  );
};
