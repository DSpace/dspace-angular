import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotifyInfoService } from './notify-info.service';

export const notifyInfoGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  notifyInfoService: NotifyInfoService = inject(NotifyInfoService),
  router: Router = inject(Router),
): Observable<boolean | UrlTree> => {
  return notifyInfoService.isCoarConfigEnabled().pipe(
    map(isEnabled => isEnabled ? true : router.parseUrl('/404')),
  );
};
