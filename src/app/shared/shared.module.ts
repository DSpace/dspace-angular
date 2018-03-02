import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbDatepickerModule, NgbModule, NgbTimepickerModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

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
import { MessageBoardComponent } from './message-board/message-board.component';
import { MessageComponent } from './message-board/message.component';
import { ItemListPreviewComponent } from './object-list/item-list-preview/item-list-preview.component';
import { ItemGridPreviewComponent } from './object-grid/item-grid-preview/item-grid-preview.component';
import { MyDSpaceResultGridElementComponent } from './object-grid/my-dspace-result-grid-element/my-dspace-result-grid-element.component';
import { FullFileSectionComponent } from '../+item-page/full/field-components/file-section/full-file-section.component';
import { MetadataUriValuesComponent } from '../+item-page/field-components/metadata-uri-values/metadata-uri-values.component';
import { FileSectionComponent } from '../+item-page/simple/field-components/file-section/file-section.component';
import { FullItemPageComponent } from '../+item-page/full/full-item-page.component';
import { ItemPageAbstractFieldComponent } from '../+item-page/simple/field-components/specific-field/abstract/item-page-abstract-field.component';
import { ItemPageTitleFieldComponent } from '../+item-page/simple/field-components/specific-field/title/item-page-title-field.component';
import { ItemPageSpecificFieldComponent } from '../+item-page/simple/field-components/specific-field/item-page-specific-field.component';
import { MetadataFieldWrapperComponent } from '../+item-page/field-components/metadata-field-wrapper/metadata-field-wrapper.component';
import { ItemPageUriFieldComponent } from '../+item-page/simple/field-components/specific-field/uri/item-page-uri-field.component';
import { CollectionsComponent } from '../+item-page/field-components/collections/collections.component';
import { ItemPageDateFieldComponent } from '../+item-page/simple/field-components/specific-field/date/item-page-date-field.component';
import { MetadataValuesComponent } from '../+item-page/field-components/metadata-values/metadata-values.component';
import { ItemPageAuthorFieldComponent } from '../+item-page/simple/field-components/specific-field/author/item-page-author-field.component';
import { ClaimedTaskActionsComponent } from './claimed-task-actions/claimed-task-actions.component';
import { PoolTaskActionsComponent } from './pool-task-actions/pool-task-actions.component';

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
  TextMaskModule
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
  AuthNavMenuComponent,
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
  LogInComponent,
  LogOutComponent,
  MessageBoardComponent,
  MessageComponent,
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
  ItemListPreviewComponent,
  ItemGridPreviewComponent,
  ClaimedTaskActionsComponent,
  PoolTaskActionsComponent
];

const COMPONENTS_ITEM_PAGE = [
  FullItemPageComponent,
  MetadataValuesComponent,
  MetadataUriValuesComponent,
  MetadataFieldWrapperComponent,
  ItemPageAuthorFieldComponent,
  ItemPageDateFieldComponent,
  ItemPageAbstractFieldComponent,
  ItemPageUriFieldComponent,
  ItemPageTitleFieldComponent,
  ItemPageSpecificFieldComponent,
  FileSectionComponent,
  CollectionsComponent,
  FullFileSectionComponent
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
  MyDSpaceResultGridElementComponent,
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
    ...COMPONENTS_ITEM_PAGE,
    ...DIRECTIVES,
    ...ENTRY_COMPONENTS,
    ...DIRECTIVES
  ],
  exports: [
    ...MODULES,
    ...PIPES,
    ...COMPONENTS,
    ...COMPONENTS_ITEM_PAGE,
    ...DIRECTIVES
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS
  ]
})
export class SharedModule {

}
