import {
  Inject,
  Injectable,
} from '@angular/core';
import { CookieAttributes } from 'js-cookie';

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

  public set(name: string, value: any, options?: CookieAttributes): void {
    return;
  }

  public remove(name: string, options?: CookieAttributes): void {
    return;
  }

  public get(name: string): any {
    try {
      return JSON.parse(this.req.cookies[name]);
    } catch (err) {
      return this.req ? this.req.cookies[name] : undefined;
    }
  }

  public getAll(): any {
    if (this.req) {
      return this.req.cookies;
    }
  }
}
