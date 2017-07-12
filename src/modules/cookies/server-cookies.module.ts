import { NgModule } from '@angular/core';

import { Cookies } from './cookies';
import { ServerCookies } from './server-cookies';

@NgModule({
  providers: [
    { provide: Cookies, useClass: ServerCookies }
  ]
})
export class ServerCookiesModule {

}
