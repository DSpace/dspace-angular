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

jasmine.getEnv().afterEach(() => {
  // If store is mocked, reset state after each test (see https://ngrx.io/guide/migration/v13)
  getTestBed().inject(MockStore, null)?.resetSelectors();
  // Close any leftover modals
  getTestBed().inject(NgbModal, null)?.dismissAll?.();
});
