import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
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

/**
 * Guard that checks if the PDF viewer is enabled
 * @method canActivate
 */
export const pdfViewerEnabledGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  appConfig: AppConfig = inject(APP_CONFIG),
): Observable<boolean | UrlTree> => {
  return of(appConfig.pdfViewer.enabled);
};
