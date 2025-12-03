import {
  Observable,
  of,
} from 'rxjs';

/**
 * Stub service for {@link RequestService}.
 */
export class RequestServiceStub {

  removeByHrefSubstring(_href: string): Observable<boolean> {
    return of(true);
  }

}
