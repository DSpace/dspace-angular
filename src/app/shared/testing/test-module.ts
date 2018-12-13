import { NgModule } from '@angular/core';
import { QueryParamsDirectiveStub } from './query-params-directive-stub';
import { RouterLinkDirectiveStub } from './router-link-directive-stub';
import { NgComponentOutletDirectiveStub } from './ng-component-outlet-directive-stub';

/**
 * This module isn't used. It serves to prevent the AoT compiler
 * complaining about components/pipes/directives that were
 * created only for use in tests.
 * See https://github.com/angular/angular/issues/13590
 */
@NgModule({
  declarations: [
    QueryParamsDirectiveStub,
    RouterLinkDirectiveStub,
    NgComponentOutletDirectiveStub
  ]
})
export class TestModule {}
