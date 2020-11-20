import 'core-js/es/reflect';
import 'zone.js/dist/zone';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
/******************************************************************
 * Load `$localize` - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export { ServerAppModule } from './modules/app/server-app.module';
export { ngExpressEngine } from '@nguniversal/express-engine';
