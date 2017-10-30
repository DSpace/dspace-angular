import { Observable } from 'rxjs/Observable';

// declare a stub service
export class MockHostWindowService {

  private width: number;

  constructor(width) {
    this.setWidth(width);
  }

  setWidth(width) {
    this.width = width;
  }

  isXs(): Observable<boolean> {
    return Observable.of(this.width < 576);
  }

  isSm(): Observable<boolean> {
    return Observable.of(this.width < 768);
  }
}
