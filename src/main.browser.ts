import 'zone.js/dist/zone';
import 'reflect-metadata';
import 'core-js/es/reflect';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootloader } from '@angularclass/bootloader';

import { load as loadWebFont } from 'webfontloader';
import { hasValue } from './app/shared/empty.util';

import { BrowserAppModule } from './modules/app/browser-app.module';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export function main() {
  // Load fonts async
  // https://github.com/typekit/webfontloader#configuration
  loadWebFont({
    google: {
      families: ['Droid Sans']
    }
  });

  return platformBrowserDynamic().bootstrapModule(BrowserAppModule, {preserveWhitespaces:true});
}

// support async tag or hmr
if (hasValue(environment.universal) && environment.universal.preboot === false) {
  bootloader(main);
} else {
  document.addEventListener('DOMContentLoaded', () => bootloader(main));
}

