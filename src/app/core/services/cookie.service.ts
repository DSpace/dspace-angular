import { Injectable } from '@angular/core';
import { CookieAttributes } from 'js-cookie';
import {
  Observable,
  Subject,
} from 'rxjs';

export interface ICookieService {
  readonly cookies$: Observable<{ readonly [key: string]: any }>;

  getAll(): any;

  get(name: string): any;

  set(name: string, value: any, options?: CookieAttributes): void;

  remove(name: string, options?: CookieAttributes): void;
}

@Injectable()
export abstract class CookieService implements ICookieService {
  protected readonly cookieSource = new Subject<{ readonly [key: string]: any }>();
  public readonly cookies$ = this.cookieSource.asObservable();

  public abstract set(name: string, value: any, options?: CookieAttributes): void;

  public abstract remove(name: string, options?: CookieAttributes): void;

  public abstract get(name: string): any;

  public abstract getAll(): any;

  protected updateSource() {
    this.cookieSource.next(this.getAll());
  }
}
