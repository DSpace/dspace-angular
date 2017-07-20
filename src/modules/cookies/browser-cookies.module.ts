import { NgModule } from '@angular/core';

import { Cookies } from './cookies';
import { BrowserCookies } from './browser-cookies';

@NgModule({
  providers: [
    { provide: Cookies, useClass: BrowserCookies }
  ]
})
export class BrowserCookiesModule {

}
