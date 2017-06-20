import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";

import { SharedModule } from '../shared/shared.module';

import { CollectionPageComponent } from './collection-page.component';
import { FieldWrapperComponent } from './field-wrapper/field-wrapper.component';
import { CollectionPageNameComponent } from './name/collection-page-name.component';
import { CollectionPageLogoComponent } from './logo/collection-page-logo.component';
import { CollectionPageIntroductoryTextComponent } from './introductory-text/collection-page-introductory-text.component';
import { CollectionPageNewsComponent } from './news/collection-page-news.component';
import { CollectionPageCopyrightComponent } from './copyright/collection-page-copyright.component';
import { CollectionPageLicenseComponent } from './license/collection-page-license.component';
import { CollectionPageRoutingModule } from './collection-page-routing.module';

@NgModule({
  imports: [
    CollectionPageRoutingModule,
    CommonModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [
    CollectionPageComponent,
    FieldWrapperComponent,
    CollectionPageNameComponent,
    CollectionPageLogoComponent,
    CollectionPageIntroductoryTextComponent,
    CollectionPageNewsComponent,
    CollectionPageCopyrightComponent,
    CollectionPageLicenseComponent,
  ]
})
export class CollectionPageModule { }
