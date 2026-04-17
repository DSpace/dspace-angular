import {
  Observable,
  of,
} from 'rxjs';

import { WidthCategory } from '../host-window.service';

// declare a stub service
export class HostWindowServiceStub {

  private width: number;

  constructor(width) {
    this.setWidth(width);
  }

  setWidth(width) {
    this.width = width;
  }

  isXs(): Observable<boolean> {
    return of(this.width < 576);
  }

  isXsOrSm(): Observable<boolean> {
    return this.isXs();
  }

  isMobile(): Observable<boolean> {
    return this.isXs();
  }

  isUpTo(maxWidthCat: WidthCategory): Observable<boolean> {
    return this.isXs();
  }
}
