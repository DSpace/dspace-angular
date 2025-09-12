import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
} from '@angular/core';
import { BrowserOnlyMockPipe } from '@dspace/core/testing/browser-only-mock.pipe';
import { NgComponentOutletDirectiveStub } from '@dspace/core/testing/ng-component-outlet-directive.stub';
import { QueryParamsDirectiveStub } from '@dspace/core/testing/query-params-directive.stub';
import { RouterLinkDirectiveStub } from '@dspace/core/testing/router-link-directive.stub';

import { MySimpleItemActionComponent } from '../item-page/edit-item-page/simple-item-action/abstract-simple-item-action.component.spec';

/**
 * This module isn't used. It serves to prevent the AoT compiler
 * complaining about components/pipes/directives that were
 * created only for use in tests.
 * See https://github.com/angular/angular/issues/13590
 */
@NgModule({
  imports: [
    CommonModule,
    QueryParamsDirectiveStub,
    MySimpleItemActionComponent,
    RouterLinkDirectiveStub,
    NgComponentOutletDirectiveStub,
    BrowserOnlyMockPipe,
  ],
  exports: [
    QueryParamsDirectiveStub,
    RouterLinkDirectiveStub,
    BrowserOnlyMockPipe,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
})
export class TestModule {
}
