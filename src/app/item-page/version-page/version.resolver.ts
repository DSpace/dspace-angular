import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { RemoteData } from '../../core/data/remote-data';
import { VersionDataService } from '../../core/data/version-data.service';
import { ResolvedAction } from '../../core/resolving/resolver.actions';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { Version } from '../../core/shared/version.model';
import {
  followLink,
  FollowLinkConfig,
} from '../../shared/utils/follow-link-config.model';

/**
 * The self links defined in this list are expected to be requested somewhere in the near future
 * Requesting them as embeds will limit the number of requests
 */
export const VERSION_PAGE_LINKS_TO_FOLLOW: FollowLinkConfig<Version>[] = [
  followLink('item'),
];

/**
 * This class represents a resolver that requests a specific version before the route is activated
 */
@Injectable({ providedIn: 'root' })
export class VersionResolver implements Resolve<RemoteData<Version>> {
  constructor(
    protected versionService: VersionDataService,
    protected store: Store<any>,
    protected router: Router,
  ) {
  }

  /**
   * Method for resolving a version based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Item>> Emits the found item based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Version>> {
    const versionRD$ = this.versionService.findById(route.params.id,
      true,
      false,
      ...VERSION_PAGE_LINKS_TO_FOLLOW,
    ).pipe(
      getFirstCompletedRemoteData(),
    );

    versionRD$.subscribe((versionRD: RemoteData<Version>) => {
      this.store.dispatch(new ResolvedAction(state.url, versionRD.payload));
    });

    return versionRD$;
  }
}
