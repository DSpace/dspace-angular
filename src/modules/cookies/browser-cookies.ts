import { Injectable } from '@angular/core';

import { Cookies } from './cookies';

@Injectable()
export class BrowserCookies implements Cookies {

  // TODO: improve - set domain from configuration value or ui baseUrl
  set(name: string, value: string, days: number, path?: string): void {
    const date: Date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires: string = 'expires=' + date.toUTCString();
    window.document.cookie = [name, '=', value, '; ', expires, path ? '; path=' + path : ''].join('');
  }

  get(name: string): string {
    const cookies: string[] = window.document.cookie.split(';');
    let cookie: string;
    for (const cc of cookies) {
      const c: string = cc.replace(/^\s\+/g, '');
      if (c.indexOf(name + '=') === 0) {
        cookie = c.substring(name.length + 1, c.length);
        break;
      }
    }
    return cookie;
  }

  // TODO: set path from environment configuration
  remove(name: string): void {
    this.set(name, '', 0, '/');
  }

}
