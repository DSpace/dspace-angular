import 'zone.js/dist/zone';
import 'reflect-metadata';
import 'core-js/es/reflect';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { load as loadWebFont } from 'webfontloader';

import { hasValue } from './app/shared/empty.util';

import { BrowserAppModule } from './modules/app/browser-app.module';

import { environment } from './environments/environment';

// import { AppConfig, APP_CONFIG } from './config/app-config.interface';
// import { extendEnvironmentWithAppConfig } from './config/config.util';

if (environment.production) {
  enableProdMode();
}

const main = () => {
  // Load fonts async
  // https://github.com/typekit/webfontloader#configuration
  loadWebFont({
    google: {
      families: ['Droid Sans']
    }
  });

  return platformBrowserDynamic()
    .bootstrapModule(BrowserAppModule, {
      preserveWhitespaces: true
    });
};

// support async tag or hmr
if (hasValue(environment.universal) && environment.universal.preboot === false) {
  main();
} else {
  document.addEventListener('DOMContentLoaded', main);
}


// fetch('assets/appConfig.json')
//   .then((response) => response.json())
//   .then((appConfig: AppConfig) => {
//      // extend environment with app config for client side use
//      extendEnvironmentWithAppConfig(environment, appConfig);
//   });
