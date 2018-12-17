import { NgModule } from '@angular/core';
import { QueryParamsDirectiveStub } from './query-params-directive-stub';

/**
 * This module isn't used. It serves to prevent the AoT compiler
 * complaining about components/pipes/directives that were
 * created only for use in tests.
 * See https://github.com/angular/angular/issues/13590
 */
@NgModule({
  declarations: [
    QueryParamsDirectiveStub
  ]
})
export class TestModule {}
