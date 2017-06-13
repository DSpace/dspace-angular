import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from "@ngx-translate/core";

import { SharedModule } from '../shared/shared.module';
import { CollectionPageComponent } from './collection-page.component';
import { FieldWrapperComponent } from './field-wrapper/field-wrapper.component';
import { CollectionPageNameComponent } from './name/collection-page-name.component';
import { CollectionPageLogoComponent } from './logo/collection-page-logo.component';
import { CollectionPageRoutingModule } from './collection-page-routing.module';

@NgModule({
  imports: [
    CollectionPageRoutingModule,
    CommonModule,
    TranslateModule,
    SharedModule,
  ],
  declarations: [
    CollectionPageComponent,
    FieldWrapperComponent,
    CollectionPageNameComponent,
    CollectionPageLogoComponent,
  ]
})
export class CollectionPageModule { }
