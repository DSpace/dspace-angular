import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
} from 'rxjs';

import {
  MathJaxConfig,
  MathService,
} from './math.service';

@Injectable({
  providedIn: 'root',
})
/**
 * Provide the MathService for SSR
 */
export class ServerMathService extends MathService {

  protected isReady$: Subject<boolean>;

  protected mathJaxOptions = {};

  protected mathJax: MathJaxConfig = {
    source: '',
    id: '',
  };
  protected mathJaxFallback: MathJaxConfig = {
    source: '',
    id: '',
  };

  constructor() {
    super();

    this.isReady$ = new BehaviorSubject<boolean>(false);
    this.isReady$.next(true);
  }

  protected async registerMathJaxAsync(config: MathJaxConfig): Promise<any> {
    return Promise.resolve();
  }

  ready(): Observable<boolean> {
    return this.isReady$;
  }

  render(element: HTMLElement) {
    return Promise.resolve();
  }
}
