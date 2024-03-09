import {
  Observable,
  of as observableOf,
} from 'rxjs';

export class TruncatableServiceStub {

  isCollapsed(_id: string): Observable<boolean> {
    return observableOf(false);
  }

  // eslint-disable-next-line no-empty, @typescript-eslint/no-empty-function
  public toggle(_id: string): void {
  }

  // eslint-disable-next-line no-empty, @typescript-eslint/no-empty-function
  public collapse(_id: string): void {
  }

  // eslint-disable-next-line no-empty, @typescript-eslint/no-empty-function
  public expand(_id: string): void {
  }

}
