import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * The auth service.
 */
@Injectable()
export class AuthStorageService {

  constructor(@Inject(PLATFORM_ID) private platformId: string) {}

  public get(key: string): any {
    let item = null;
    if (isPlatformBrowser(this.platformId)) {
      item = JSON.parse(localStorage.getItem(key));
    }
    return item;
  }

  public store(key: string, item: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, JSON.stringify(item));
    }
    return true;
  }

  public remove(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
    return true;
  }

}
