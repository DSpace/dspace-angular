import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { IdlePreloadModule } from 'angular-idle-preload';

import { AppModule } from '../../app/app.module';
import { EditItemPageModule } from '../../app/item-page/edit-item-page/edit-item-page.module';
import { ItemVersionsModule } from '../../app/item-page/versions/item-versions.module';
import { NavbarModule } from '../../app/navbar/navbar.module';
import { RegisterEmailFormModule } from '../../app/register-email-form/register-email-form.module';
import { RootModule } from '../../app/root.module';
import { SearchPageModule } from '../../app/search-page/search-page.module';
import { SharedBrowseByModule } from '../../app/shared/browse-by/shared-browse-by.module';
import { MenuModule } from '../../app/shared/menu/menu.module';
import { ResourcePoliciesModule } from '../../app/shared/resource-policies/resource-policies.module';
import { SearchModule } from '../../app/shared/search/search.module';
import { StatisticsModule } from '../../app/statistics/statistics.module';
import { StatisticsPageModule } from '../../app/statistics-page/statistics-page.module';
import { SubmissionModule } from '../../app/submission/submission.module';

const DECLARATIONS = [
];

@NgModule({
  imports: [
    AppModule,
    RootModule,
    CommonModule,
    DragDropModule,
    EditItemPageModule,
    ItemVersionsModule,
    FormsModule,
    HttpClientModule,
    IdlePreloadModule,
    MenuModule,
    NavbarModule,
    NgbModule,
    RegisterEmailFormModule,
    RouterModule,
    ScrollToModule,
    SearchPageModule,
    SharedBrowseByModule,
    StatisticsModule,
    StatisticsPageModule,
    StoreModule,
    StoreRouterConnectingModule,
    TranslateModule,
    SubmissionModule,
    SearchModule,
    FormsModule,
    ResourcePoliciesModule,
  ],
  declarations: DECLARATIONS,
})

/**
 * This module serves as an index for all the components in this theme.
 * It should import all other modules, so the compiler knows where to find any components referenced
 * from a component in this theme
 * It is purposefully not exported, it should never be imported anywhere else, its only purpose is
 * to give lazily loaded components a context in which they can be compiled successfully
 */
class LazyThemeModule {
}
