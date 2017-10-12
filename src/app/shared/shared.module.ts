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
import { TruncatePipe } from './utils/truncate.pipe';

import { CollectionListElementComponent } from '../object-list/collection-list-element/collection-list-element.component';
import { ComcolPageContentComponent } from './comcol-page-content/comcol-page-content.component';
import { ComcolPageHeaderComponent } from './comcol-page-header/comcol-page-header.component';
import { ComcolPageLogoComponent } from './comcol-page-logo/comcol-page-logo.component';
import { CommunityListElementComponent } from '../object-list/community-list-element/community-list-element.component';
import { ErrorComponent } from './error/error.component';
import { LoadingComponent } from './loading/loading.component';
import { ItemListElementComponent } from '../object-list/item-list-element/item-list-element.component';
import { ObjectListComponent } from '../object-list/object-list.component';
import { ObjectListElementComponent } from '../object-list/object-list-element/object-list-element.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ThumbnailComponent } from '../thumbnail/thumbnail.component';
import { SearchResultListElementComponent } from '../object-list/search-result-list-element/search-result-list-element.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { WrapperListElementComponent } from '../object-list/wrapper-list-element/wrapper-list-element.component';

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
  ComcolPageContentComponent,
  ComcolPageHeaderComponent,
  ComcolPageLogoComponent,
  ErrorComponent,
  LoadingComponent,
  ObjectListComponent,
  ObjectListElementComponent,
  PaginationComponent,
  SearchFormComponent,
  ThumbnailComponent,
  WrapperListElementComponent
];

const ENTRY_COMPONENTS = [
  // put shared entry components (components that are created dynamically) here
  CollectionListElementComponent,
  CommunityListElementComponent,
  ItemListElementComponent,
  SearchResultListElementComponent
];

@NgModule({
  imports: [
    ...MODULES
  ],
  declarations: [
    ...PIPES,
    ...COMPONENTS,
    ...ENTRY_COMPONENTS
  ],
  exports: [
    ...MODULES,
    ...PIPES,
    ...COMPONENTS
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS
  ]
})
export class SharedModule {

}
