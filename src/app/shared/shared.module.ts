import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  NgbDatepickerModule,
  NgbModule,
  NgbTimepickerModule,
  NgbTypeaheadModule
} from '@ng-bootstrap/ng-bootstrap';

import { TranslateModule } from '@ngx-translate/core';

import { FileUploadModule } from 'ng2-file-upload';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { NgxPaginationModule } from 'ngx-pagination';

import { EnumKeysPipe } from './utils/enum-keys-pipe';
import { FileSizePipe } from './utils/file-size-pipe';
import { SafeUrlPipe } from './utils/safe-url-pipe';
import { TruncatePipe } from './utils/truncate.pipe';
import { ConsolePipe } from './utils/console.pipe';

import { CollectionListElementComponent } from './object-list/collection-list-element/collection-list-element.component';
import { CommunityListElementComponent } from './object-list/community-list-element/community-list-element.component';
import { ItemListElementComponent } from './object-list/item-list-element/item-list-element.component';
import { SearchResultListElementComponent } from './object-list/search-result-list-element/search-result-list-element.component';
import { WrapperListElementComponent } from './object-list/wrapper-list-element/wrapper-list-element.component';
import { ObjectListComponent } from './object-list/object-list.component';

import { CollectionGridElementComponent} from './object-grid/collection-grid-element/collection-grid-element.component'
import { CommunityGridElementComponent} from './object-grid/community-grid-element/community-grid-element.component'
import { ItemGridElementComponent} from './object-grid/item-grid-element/item-grid-element.component'
import { AbstractListableElementComponent} from './object-collection/shared/object-collection-element/abstract-listable-element.component'
import { WrapperGridElementComponent} from './object-grid/wrapper-grid-element/wrapper-grid-element.component'
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
import { FormComponent } from './form/form.component';
import { DsDynamicTypeaheadComponent } from './form/builder/ds-dynamic-form-ui/models/typeahead/dynamic-typeahead.component';
import { DsDynamicScrollableDropdownComponent } from './form/builder/ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.component';
import { DsDynamicFormControlComponent } from './form/builder/ds-dynamic-form-ui/ds-dynamic-form-control.component';
import { DsDynamicFormComponent } from './form/builder/ds-dynamic-form-ui/ds-dynamic-form.component';
import { DynamicFormsCoreModule } from '@ng-dynamic-forms/core';
import { DynamicFormsNGBootstrapUIModule } from '@ng-dynamic-forms/ui-ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';

import { UploadFilesComponent } from './upload-files/upload-files.component';
import { ChipsComponent } from './chips/chips.component';
import { DsDynamicTagComponent } from './form/builder/ds-dynamic-form-ui/models/tag/dynamic-tag.component';
import { DsDynamicListComponent } from './form/builder/ds-dynamic-form-ui/models/list/dynamic-list.component';
import { DsDynamicGroupComponent } from './form/builder/ds-dynamic-form-ui/models/ds-dynamic-group/dynamic-group.components';
import { SortablejsModule } from 'angular-sortablejs';
import { NumberPickerComponent } from './number-picker/number-picker.component';
import { DsDatePickerComponent } from './form/builder/ds-dynamic-form-ui/models/ds-date-picker/ds-date-picker.component';

import { MyDSpaceResultListElementComponent } from './object-list/my-dspace-result-list-element/my-dspace-result-list-element.component';
import { DsDynamicLookupComponent } from './form/builder/ds-dynamic-form-ui/models/lookup/dynamic-lookup.component';

const MODULES = [
  // Do NOT include UniversalModule, HttpModule, or JsonpModule here
  CommonModule,
  SortablejsModule,
  DynamicFormsCoreModule,
  DynamicFormsNGBootstrapUIModule,
  FileUploadModule,
  FormsModule,
  InfiniteScrollModule,
  NgbModule,
  NgbDatepickerModule,
  NgbTimepickerModule,
  NgbTypeaheadModule,
  NgxPaginationModule,
  ReactiveFormsModule,
  RouterModule,
  TranslateModule,
  TextMaskModule,
];

const PIPES = [
  // put shared pipes here
  EnumKeysPipe,
  FileSizePipe,
  SafeUrlPipe,
  TruncatePipe,
  ConsolePipe
];

const COMPONENTS = [
  // put shared components here
  ChipsComponent,
  ComcolPageContentComponent,
  ComcolPageHeaderComponent,
  ComcolPageLogoComponent,
  DsDynamicFormComponent,
  DsDynamicFormControlComponent,
  DsDynamicListComponent,
  DsDynamicLookupComponent,
  DsDynamicScrollableDropdownComponent,
  DsDynamicTagComponent,
  DsDynamicTypeaheadComponent,
  ErrorComponent,
  FormComponent,
  LoadingComponent,
  NumberPickerComponent,
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
  UploadFilesComponent,
  WrapperListElementComponent,
  ViewModeSwitchComponent,
  DsDynamicGroupComponent,
  DsDatePickerComponent,
];

const ENTRY_COMPONENTS = [
  // put shared entry components (components that are created dynamically) here
  ItemListElementComponent,
  CollectionListElementComponent,
  CommunityListElementComponent,
  MyDSpaceResultListElementComponent,
  SearchResultListElementComponent,
  ItemGridElementComponent,
  CollectionGridElementComponent,
  CommunityGridElementComponent,
  SearchResultGridElementComponent
];

const DIRECTIVES = [
  VarDirective
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
