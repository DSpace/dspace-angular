import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgbDatepickerModule, NgbModule, NgbTimepickerModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormsCoreModule } from '@ng-dynamic-forms/core';
import { DynamicFormsNGBootstrapUIModule } from '@ng-dynamic-forms/ui-ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SortablejsModule } from 'angular-sortablejs';
import { TextMaskModule } from 'angular2-text-mask';
import { FileUploadModule } from 'ng2-file-upload';
import { NouisliderModule } from 'ng2-nouislider';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MomentModule } from 'ngx-moment';
import { NgxPaginationModule } from 'ngx-pagination';

import { AuthNavMenuComponent } from './auth-nav-menu/auth-nav-menu.component';
import { BrowseByComponent } from './browse-by/browse-by.component';
import { ChipsComponent } from './chips/chips.component';
import { ComcolPageContentComponent } from './comcol-page-content/comcol-page-content.component';
import { ComcolPageHeaderComponent } from './comcol-page-header/comcol-page-header.component';
import { ComcolPageLogoComponent } from './comcol-page-logo/comcol-page-logo.component';
import { ErrorComponent } from './error/error.component';
import { DsDynamicFormControlComponent } from './form/builder/ds-dynamic-form-ui/ds-dynamic-form-control.component';
import { DsDynamicFormComponent } from './form/builder/ds-dynamic-form-ui/ds-dynamic-form.component';
import { DsDatePickerComponent } from './form/builder/ds-dynamic-form-ui/models/date-picker/date-picker.component';
import { DsDynamicGroupComponent } from './form/builder/ds-dynamic-form-ui/models/dynamic-group/dynamic-group.components';
import { DsDynamicListComponent } from './form/builder/ds-dynamic-form-ui/models/list/dynamic-list.component';
import { DsDynamicLookupComponent } from './form/builder/ds-dynamic-form-ui/models/lookup/dynamic-lookup.component';
import { DsDynamicScrollableDropdownComponent } from './form/builder/ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.component';
import { DsDynamicTagComponent } from './form/builder/ds-dynamic-form-ui/models/tag/dynamic-tag.component';
import { DsDynamicTypeaheadComponent } from './form/builder/ds-dynamic-form-ui/models/typeahead/dynamic-typeahead.component';
import { FormComponent } from './form/form.component';
import { InputSuggestionsComponent } from './input-suggestions/input-suggestions.component';
import { LoadingComponent } from './loading/loading.component';
import { LogInComponent } from './log-in/log-in.component';
import { LogOutComponent } from './log-out/log-out.component';
import { MockAdminGuard } from './mocks/mock-admin-guard.service';
import { NumberPickerComponent } from './number-picker/number-picker.component';
import { ObjectCollectionComponent } from './object-collection/object-collection.component';
import { AbstractListableElementComponent } from './object-collection/shared/object-collection-element/abstract-listable-element.component';
import { CollectionGridElementComponent } from './object-grid/collection-grid-element/collection-grid-element.component';
import { CommunityGridElementComponent } from './object-grid/community-grid-element/community-grid-element.component';
import { GridThumbnailComponent } from './object-grid/grid-thumbnail/grid-thumbnail.component';
import { ItemGridElementComponent } from './object-grid/item-grid-element/item-grid-element.component';
import { ObjectGridComponent } from './object-grid/object-grid.component';
import { SearchResultGridElementComponent } from './object-grid/search-result-grid-element/search-result-grid-element.component';
import { WrapperGridElementComponent } from './object-grid/wrapper-grid-element/wrapper-grid-element.component';
import { BrowseEntryListElementComponent } from './object-list/browse-entry-list-element/browse-entry-list-element.component';
import { CollectionListElementComponent } from './object-list/collection-list-element/collection-list-element.component';
import { CommunityListElementComponent } from './object-list/community-list-element/community-list-element.component';
import { ItemListElementComponent } from './object-list/item-list-element/item-list-element.component';
import { ObjectListComponent } from './object-list/object-list.component';
import { SearchResultListElementComponent } from './object-list/search-result-list-element/search-result-list-element.component';
import { WrapperListElementComponent } from './object-list/wrapper-list-element/wrapper-list-element.component';
import { PaginationComponent } from './pagination/pagination.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { TruncatablePartComponent } from './truncatable/truncatable-part/truncatable-part.component';
import { TruncatableComponent } from './truncatable/truncatable.component';
import { TruncatableService } from './truncatable/truncatable.service';
import { UploaderComponent } from './uploader/uploader.component';
import { CapitalizePipe } from './utils/capitalize.pipe';
import { ClickOutsideDirective } from './utils/click-outside.directive';
import { ConsolePipe } from './utils/console.pipe';
import { DebounceDirective } from './utils/debounce.directive';
import { DragClickDirective } from './utils/drag-click.directive';
import { EmphasizePipe } from './utils/emphasize.pipe';
import { EnumKeysPipe } from './utils/enum-keys-pipe';
import { FileSizePipe } from './utils/file-size-pipe';
import { ObjectKeysPipe } from './utils/object-keys-pipe';
import { SafeUrlPipe } from './utils/safe-url-pipe';
import { TruncatePipe } from './utils/truncate.pipe';
import { VarDirective } from './utils/var.directive';
import { ViewModeSwitchComponent } from './view-mode-switch/view-mode-switch.component';
import { ThumbnailComponent } from '../thumbnail/thumbnail.component';

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
  NouisliderModule,
  MomentModule,
  TextMaskModule
];

const PIPES = [
  // put shared pipes here
  EnumKeysPipe,
  FileSizePipe,
  SafeUrlPipe,
  TruncatePipe,
  EmphasizePipe,
  CapitalizePipe,
  ObjectKeysPipe,
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
  DsDynamicGroupComponent,
  DsDatePickerComponent,
  ErrorComponent,
  FormComponent,
  LoadingComponent,
  LogInComponent,
  LogOutComponent,
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
  UploaderComponent,
  WrapperListElementComponent,
  ViewModeSwitchComponent,
  TruncatableComponent,
  TruncatablePartComponent,
  BrowseByComponent,
  InputSuggestionsComponent
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
  BrowseEntryListElementComponent
];

const PROVIDERS = [
  TruncatableService,
  MockAdminGuard
];

const DIRECTIVES = [
  VarDirective,
  DragClickDirective,
  DebounceDirective,
  ClickOutsideDirective
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

/**
 * This module handles all components and pipes that need to be shared among multiple other modules
 */
export class SharedModule {

}
