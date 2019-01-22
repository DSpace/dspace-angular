import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { QueryParamsDirectiveStub } from './query-params-directive-stub';
import { MySimpleItemActionComponent } from '../../+item-page/edit-item-page/simple-item-action/abstract-simple-item-action.component.spec';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared.module';
import { RouterLinkDirectiveStub } from './router-link-directive-stub';
import { NgComponentOutletDirectiveStub } from './ng-component-outlet-directive-stub';

/**
 * This module isn't used. It serves to prevent the AoT compiler
 * complaining about components/pipes/directives that were
 * created only for use in tests.
 * See https://github.com/angular/angular/issues/13590
 */
@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    QueryParamsDirectiveStub,
    MySimpleItemActionComponent,
    RouterLinkDirectiveStub,
    NgComponentOutletDirectiveStub
  ], schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TestModule {}
