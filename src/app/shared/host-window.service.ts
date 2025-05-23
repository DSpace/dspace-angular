import { Injectable } from '@angular/core';
import {
  createSelector,
  select,
  Store,
} from '@ngrx/store';
import {
  combineLatest as observableCombineLatest,
  Observable,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';

import { AppState } from '../app.reducer';
import { hasValue } from './empty.util';
import { CSSVariableService } from './sass-helper/css-variable.service';
import { HostWindowState } from './search/host-window.reducer';

export enum WidthCategory {
  XS = 0,
  SM = 1,
  MD = 2,
  LG = 3,
  XL = 4,
}

export const maxMobileWidth = WidthCategory.SM;

const hostWindowStateSelector = (state: AppState) => state.hostWindow;
const widthSelector = createSelector(hostWindowStateSelector, (hostWindow: HostWindowState) => hostWindow.width);

@Injectable({ providedIn: 'root' })
export class HostWindowService {
  private breakPoints: { XS_MIN, SM_MIN, MD_MIN, LG_MIN, XL_MIN } = {} as any;

  constructor(
    private store: Store<AppState>,
    private variableService: CSSVariableService,
  ) {
    /* See _exposed_variables.scss */
    variableService.getAllVariables()
      .subscribe((variables) => {
        this.breakPoints.XL_MIN = parseInt(variables['--bs-xl'], 10);
        this.breakPoints.LG_MIN = parseInt(variables['--bs-lg'], 10);
        this.breakPoints.MD_MIN = parseInt(variables['--bs-md'], 10);
        this.breakPoints.SM_MIN = parseInt(variables['--bs-sm'], 10);
      });
  }

  private getWidthObs(): Observable<number> {
    return this.store.pipe(
      select(widthSelector),
      filter((width) => hasValue(width)),
    );
  }

  get widthCategory(): Observable<WidthCategory> {
    return this.getWidthObs().pipe(
      map((width: number) => {
        if (width < this.breakPoints.SM_MIN) {
          return WidthCategory.XS;
        } else if (width >= this.breakPoints.SM_MIN && width < this.breakPoints.MD_MIN) {
          return WidthCategory.SM;
        } else if (width >= this.breakPoints.MD_MIN && width < this.breakPoints.LG_MIN) {
          return WidthCategory.MD;
        } else if (width >= this.breakPoints.LG_MIN && width < this.breakPoints.XL_MIN) {
          return WidthCategory.LG;
        } else {
          return WidthCategory.XL;
        }
      }),
      distinctUntilChanged(),
    );
  }

  isXs(): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat === WidthCategory.XS),
      distinctUntilChanged(),
    );
  }

  isSm(): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat === WidthCategory.SM),
      distinctUntilChanged(),
    );
  }

  isMd(): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat === WidthCategory.MD),
      distinctUntilChanged(),
    );
  }

  isLg(): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat === WidthCategory.LG),
      distinctUntilChanged(),
    );
  }

  isXl(): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat === WidthCategory.XL),
      distinctUntilChanged(),
    );
  }

  is(exactWidthCat: WidthCategory): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat === exactWidthCat),
      distinctUntilChanged(),
    );
  }

  isIn(widthCatArray: [WidthCategory]): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCatArray.includes(widthCat)),
      distinctUntilChanged(),
    );
  }

  isUpTo(maxWidthCat: WidthCategory): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat <= maxWidthCat),
      distinctUntilChanged(),
    );
  }

  isMobile(): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat <= maxMobileWidth),
      distinctUntilChanged(),
    );
  }

  isDesktop(): Observable<boolean> {
    return this.widthCategory.pipe(
      map((widthCat: WidthCategory) => widthCat > maxMobileWidth),
      distinctUntilChanged(),
    );
  }

  isXsOrSm(): Observable<boolean> {
    return observableCombineLatest([
      this.isXs(),
      this.isSm(),
    ]).pipe(
      map(([isXs, isSm]) => isXs || isSm),
      distinctUntilChanged(),
    );
  }
}
