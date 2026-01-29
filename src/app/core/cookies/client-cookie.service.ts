import { Injectable } from '@angular/core';
import Cookies from 'js-cookie';

import {
  CookieService,
  ICookieService,
} from './cookie.service';

@Injectable()
export class ClientCookieService extends CookieService implements ICookieService {

  public set(name: string, value: any, options?: Cookies.CookieAttributes): void {
    const toStore = typeof value === 'string' ? value : JSON.stringify(value);
    Cookies.set(name, toStore, options);
    this.updateSource();
  }

  public remove(name: string, options?: Cookies.CookieAttributes): void {
    Cookies.remove(name, options);
    this.updateSource();
  }

  public get(name: string): any {
    const raw = Cookies.get(name);
    if (raw === undefined) {
      return undefined;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  public getAll(): any {
    const all = Cookies.get();
    const parsed: Record<string, any> = {};

    Object.entries(all).forEach(([key, value]) => {
      try {
        parsed[key] = JSON.parse(value);
      } catch {
        parsed[key] = value;
      }
    });

    return parsed;
  }
}
