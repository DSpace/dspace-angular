import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export abstract class XSRFService {
  public tokenInitialized$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  abstract initXSRFToken(httpClient: HttpClient): () => Promise<any>;
}
