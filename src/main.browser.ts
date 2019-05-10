import 'zone.js/dist/zone';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootloader } from '@angularclass/bootloader';

import { load as loadWebFont } from 'webfontloader';
import { hasValue, isNotEmpty } from './app/shared/empty.util';

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

  addGoogleAnalytics();

  return platformBrowserDynamic().bootstrapModule(BrowserAppModule, {preserveWhitespaces:true});
}

function addGoogleAnalytics() {
  // Add google analytics if key is present in config
  const trackingId = ENV_CONFIG.gaTrackingId;
  if (isNotEmpty(trackingId)) {
    const keyScript = document.createElement('script');
    keyScript.innerHTML =   `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');`
      + 'ga(\'create\', \'' + ENV_CONFIG.gaTrackingId + '\', \'auto\');';
    document.body.appendChild(keyScript);
  }
}

// support async tag or hmr
if (hasValue(ENV_CONFIG.universal) && ENV_CONFIG.universal.preboot === false) {
  bootloader(main);
} else {
  document.addEventListener('DOMContentLoaded', () => bootloader(main));
}
