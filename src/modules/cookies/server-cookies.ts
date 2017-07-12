import { Injectable } from '@angular/core';

import { Cookies } from './cookies';

@Injectable()
export class ServerCookies implements Cookies {

  // tslint:disable:no-empty
  set(name: string, value: string, days: number, path?: string): void {

  }
  // tslint:enable:no-empty

  get(name: string): string {
    return undefined;
  }

  // tslint:disable:no-empty
  remove(name: string): void {

  }
  // tslint:enable:no-empty

}
