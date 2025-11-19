import { Injectable } from '@angular/core';
import Cookies, { CookieAttributes } from 'js-cookie';

import { CookieService, ICookieService } from './cookie.service';

@Injectable()
export class ClientCookieService
  extends CookieService
  implements ICookieService
{
  public set(name: string, value: any, options?: CookieAttributes): void {
    Cookies.set(name, value, options);
    this.updateSource();
  }

  public remove(name: string, options?: CookieAttributes): void {
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

    Object.entries(all).forEach(([k, v]) => {
      try {
        parsed[k] = JSON.parse(v);
      } catch {
        parsed[k] = v;
      }
    });

    return parsed;
  }
}
