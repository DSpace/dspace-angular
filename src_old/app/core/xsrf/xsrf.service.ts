import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Abstract CSRF/XSRF Service used to track whether a CSRF token has been received
 * from the DSpace REST API. Once it is received, the "tokenInitialized$" flag will
 * be set to "true".
 */
@Injectable()
export abstract class XSRFService {
  public tokenInitialized$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  abstract initXSRFToken(httpClient: HttpClient): () => Promise<any>;
}
