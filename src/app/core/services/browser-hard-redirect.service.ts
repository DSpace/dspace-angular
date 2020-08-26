import {Inject, Injectable} from '@angular/core';
import {LocationToken} from '../../../modules/app/browser-app.module';

@Injectable()
export class BrowserHardRedirectService {

  constructor(
    @Inject(LocationToken) protected location: Location,
  ) {
  }

  redirect(url: string) {
    this.location.href = url;
  }

  getOriginFromUrl() {
    return this.location.origin;
  }
}
