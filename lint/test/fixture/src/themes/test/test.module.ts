/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
// @ts-ignore
import { NgModule } from '@angular/core';

import { OtherThemeableComponent } from './app/test/other-themeable.component';
import { TestThemeableComponent } from './app/test/test-themeable.component';

@NgModule({
  declarations: [
    TestThemeableComponent,
    OtherThemeableComponent,
  ],
})
export class TestModule {

}
