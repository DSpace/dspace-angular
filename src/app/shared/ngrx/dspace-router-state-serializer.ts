import { Injectable } from '@angular/core';
import {
  Params,
  RouterStateSnapshot,
} from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
}

@Injectable()
export class DSpaceRouterStateSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const queryParams = routerState.root.queryParams;

    // Only return an object including the URL and query params
    // instead of the entire snapshot
    return { url, queryParams };
  }
}
