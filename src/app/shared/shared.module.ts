import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TranslateModule } from '@ngx-translate/core';

import { NgxPaginationModule } from 'ngx-pagination';

import { EnumKeysPipe } from './utils/enum-keys-pipe';
import { FileSizePipe } from './utils/file-size-pipe';
import { SafeUrlPipe } from './utils/safe-url-pipe';

import { CollectionListElementComponent } from './object-list/collection-list-element/collection-list-element.component';
import { CommunityListElementComponent } from './object-list/community-list-element/community-list-element.component';
import { ItemListElementComponent } from './object-list/item-list-element/item-list-element.component';
import { SearchResultListElementComponent } from './object-list/search-result-list-element/search-result-list-element.component';
import { WrapperListElementComponent } from './object-list/wrapper-list-element/wrapper-list-element.component';
import { ObjectListComponent } from './object-list/object-list.component';

import { CollectionGridElementComponent } from './object-grid/collection-grid-element/collection-grid-element.component';
import { CommunityGridElementComponent } from './object-grid/community-grid-element/community-grid-element.component';
import { ItemGridElementComponent } from './object-grid/item-grid-element/item-grid-element.component';
import { AbstractListableElementComponent } from './object-collection/shared/object-collection-element/abstract-listable-element.component';
import { WrapperGridElementComponent } from './object-grid/wrapper-grid-element/wrapper-grid-element.component';
import { ObjectGridComponent } from './object-grid/object-grid.component';
import { ObjectCollectionComponent } from './object-collection/object-collection.component';
import { ComcolPageContentComponent } from './comcol-page-content/comcol-page-content.component';
import { ComcolPageHeaderComponent } from './comcol-page-header/comcol-page-header.component';
import { ComcolPageLogoComponent } from './comcol-page-logo/comcol-page-logo.component';
import { ErrorComponent } from './error/error.component';
import { LoadingComponent } from './loading/loading.component';

import { PaginationComponent } from './pagination/pagination.component';
import { ThumbnailComponent } from '../thumbnail/thumbnail.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { SearchResultGridElementComponent } from './object-grid/search-result-grid-element/search-result-grid-element.component';
import { ViewModeSwitchComponent } from './view-mode-switch/view-mode-switch.component';
import { GridThumbnailComponent } from './object-grid/grid-thumbnail/grid-thumbnail.component';
import { VarDirective } from './utils/var.directive';
import { LogInComponent } from './log-in/log-in.component';
import { AuthNavMenuComponent } from './auth-nav-menu/auth-nav-menu.component';
import { LogOutComponent } from './log-out/log-out.component';
import { NotificationComponent } from './notifications/notification/notification.component';
import { NotificationsBoardComponent } from './notifications/notifications-board/notifications-board.component';
import { DragClickDirective } from './utils/drag-click.directive';
import { TruncatePipe } from './utils/truncate.pipe';
import { TruncatableComponent } from './truncatable/truncatable.component';
import { TruncatableService } from './truncatable/truncatable.service';
import { TruncatablePartComponent } from './truncatable/truncatable-part/truncatable-part.component';
import { MockAdminGuard } from './mocks/mock-admin-guard.service';

const MODULES = [
  // Do NOT include UniversalModule, HttpModule, or JsonpModule here
  CommonModule,
  FormsModule,
  NgbModule,
  NgxPaginationModule,
  ReactiveFormsModule,
  RouterModule,
  TranslateModule
];

const PIPES = [
  // put shared pipes here
  EnumKeysPipe,
  FileSizePipe,
  SafeUrlPipe,
  TruncatePipe
];

const COMPONENTS = [
  // put shared components here
  AuthNavMenuComponent,
  ComcolPageContentComponent,
  ComcolPageHeaderComponent,
  ComcolPageLogoComponent,
  ErrorComponent,
  LoadingComponent,
  LogInComponent,
  LogOutComponent,
  ObjectListComponent,
  AbstractListableElementComponent,
  WrapperListElementComponent,
  ObjectGridComponent,
  WrapperGridElementComponent,
  ObjectCollectionComponent,
  PaginationComponent,
  SearchFormComponent,
  ThumbnailComponent,
  GridThumbnailComponent,
  WrapperListElementComponent,
  ViewModeSwitchComponent,
  TruncatableComponent,
  TruncatablePartComponent,
];

const ENTRY_COMPONENTS = [
  // put shared entry components (components that are created dynamically) here
  ItemListElementComponent,
  CollectionListElementComponent,
  CommunityListElementComponent,
  SearchResultListElementComponent,
  ItemGridElementComponent,
  CollectionGridElementComponent,
  CommunityGridElementComponent,
  SearchResultGridElementComponent,
];

const PROVIDERS = [
  TruncatableService,
  MockAdminGuard
];

const DIRECTIVES = [
  VarDirective,
  DragClickDirective
];

@NgModule({
  imports: [
    ...MODULES
  ],
  declarations: [
    ...PIPES,
    ...COMPONENTS,
    ...DIRECTIVES,
    ...ENTRY_COMPONENTS,
    ...DIRECTIVES
  ],
  providers: [
    ...PROVIDERS
  ],
  exports: [
    ...MODULES,
    ...PIPES,
    ...COMPONENTS,
    ...DIRECTIVES
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS
  ]
})
export class SharedModule {

}
