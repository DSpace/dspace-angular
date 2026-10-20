import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { RootModule } from '../../app/root.module';
import { EPersonFormComponent } from './app/access-control/epeople-registry/eperson-form/eperson-form.component';
import { AuditTableComponent } from './app/audit-page/audit-table/audit-table.component';
import { AuditOverviewComponent } from './app/audit-page/overview/audit-overview.component';
import { FullItemPageComponent } from './app/item-page/full/full-item-page.component';
import { TypeBadgeComponent } from './app/shared/object-collection/shared/badges/type-badge/type-badge.component';
import { ItemListPreviewComponent } from './app/shared/object-list/my-dspace-result-list-element/item-list-preview/item-list-preview.component';
import { ResultsBackButtonComponent } from './app/shared/results-back-button/results-back-button.component';
import { SearchFormComponent } from './app/shared/search-form/search-form.component';

const DECLARATIONS = [
];

const IMPORTS = [
  AuditOverviewComponent,
  AuditTableComponent,
  EPersonFormComponent,
  FullItemPageComponent,
  ItemListPreviewComponent,
  ResultsBackButtonComponent,
  SearchFormComponent,
  TypeBadgeComponent,
];

@NgModule({
  declarations: DECLARATIONS,
  imports: [
    RootModule,
    CommonModule,
    ...IMPORTS,
    DragDropModule,
    FormsModule,
    NgbModule,
    RouterModule,
    ScrollToModule,
    StoreModule,
    StoreRouterConnectingModule,
    TranslateModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
  ],
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
