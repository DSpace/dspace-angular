import 'zone.js/dist/zone';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootloader } from '@angularclass/bootloader';

import { load as loadWebFont } from 'webfontloader';
import { hasValue } from './app/shared/empty.util';

import { BrowserAppModule } from './modules/app/browser-app.module';

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

  // Add google analytics key
  const script = document.createElement('script');
  script.innerHTML = 'ga(\'create\', \'' + ENV_CONFIG.gaTrackingId + '\', \'auto\');';
  document.body.appendChild(script);

  return platformBrowserDynamic().bootstrapModule(BrowserAppModule);
}

// support async tag or hmr
if (hasValue(ENV_CONFIG.universal) && ENV_CONFIG.universal.preboot === false) {
  bootloader(main);
} else {
  document.addEventListener('DOMContentLoaded', () => bootloader(main));
}
