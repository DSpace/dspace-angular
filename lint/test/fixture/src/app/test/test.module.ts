/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
// @ts-ignore
import { NgModule } from '@angular/core';

import { TestComponent } from './test.component';
import { TestThemeableComponent } from './test-themeable.component';
import { ThemedTestThemeableComponent } from './themed-test-themeable.component';

@NgModule({
  declarations: [
    TestComponent,
    TestThemeableComponent,
    ThemedTestThemeableComponent,
  ],
})
export class TestModule {

}
