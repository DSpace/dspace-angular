/**
 * Fix for Node.js 17+ where DNS resolution prefers IPv6 over IPv4.
 * This causes "ECONNREFUSED ::1:8080" errors in PM2 cluster mode when
 * the backend only listens on IPv4.
 * See: https://github.com/nodejs/node/issues/40537
 */
import * as dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import 'core-js/es/reflect';
import 'zone.js';
import 'reflect-metadata';
/******************************************************************
 * Load `$localize` - not used for i18n in this project, we use ngx-translate.
 * It's used for localization of dates, numbers, currencies, etc.
 */
import '@angular/localize/init';

import {
  bootstrapApplication,
  BootstrapContext,
} from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { serverAppConfig } from './modules/app/server-app.config';

const bootstrap = (context: BootstrapContext) => bootstrapApplication(AppComponent, serverAppConfig, context);

export default bootstrap;
