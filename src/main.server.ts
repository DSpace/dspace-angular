import 'core-js/es/reflect';
import 'zone.js/dist/zone';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export { ServerAppModule } from './modules/app/server-app.module';
export { ngExpressEngine } from '@nguniversal/express-engine';
export { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
