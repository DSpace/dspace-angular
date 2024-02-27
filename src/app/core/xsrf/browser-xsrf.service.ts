import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';
import { take, catchError } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';
import { XSRFService } from './xsrf.service';

@Injectable()
export class BrowserXSRFService extends XSRFService {
  initXSRFToken(httpClient: HttpClient): () => Promise<any> {
    return () => new Promise((resolve) => {
      httpClient.post(new RESTURLCombiner('/security/csrf').toString(), undefined).pipe(
        // errors are to be expected if the token and the cookie don't match, that's what we're
        // trying to fix for future requests, so just emit any observable to end up in the
        // subscribe
        catchError(() => observableOf(null)),
        take(1),
      ).subscribe(() => {
        this.tokenInitialized$.next(true);
      });

      // return immediately, the rest of the app doesn't need to wait for this to finish
      resolve(undefined);
    });
  }
}
