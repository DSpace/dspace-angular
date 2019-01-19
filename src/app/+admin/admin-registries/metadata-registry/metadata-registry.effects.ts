/**
 * Makes sure that if the user navigates to another route, the sidebar is collapsed
 */
import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {filter, map, tap} from "rxjs/operators";
import {SearchSidebarCollapseAction} from "../../../+search-page/search-sidebar/search-sidebar.actions";
import * as fromRouter from '@ngrx/router-store';
import {URLBaser} from "../../../core/url-baser/url-baser";

@Injectable()
export class SearchSidebarEffects {
  private previousPath: string;
  @Effect() routeChange$ = this.actions$
    .pipe(
      ofType(fromRouter.ROUTER_NAVIGATION),
      filter((action) => this.previousPath !== this.getBaseUrl(action)),
      tap((action) => {
        this.previousPath = this.getBaseUrl(action)
      }),
      map(() => new SearchSidebarCollapseAction())
    );

  constructor(private actions$: Actions) {

  }

  getBaseUrl(action: any): string {
    /* tslint:disable:no-string-literal */
    const url: string = action['payload'].routerState.url;
    return new URLBaser(url).toString();
    /* tslint:enable:no-string-literal */
  }

}
