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

import {
  AuthService,
  LOGIN_ROUTE,
} from '../../core/auth/auth.service';
import {
  getAllSucceededRemoteDataPayload,
  getPaginatedListPayload,
} from '../../core/shared/operators';
import { EditItemDataService } from '../../core/submission/edititem-data.service';
import { EditItemMode } from '../../core/submission/models/edititem-mode.model';
import { isNotEmpty } from '../../shared/empty.util';

export const editItemRelationsGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const editItemService = inject(EditItemDataService);
  const authService = inject(AuthService);

  const handleEditable = (itemId: string, url: string): Observable<boolean | UrlTree> => {
    return editItemService.searchEditModesById(itemId).pipe(
      getAllSucceededRemoteDataPayload(),
      getPaginatedListPayload(),
      map((editModes: EditItemMode[]) => {
        if (isNotEmpty(editModes) && editModes.length > 0) {
          return true;
        } else {
          authService.setRedirectUrl(url);
          authService.removeToken();
          return router.createUrlTree([LOGIN_ROUTE]);
        }
      }),
    );
  };

  const url = state.url;
  return handleEditable(route.params.id, url);
};
