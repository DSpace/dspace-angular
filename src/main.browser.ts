import 'zone.js/dist/zone';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootloader } from '@angularclass/bootloader';

import { load as loadWebFont } from 'webfontloader';

import { BrowserAppModule } from './app/browser-app.module';

import { ENV_CONFIG } from './config';

if (ENV_CONFIG.production) {
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

  return platformBrowserDynamic().bootstrapModule(BrowserAppModule);
}

// support async tag or hmr
bootloader(main);
