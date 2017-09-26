import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TranslateModule } from '@ngx-translate/core';

import { PaginationComponent } from './pagination/pagination.component';
import { FileSizePipe } from './utils/file-size-pipe';
import { ThumbnailComponent } from '../thumbnail/thumbnail.component';
import { SafeUrlPipe } from './utils/safe-url-pipe';

import { ComcolPageContentComponent } from './comcol-page-content/comcol-page-content.component';
import { ComcolPageHeaderComponent } from './comcol-page-header/comcol-page-header.component';
import { ComcolPageLogoComponent } from './comcol-page-logo/comcol-page-logo.component';
import { EnumKeysPipe } from './utils/enum-keys-pipe';
import { ObjectListComponent } from './object-list/object-list.component';
import { ObjectListElementComponent } from '../object-list/object-list-element/object-list-element.component';
import { ItemListElementComponent } from '../object-list/item-list-element/item-list-element.component';
import { CommunityListElementComponent } from '../object-list/community-list-element/community-list-element.component';
import { CollectionListElementComponent } from '../object-list/collection-list-element/collection-list-element.component';
import { TruncatePipe } from './utils/truncate.pipe';

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
  FileSizePipe,
  SafeUrlPipe,
  EnumKeysPipe,
  TruncatePipe
];

const COMPONENTS = [
  // put shared components here
  PaginationComponent,
  ThumbnailComponent,
  ComcolPageContentComponent,
  ComcolPageHeaderComponent,
  ComcolPageLogoComponent,
  ObjectListComponent,
  ObjectListElementComponent,
  ItemListElementComponent,
  CollectionListElementComponent,
  CommunityListElementComponent
];

const PROVIDERS = [

];

@NgModule({
  imports: [
    ...MODULES
  ],
  declarations: [
    ...PIPES,
    ...COMPONENTS
  ],
  exports: [
    ...MODULES,
    ...PIPES,
    ...COMPONENTS
  ],
  providers: [
    ...PROVIDERS
  ]
})
export class SharedModule {

}
