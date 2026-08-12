import {
  Inject,
  Injectable,
} from '@angular/core';
import Cookies from 'js-cookie';

import { REQUEST } from '../../../express.tokens';
import {
  CookieService,
  ICookieService,
} from './cookie.service';

@Injectable()
export class ServerCookieService extends CookieService implements ICookieService {
  constructor(@Inject(REQUEST) protected req: any) {
    super();
  }

  public set(
    name: string,
    value: any,
    options?: Cookies.CookieAttributes,
  ): void {
    return;
  }

  public remove(
    name: string,
    options?: Cookies.CookieAttributes,
  ): void {
    return;
  }

  public get(name: string): any {
    if (!this.req || !this.req.cookies) {
      return undefined;
    }

    const raw = this.req.cookies[name];
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
    if (!this.req || !this.req.cookies) {
      return {};
    }

    const all = this.req.cookies;
    const parsed: Record<string, any> = {};

    for (const [key, value] of Object.entries(all)) {
      try {
        parsed[key] = JSON.parse(value as string);
      } catch {
        parsed[key] = value;
      }
    }

    return parsed;
  }
}
