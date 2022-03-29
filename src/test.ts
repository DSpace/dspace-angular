// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { MockStore } from '@ngrx/store/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: false } }
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);

// Find just one test for testing.
// const context = require.context('./', true, /dtq-test-example.component.spec\.ts$/);
// And load the modules.
context.keys().map(context);
