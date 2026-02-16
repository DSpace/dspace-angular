import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { RemoteData } from '@dspace/core/data/remote-data';
import { EPersonDataService } from '@dspace/core/eperson/eperson-data.service';
import { EPerson } from '@dspace/core/eperson/models/eperson.model';
import { ResolvedAction } from '@dspace/core/resolving/resolver.actions';
import {
  followLink,
  FollowLinkConfig,
} from '@dspace/core/shared/follow-link-config.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

export const EPERSON_EDIT_FOLLOW_LINKS: FollowLinkConfig<EPerson>[] = [
  followLink('groups'),
];

/**
 * This class represents a resolver that requests a specific {@link EPerson} before the route is activated
 */
@Injectable({
  providedIn: 'root',
})
export class EPersonResolver  {

  constructor(
    protected ePersonService: EPersonDataService,
    protected store: Store<any>,
  ) {
  }

  /**
   * Method for resolving a {@link EPerson} based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns `Observable<<RemoteData<EPerson>>` Emits the found {@link EPerson} based on the parameters in the current
   * route, or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<EPerson>> {
    const ePersonRD$: Observable<RemoteData<EPerson>> = this.ePersonService.findById(route.params.id,
      true,
      false,
      ...EPERSON_EDIT_FOLLOW_LINKS,
    ).pipe(
      getFirstCompletedRemoteData(),
    );

    ePersonRD$.subscribe((ePersonRD: RemoteData<EPerson>) => {
      this.store.dispatch(new ResolvedAction(state.url, ePersonRD.payload));
    });

    return ePersonRD$;
  }

}
