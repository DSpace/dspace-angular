import { distinctUntilChanged, map } from 'rxjs/operators';
import { HostWindowState } from './host-window.reducer';
import { Injectable } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { hasValue } from './empty.util';
import { AppState } from '../app.reducer';

// TODO: ideally we should get these from sass somehow
export enum GridBreakpoint {
  SM_MIN = 576,
  MD_MIN = 768,
  LG_MIN = 992,
  XL_MIN = 1200
}

export enum WidthCategory {
  XS,
  SM,
  MD,
  LG,
  XL
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

  get widthCategory(): Observable<WidthCategory> {
    return this.getWidthObs().pipe(
      map((width: number) => {
        if (width < GridBreakpoint.SM_MIN) {
          return WidthCategory.XS
        } else if (width >= GridBreakpoint.SM_MIN && width < GridBreakpoint.MD_MIN) {
          return WidthCategory.SM
        } else if (width >= GridBreakpoint.MD_MIN && width < GridBreakpoint.LG_MIN) {
          return WidthCategory.MD
        } else if (width >= GridBreakpoint.LG_MIN && width < GridBreakpoint.XL_MIN) {
          return WidthCategory.LG
        } else {
          return WidthCategory.XL
        }
      }),
      distinctUntilChanged()
    );
  }

  isXs(): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat === WidthCategory.XS),
      distinctUntilChanged()
    );
  }

  isSm(): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat === WidthCategory.SM),
      distinctUntilChanged()
    );
  }

  isMd(): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat === WidthCategory.MD),
      distinctUntilChanged()
    );
  }

  isLg(): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat === WidthCategory.LG),
      distinctUntilChanged()
    );
  }

  isXl(): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat === WidthCategory.XL),
      distinctUntilChanged()
    );
  }

  isXsOrSm(): Observable<boolean> {
    return Observable.combineLatest(
        this.isXs(),
        this.isSm(),
        ((isXs, isSm) => isXs || isSm)
      ).distinctUntilChanged();
  }
}
