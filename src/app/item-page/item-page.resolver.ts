import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RemoteData } from '../core/data/remote-data';
import { ItemDataService } from '../core/data/item-data.service';
import { Item } from '../core/shared/item.model';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { hasValue, isNotEmpty } from '../shared/empty.util';
import { getItemPageRoute } from './item-page-routing-paths';
import { ItemResolver } from './item.resolver';
import { redirectOn204, redirectOn4xx } from '../core/shared/authorized.operators';
import { AuthService } from '../core/auth/auth.service';
import { HardRedirectService } from '../core/services/hard-redirect.service';
import { isPlatformServer } from '@angular/common';

/**
 * This class represents a resolver that requests a specific item before the route is activated and will redirect to the
 * entity page
 */
@Injectable()
export class ItemPageResolver extends ItemResolver {
  constructor(
    @Inject(PLATFORM_ID) protected platformId: any,
    protected hardRedirectService: HardRedirectService,
    protected itemService: ItemDataService,
    protected store: Store<any>,
    protected router: Router,
    protected authService: AuthService,
  ) {
    super(itemService, store, router);
  }

  /**
   * Method for resolving an item based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Item>> Emits the found item based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Item>> {
    return super.resolve(route, state).pipe(
      redirectOn204<Item>(this.router, this.authService),
      redirectOn4xx(this.router, this.authService),
      map((rd: RemoteData<Item>) => {
        if (rd.hasSucceeded && hasValue(rd.payload)) {
          // Check if custom url not empty and if the current id parameter is different from the custom url redirect to custom url
          if (hasValue(rd.payload.metadata) && isNotEmpty(rd.payload.metadata['cris.customurl'])) {
            if (route.params.id !== rd.payload.metadata['cris.customurl'][0].value) {
              const newUrl = state.url.replace(route.params.id, rd.payload.metadata['cris.customurl'][0].value);
              this.router.navigateByUrl(newUrl);
            }
          } else {
            const thisRoute = state.url;

            // Angular uses a custom function for encodeURIComponent, (e.g. it doesn't encode commas
            // or semicolons) and thisRoute has been encoded with that function. If we want to compare
            // it with itemRoute, we have to run itemRoute through Angular's version as well to ensure
            // the same characters are encoded the same way.
            const itemRoute = this.router.parseUrl(getItemPageRoute(rd.payload)).toString();

            if (!thisRoute.startsWith(itemRoute)) {
              const itemId = rd.payload.uuid;
              const subRoute = thisRoute.substring(thisRoute.indexOf(itemId) + itemId.length, thisRoute.length);
              if (isPlatformServer(this.platformId)) {
                this.hardRedirectService.redirect(itemRoute + subRoute, 301);
              } else {
                this.router.navigateByUrl(itemRoute + subRoute);
              }
            }
          }
        }
        return rd;
      }),
    );
  }
}
