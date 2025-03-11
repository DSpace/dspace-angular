import 'core-js/es/reflect';
import 'zone.js';
import 'reflect-metadata';
/******************************************************************
 * Load `$localize` - not used for i18n in this project, we use ngx-translate.
 * It's used for localization of dates, numbers, currencies, etc.
 */
import '@angular/localize/init';

import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { serverAppConfig } from './modules/app/server-app.config';

const bootstrap = () => bootstrapApplication(AppComponent, serverAppConfig);

export default bootstrap;
