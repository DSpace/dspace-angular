import { isPlatformServer } from '@angular/common';
import {
  inject,
  PLATFORM_ID,
} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { TOKENITEM } from '@dspace/core/auth/models/auth-token-info.model';
import { CookieService } from '@dspace/core/cookies/cookie.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { HardRedirectService } from '@dspace/core/services/hard-redirect.service';
import { Item } from '@dspace/core/shared/item.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { hasValue } from '@dspace/shared/utils/empty.util';
import {
  Observable,
  of,
} from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import {
  isAbsoluteUrl,
  isTrueValue,
} from './item-withdrawn-metadata';

/**
 * Resolver redirecting the reader of a withdrawn item to the record that replaces it,
 * skipping the tombstone page, when the item asks for it through its metadata.
 *
 * The redirect happens only when all of the following hold:
 * - the feature is enabled by configuration (item.withdrawn.redirectEnabled)
 * - the item is withdrawn
 * - the metadata holding the redirect flag of the item is true
 * - the metadata holding the replacement of the item is an absolute http(s) url
 * - the current user cannot reinstate the item, i.e. is not an administrator of it,
 *   unless item.withdrawn.redirectAdmins is turned on
 *
 * Server side this is a real HTTP redirect, so that crawlers and permanent links follow
 * it; client side it is a hard navigation to the new location.
 *
 * A request carrying an authentication cookie is never redirected while rendering on the
 * server: whether the reader is an administrator of the item can only be established
 * reliably in the browser, and sending an administrator to the replacement record would
 * take the item away from the only users who can still fix it. For those requests the
 * decision is left to the client, which runs this resolver again.
 *
 * It resolves to true when the reader has been redirected, false otherwise.
 */
export const itemWithdrawnRedirectResolver: ResolveFn<boolean> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  appConfig: AppConfig = inject<AppConfig>(APP_CONFIG),
  platformId: any = inject(PLATFORM_ID),
  hardRedirectService: HardRedirectService = inject(HardRedirectService),
  itemDataService: ItemDataService = inject(ItemDataService),
  authorizationService: AuthorizationDataService = inject(AuthorizationDataService),
  cookieService: CookieService = inject(CookieService),
): Observable<boolean> => {
  const config = appConfig.item.withdrawn;
  const itemId = route.params.id ?? route.parent?.params?.id;

  if (!config?.redirectEnabled || !hasValue(itemId)) {
    return of(false);
  }

  // leave the decision to the browser when the request comes from a logged in user,
  // whose permissions on the item cannot be resolved reliably while rendering server side
  if (isPlatformServer(platformId) && !config.redirectAdmins && hasValue(cookieService.get(TOKENITEM))) {
    return of(false);
  }

  /**
   * Returns the url the reader has to be redirected to, or null when the item does not ask
   * for an automatic redirect.
   */
  const getRedirectUrl = (itemRD: RemoteData<Item>): string => {
    if (!itemRD.hasSucceeded || !hasValue(itemRD.payload) || !itemRD.payload.isWithdrawn) {
      return null;
    }
    const item = itemRD.payload;
    if (!isTrueValue(item.firstMetadataValue(config.redirectField))) {
      return null;
    }
    const url = item.firstMetadataValue(config.replacementField);
    return isAbsoluteUrl(url) ? url.trim() : null;
  };

  return itemDataService.findById(itemId).pipe(
    getFirstCompletedRemoteData(),
    switchMap((itemRD: RemoteData<Item>) => {
      const url = getRedirectUrl(itemRD);
      if (!hasValue(url)) {
        return of(false);
      }

      const redirect = (): boolean => {
        if (isPlatformServer(platformId)) {
          hardRedirectService.redirect(url, config.redirectStatusCode);
        } else {
          hardRedirectService.redirect(url);
        }
        return true;
      };

      if (config.redirectAdmins) {
        return of(redirect());
      }

      // administrators are not redirected, so that they keep access to the item:
      // being allowed to reinstate a withdrawn item identifies them. The cached
      // authorizations are not reused, as they may have been requested before login
      return authorizationService.isAuthorized(FeatureID.ReinstateItem, itemRD.payload.self, undefined, false).pipe(
        map((canReinstate: boolean) => canReinstate ? false : redirect()),
      );
    }),
  );
};
