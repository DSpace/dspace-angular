import 'core-js/es/reflect';
import 'zone.js';
import 'reflect-metadata';
/******************************************************************
 * Load `$localize` - not used for i18n in this project, we use ngx-translate.
 * It's used for localization of dates, numbers, currencies, etc.
 */
import '@angular/localize/init';

import { setDefaultResultOrder } from 'node:dns';

import {
  bootstrapApplication,
  BootstrapContext,
} from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { serverAppConfig } from './modules/app/server-app.config';

// Apply DNS resolution order fix for Node.js 17+ by preferring IPv4 over IPv6.
// This fixes "ECONNREFUSED ::1:8080" errors in PM2 cluster mode when
// the backend only listens on IPv4
// See https://github.com/DSpace/dspace-angular/issues/4960
setDefaultResultOrder('ipv4first');

const bootstrap = (context: BootstrapContext) => bootstrapApplication(AppComponent, serverAppConfig, context);

export default bootstrap;
