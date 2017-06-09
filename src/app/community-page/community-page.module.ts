import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";

import { TranslateModule } from "@ngx-translate/core";

import { CommunityPageComponent } from './community-page.component';
import { FieldWrapperComponent } from './field-wrapper/field-wrapper.component';
import { CommunityPageNameComponent } from './name/community-page-name.component';
import { CommunityPageLogoComponent } from './logo/community-page-logo.component';
import { CommunityPageIntroductoryTextComponent } from './introductory-text/community-page-introductory-text.component';
import { CommunityPageNewsComponent } from './news/community-page-news.component';
import { CommunityPageCopyrightComponent } from './copyright/community-page-copyright.component';
import { CommunityPageLicenseComponent } from './license/community-page-license.component';
import { CommunityPageSubCollectionListComponent } from './sub-collection-list/community-page-sub-collection-list.component';
import { CommunityPageRoutingModule } from './community-page-routing.module';

@NgModule({
  imports: [
    CommunityPageRoutingModule,
    CommonModule,
    TranslateModule,
    RouterModule,
  ],
  declarations: [
    CommunityPageComponent,
    FieldWrapperComponent,
    CommunityPageNameComponent,
    CommunityPageLogoComponent,
    CommunityPageIntroductoryTextComponent,
    CommunityPageNewsComponent,
    CommunityPageCopyrightComponent,
    CommunityPageLicenseComponent,
    CommunityPageSubCollectionListComponent,
  ]
})
export class CommunityPageModule { }
