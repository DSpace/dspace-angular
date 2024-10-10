import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { MathJaxConfig, MathService } from './math.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Provide the MathService for SSR
 */
export class ServerMathService extends MathService {

  protected signal: Subject<boolean>;

  protected mathJaxOptions = {};

  protected mathJax: MathJaxConfig = {
    source: '',
    id: ''
  };
  protected mathJaxFallback: MathJaxConfig = {
    source: '',
    id: ''
  };

  constructor() {
    super();

    this.signal = new ReplaySubject<boolean>();
    this.signal.next(true);
  }

  protected async registerMathJaxAsync(config: MathJaxConfig): Promise<any> {
    return Promise.resolve();
  }

  ready(): Observable<boolean> {
    return this.signal;
  }

  render(element: HTMLElement) {
    return Promise.resolve();
  }
}
