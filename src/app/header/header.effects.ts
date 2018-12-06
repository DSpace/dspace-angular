import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import * as fromRouter from '@ngrx/router-store';
import { map } from 'rxjs/operators';

import { HeaderCollapseAction } from './header.actions';
import { HostWindowActionTypes } from '../shared/host-window.actions';

@Injectable()
export class HeaderEffects {

  @Effect() resize$ = this.actions$
    .pipe(
      ofType(HostWindowActionTypes.RESIZE),
      map(() => new HeaderCollapseAction())
    );

  @Effect() routeChange$ = this.actions$
    .pipe(
      ofType(fromRouter.ROUTER_NAVIGATION),
      map(() => new HeaderCollapseAction())
    );

  constructor(private actions$: Actions) {

  }

}
