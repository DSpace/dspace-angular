import { HostWindowState } from './host-window.reducer';
import { Injectable } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { hasValue } from './empty.util';
import { AppState } from '../app.reducer';

// TODO: ideally we should get these from sass somehow
export enum GridBreakpoint {
  XS = 0,
  SM = 576,
  MD = 768,
  LG = 992,
  XL = 1200
}

const hostWindowStateSelector = (state: AppState) => state.hostWindow;
const widthSelector = createSelector(hostWindowStateSelector, (hostWindow: HostWindowState) => hostWindow.width);

@Injectable()
export class HostWindowService {

  constructor(
    private store: Store<AppState>
  ) {
  }

  private getWidthObs(): Observable<number> {
    return this.store.select(widthSelector)
      .filter((width) => hasValue(width));
  }

  isXs(): Observable<boolean> {
    return this.getWidthObs()
      .map((width) => width < GridBreakpoint.SM)
      .distinctUntilChanged();
  }

  isSm(): Observable<boolean> {
    return this.getWidthObs()
      .map((width) => width >= GridBreakpoint.SM && width < GridBreakpoint.MD)
      .distinctUntilChanged();
  }

  isMd(): Observable<boolean> {
    return this.getWidthObs()
      .map((width) => width >= GridBreakpoint.MD && width < GridBreakpoint.LG)
      .distinctUntilChanged();
  }

  isLg(): Observable<boolean> {
    return this.getWidthObs()
      .map((width) => width >= GridBreakpoint.LG && width < GridBreakpoint.XL)
      .distinctUntilChanged();
  }

  isXl(): Observable<boolean> {
    return this.getWidthObs()
      .map((width) => width >= GridBreakpoint.XL)
      .distinctUntilChanged();
  }
}
