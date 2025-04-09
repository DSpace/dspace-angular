import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbTooltipModule,
  NgbTypeaheadModule
} from '@ng-bootstrap/ng-bootstrap';
import { MissingTranslationHandler, TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import {
  ExportMetadataCsvSelectorComponent
} from './dso-selector/modal-wrappers/export-metadata-csv-selector/export-metadata-csv-selector.component';
import { ExportMetadataXlsSelectorComponent } from './dso-selector/modal-wrappers/export-metadata-xls-selector/export-metadata-xls-selector.component';
import {
  ExportBatchSelectorComponent
} from './dso-selector/modal-wrappers/export-batch-selector/export-batch-selector.component';
import {
  ImportBatchSelectorComponent
} from './dso-selector/modal-wrappers/import-batch-selector/import-batch-selector.component';
import { ItemListElementComponent } from './object-list/item-list-element/item-types/item/item-list-element.component';
import { EnumKeysPipe } from './utils/enum-keys-pipe';
import { FileSizePipe } from './utils/file-size-pipe';
import { MetadataFieldValidator } from './utils/metadatafield-validator.directive';
import { SafeUrlPipe } from './utils/safe-url-pipe';
import { ConsolePipe } from './utils/console.pipe';
import {
  CollectionListElementComponent
} from './object-list/collection-list-element/collection-list-element.component';
import { CommunityListElementComponent } from './object-list/community-list-element/community-list-element.component';
import {
  SearchResultListElementComponent
} from './object-list/search-result-list-element/search-result-list-element.component';
import { ObjectListComponent } from './object-list/object-list.component';
import { ThemedObjectListComponent } from './object-list/themed-object-list.component';
import {
  CollectionGridElementComponent
} from './object-grid/collection-grid-element/collection-grid-element.component';
import { CommunityGridElementComponent } from './object-grid/community-grid-element/community-grid-element.component';
import {
  AbstractListableElementComponent
} from './object-collection/shared/object-collection-element/abstract-listable-element.component';
import { ObjectGridComponent } from './object-grid/object-grid.component';
import { ObjectCollectionComponent } from './object-collection/object-collection.component';
import { ErrorComponent } from './error/error.component';
import { LoadingComponent } from './loading/loading.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ThumbnailComponent } from '../thumbnail/thumbnail.component';
import { ThemedThumbnailComponent } from '../thumbnail/themed-thumbnail.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { ThemedSearchFormComponent } from './search-form/themed-search-form.component';
import {
  SearchResultGridElementComponent
} from './object-grid/search-result-grid-element/search-result-grid-element.component';
import { ViewModeSwitchComponent } from './view-mode-switch/view-mode-switch.component';
import { VarDirective } from './utils/var.directive';
import { AuthNavMenuComponent } from './auth-nav-menu/auth-nav-menu.component';
import { ThemedAuthNavMenuComponent } from './auth-nav-menu/themed-auth-nav-menu.component';
import { LogOutComponent } from './log-out/log-out.component';
import { DragClickDirective } from './utils/drag-click.directive';
import { TruncatePipe } from './utils/truncate.pipe';
import { TruncatableComponent } from './truncatable/truncatable.component';
import { TruncatableService } from './truncatable/truncatable.service';
import { TruncatablePartComponent } from './truncatable/truncatable-part/truncatable-part.component';
import { MockAdminGuard } from './mocks/admin-guard.service.mock';
import { AlertComponent } from './alert/alert.component';
import {
  SearchResultDetailElementComponent
} from './object-detail/my-dspace-result-detail-element/search-result-detail-element.component';
import { ObjectDetailComponent } from './object-detail/object-detail.component';
import { ItemSubmitterComponent } from './object-collection/shared/mydspace-item-submitter/item-submitter.component';
import { ObjNgFor } from './utils/object-ngfor.pipe';
import {
  BrowseEntryListElementComponent
} from './object-list/browse-entry-list-element/browse-entry-list-element.component';
import { DebounceDirective } from './utils/debounce.directive';
import { ClickOutsideDirective } from './utils/click-outside.directive';
import { EmphasizePipe } from './utils/emphasize.pipe';
import { InputSuggestionsComponent } from './input-suggestions/input-suggestions.component';
import { CapitalizePipe } from './utils/capitalize.pipe';
import { ObjectKeysPipe } from './utils/object-keys-pipe';
import { LangSwitchComponent } from './lang-switch/lang-switch.component';
import {
  PlainTextMetadataListElementComponent
} from './object-list/metadata-representation-list-element/plain-text/plain-text-metadata-list-element.component';
import {
  BrowseLinkMetadataListElementComponent
} from './object-list/metadata-representation-list-element/browse-link/browse-link-metadata-list-element.component';
import {
  ItemMetadataListElementComponent
} from './object-list/metadata-representation-list-element/item/item-metadata-list-element.component';
import {
  MetadataRepresentationListElementComponent
} from './object-list/metadata-representation-list-element/metadata-representation-list-element.component';
import { ObjectValuesPipe } from './utils/object-values-pipe';
import { InListValidator } from './utils/in-list-validator.directive';
import { AutoFocusDirective } from './utils/auto-focus.directive';
import { StartsWithDateComponent } from './starts-with/date/starts-with-date.component';
import { StartsWithTextComponent } from './starts-with/text/starts-with-text.component';
import { DSOSelectorComponent } from './dso-selector/dso-selector/dso-selector.component';
import {
  CreateCommunityParentSelectorComponent
} from './dso-selector/modal-wrappers/create-community-parent-selector/create-community-parent-selector.component';
import {
  ThemedCreateCommunityParentSelectorComponent
} from './dso-selector/modal-wrappers/create-community-parent-selector/themed-create-community-parent-selector.component';
import {
  CreateItemParentSelectorComponent
} from './dso-selector/modal-wrappers/create-item-parent-selector/create-item-parent-selector.component';
import {
  ThemedCreateItemParentSelectorComponent
} from './dso-selector/modal-wrappers/create-item-parent-selector/themed-create-item-parent-selector.component';
import {
  CreateCollectionParentSelectorComponent
} from './dso-selector/modal-wrappers/create-collection-parent-selector/create-collection-parent-selector.component';
import {
  ThemedCreateCollectionParentSelectorComponent
} from './dso-selector/modal-wrappers/create-collection-parent-selector/themed-create-collection-parent-selector.component';
import {
  CommunitySearchResultListElementComponent
} from './object-list/search-result-list-element/community-search-result/community-search-result-list-element.component';
import {
  CollectionSearchResultListElementComponent
} from './object-list/search-result-list-element/collection-search-result/collection-search-result-list-element.component';
import {
  EditItemSelectorComponent
} from './dso-selector/modal-wrappers/edit-item-selector/edit-item-selector.component';
import {
  ThemedEditItemSelectorComponent
} from './dso-selector/modal-wrappers/edit-item-selector/themed-edit-item-selector.component';
import {
  EditCommunitySelectorComponent
} from './dso-selector/modal-wrappers/edit-community-selector/edit-community-selector.component';
import {
  ThemedEditCommunitySelectorComponent
} from './dso-selector/modal-wrappers/edit-community-selector/themed-edit-community-selector.component';
import {
  EditCollectionSelectorComponent
} from './dso-selector/modal-wrappers/edit-collection-selector/edit-collection-selector.component';
import {
  ThemedEditCollectionSelectorComponent
} from './dso-selector/modal-wrappers/edit-collection-selector/themed-edit-collection-selector.component';
import { RoleDirective } from './roles/role.directive';
import { UserMenuComponent } from './auth-nav-menu/user-menu/user-menu.component';
import {
  CollectionSearchResultGridElementComponent
} from './object-grid/search-result-grid-element/collection-search-result/collection-search-result-grid-element.component';
import {
  CommunitySearchResultGridElementComponent
} from './object-grid/search-result-grid-element/community-search-result/community-search-result-grid-element.component';
import { PageSizeSelectorComponent } from './page-size-selector/page-size-selector.component';
import { AbstractTrackableComponent } from './trackable/abstract-trackable.component';
import {
  ComcolMetadataComponent
} from './comcol/comcol-forms/edit-comcol-page/comcol-metadata/comcol-metadata.component';
import { ItemSelectComponent } from './object-select/item-select/item-select.component';
import { CollectionSelectComponent } from './object-select/collection-select/collection-select.component';
import {
  FilterInputSuggestionsComponent
} from './input-suggestions/filter-suggestions/filter-input-suggestions.component';
import {
  DsoInputSuggestionsComponent
} from './input-suggestions/dso-input-suggestions/dso-input-suggestions.component';
import { ItemGridElementComponent } from './object-grid/item-grid-element/item-types/item/item-grid-element.component';
import { TypeBadgeComponent } from './object-collection/shared/badges/type-badge/type-badge.component';
import { AccessStatusBadgeComponent } from './object-collection/shared/badges/access-status-badge/access-status-badge.component';
import {
  MetadataRepresentationLoaderComponent
} from './metadata-representation/metadata-representation-loader.component';
import { MetadataRepresentationDirective } from './metadata-representation/metadata-representation.directive';
import {
  ListableObjectComponentLoaderComponent
} from './object-collection/shared/listable-object/listable-object-component-loader.component';
import {
  ItemSearchResultListElementComponent
} from './object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { ListableObjectDirective } from './object-collection/shared/listable-object/listable-object.directive';
import {
  ItemMetadataRepresentationListElementComponent
} from './object-list/metadata-representation-list-element/item/item-metadata-representation-list-element.component';
import { PageWithSidebarComponent } from './sidebar/page-with-sidebar.component';
import { SidebarDropdownComponent } from './sidebar/sidebar-dropdown.component';
import {
  SelectableListItemControlComponent
} from './object-collection/shared/selectable-list-item-control/selectable-list-item-control.component';
import {
  ImportableListItemControlComponent
} from './object-collection/shared/importable-list-item-control/importable-list-item-control.component';
import { LogInContainerComponent } from './log-in/container/log-in-container.component';
import { LogInPasswordComponent } from './log-in/methods/password/log-in-password.component';
import { LogInComponent } from './log-in/log-in.component';
import { ThemedLogInComponent } from './log-in/themed-log-in.component';
import { MissingTranslationHelper } from './translate/missing-translation.helper';
import { FileValidator } from './utils/require-file.validator';
import { FileValueAccessorDirective } from './utils/file-value-accessor.directive';
import {
  ModifyItemOverviewComponent
} from '../item-page/edit-item-page/modify-item-overview/modify-item-overview.component';
import { ClaimedTaskActionsDirective } from './mydspace-actions/claimed-task/switcher/claimed-task-actions.directive';
import { ImpersonateNavbarComponent } from './impersonate-navbar/impersonate-navbar.component';
import { NgForTrackByIdDirective } from './ng-for-track-by-id.directive';
import { FileDownloadLinkComponent } from './file-download-link/file-download-link.component';
import { ThemedFileDownloadLinkComponent } from './file-download-link/themed-file-download-link.component';
import { CollectionDropdownComponent } from './collection-dropdown/collection-dropdown.component';
import { EntityDropdownComponent } from './entity-dropdown/entity-dropdown.component';
import { CurationFormComponent } from '../curation-form/curation-form.component';
import {
  PublicationSidebarSearchListElementComponent
} from './object-list/sidebar-search-list-element/item-types/publication/publication-sidebar-search-list-element.component';
import {
  SidebarSearchListElementComponent
} from './object-list/sidebar-search-list-element/sidebar-search-list-element.component';
import {
  CollectionSidebarSearchListElementComponent
} from './object-list/sidebar-search-list-element/collection/collection-sidebar-search-list-element.component';
import {
  CommunitySidebarSearchListElementComponent
} from './object-list/sidebar-search-list-element/community/community-sidebar-search-list-element.component';
import {
  BundleListElementComponent
} from './object-list/bundle-list-element/bundle-list-element.component';
import {
  AuthorizedCollectionSelectorComponent
} from './dso-selector/dso-selector/authorized-collection-selector/authorized-collection-selector.component';
import { HoverClassDirective } from './hover-class.directive';
import {
  ValidationSuggestionsComponent
} from './input-suggestions/validation-suggestions/validation-suggestions.component';
import {
  ItemSearchResultGridElementComponent
} from './object-grid/search-result-grid-element/item-search-result/item/item-search-result-grid-element.component';
import { SearchChartsComponent } from './search/search-charts/search-charts.component';
import {
  SearchChartBarComponent
} from './search/search-charts/search-chart/search-chart-bar/search-chart-bar.component';
import {
  SearchChartBarToLeftComponent
} from './search/search-charts/search-chart/search-chart-bar-to-left/search-chart-bar-to-left.component';
import {
  SearchChartBarToRightComponent
} from './search/search-charts/search-chart/search-chart-bar-to-right/search-chart-bar-to-right.component';
import {
  SearchChartPieComponent
} from './search/search-charts/search-chart/search-chart-pie/search-chart-pie.component';
import {
  SearchChartLineComponent
} from './search/search-charts/search-chart/search-chart-line/search-chart-line.component';
import {
  SearchChartFilterWrapperComponent
} from './search/search-charts/search-chart/search-chart-wrapper/search-chart-wrapper.component';
import { SearchChartComponent } from './search/search-charts/search-chart/search-chart.component';
import { ChartsModule } from '../charts/charts.module';
import {
  SearchChartFilterComponent
} from './search/search-charts/search-chart/search-chart-filter/search-chart-filter.component';
import { VocabularyExternalSourceComponent } from './vocabulary-external-source/vocabulary-external-source.component';
import {
  BulkImportSelectorComponent
} from './dso-selector/modal-wrappers/bulk-import-collection-selector/bulk-import-collection-selector.component';
import {
  AdministeredCollectionSelectorComponent
} from './dso-selector/dso-selector/administered-collection-selector/administered-collection-selector.component';
import { RelationshipsListComponent } from './object-list/relationships-list/relationships-list.component';
import {
  RelationshipsItemsActionsComponent
} from './object-list/relationships-list/relationships-items-actions/relationships-items-actions.component';
import {
  RelationshipsItemsListPreviewComponent
} from './object-list/relationships-list/relationships-items-list-preview/relationships-items-list-preview.component';
import { SearchNavbarComponent } from '../search-navbar/search-navbar.component';
import { ThemedSearchNavbarComponent } from '../search-navbar/themed-search-navbar.component';
import { ScopeSelectorModalComponent } from './search-form/scope-selector-modal/scope-selector-modal.component';
import { DsSelectComponent } from './ds-select/ds-select.component';
import {
  ClaimItemSelectorComponent
} from './dso-selector/modal-wrappers/claim-item-selector/claim-item-selector.component';
import { BrowseMostElementsComponent } from './browse-most-elements/browse-most-elements.component';
import {
  EditMetadataSecurityComponent
} from '../item-page/edit-item-page/edit-metadata-security/edit-metadata-security.component';
import { MetadataLinkViewComponent } from './metadata-link-view/metadata-link-view.component';
import {
  ExportExcelSelectorComponent
} from './dso-selector/modal-wrappers/export-excel-selector/export-excel-selector.component';
import { ThemedBrowseMostElementsComponent } from './browse-most-elements/themed-browse-most-elements.component';

import { ContextHelpDirective } from './context-help.directive';
import { ContextHelpWrapperComponent } from './context-help-wrapper/context-help-wrapper.component';
import { RSSComponent } from './rss-feed/rss.component';
import { BrowserOnlyPipe } from './utils/browser-only.pipe';
import { ThemedLoadingComponent } from './loading/themed-loading.component';
import { SearchExportCsvComponent } from './search/search-export-csv/search-export-csv.component';
import {
  ItemPageTitleFieldComponent
} from '../item-page/simple/field-components/specific-field/title/item-page-title-field.component';
import { GoogleRecaptchaModule } from '../core/google-recaptcha/google-recaptcha.module';
import { MenuModule } from './menu/menu.module';
import {
  ListableNotificationObjectComponent
} from './object-list/listable-notification-object/listable-notification-object.component';
import { ThemedCollectionDropdownComponent } from './collection-dropdown/themed-collection-dropdown.component';
import { MetadataFieldWrapperComponent } from './metadata-field-wrapper/metadata-field-wrapper.component';

import { StatusBadgeComponent } from './object-collection/shared/badges/status-badge/status-badge.component';
import { BadgesComponent } from './object-collection/shared/badges/badges.component';
import { ThemedBadgesComponent } from './object-collection/shared/badges/themed-badges.component';
import { ThemedStatusBadgeComponent } from './object-collection/shared/badges/status-badge/themed-status-badge.component';
import { ThemedTypeBadgeComponent } from './object-collection/shared/badges/type-badge/themed-type-badge.component';
import { ThemedMyDSpaceStatusBadgeComponent } from './object-collection/shared/badges/my-dspace-status-badge/themed-my-dspace-status-badge.component';
import { ThemedAccessStatusBadgeComponent } from './object-collection/shared/badges/access-status-badge/themed-access-status-badge.component';
import { MyDSpaceStatusBadgeComponent } from './object-collection/shared/badges/my-dspace-status-badge/my-dspace-status-badge.component';

import { ShortNumberPipe } from './utils/short-number.pipe';
import {
  LogInExternalProviderComponent
} from './log-in/methods/log-in-external-provider/log-in-external-provider.component';
import {
  AdvancedClaimedTaskActionSelectReviewerComponent
} from './mydspace-actions/claimed-task/select-reviewer/advanced-claimed-task-action-select-reviewer.component';
import {
  AdvancedClaimedTaskActionRatingComponent
} from './mydspace-actions/claimed-task/rating/advanced-claimed-task-action-rating.component';
import { ClaimedTaskActionsDeclineTaskComponent } from './mydspace-actions/claimed-task/decline-task/claimed-task-actions-decline-task.component';
import { EpersonGroupListComponent } from './eperson-group-list/eperson-group-list.component';
import { EpersonSearchBoxComponent } from './eperson-group-list/eperson-search-box/eperson-search-box.component';
import { GroupSearchBoxComponent } from './eperson-group-list/group-search-box/group-search-box.component';
import {
  ThemedItemPageTitleFieldComponent
} from '../item-page/simple/field-components/specific-field/title/themed-item-page-field.component';
import { BitstreamListItemComponent } from './object-list/bitstream-list-item/bitstream-list-item.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ThemedLangSwitchComponent } from './lang-switch/themed-lang-switch.component';
import { ThemedUserMenuComponent } from './auth-nav-menu/user-menu/themed-user-menu.component';
import { OrcidBadgeAndTooltipComponent } from './orcid-badge-and-tooltip/orcid-badge-and-tooltip.component';
import { LiveRegionComponent } from './live-region/live-region.component';
import { BtnDisabledDirective } from './btn-disabled.directive';
import { ItemCorrectionComponent } from './object-collection/shared/mydspace-item-correction/item-correction.component';
import { MetricsModule } from './metric/metrics.module';
import {
  SearchChartBarHorizontalComponent
} from './search/search-charts/search-chart/search-chart-bar-horizontal/search-chart-bar-horizontal.component';
import { ThumbnailService } from './thumbnail/thumbnail.service';
import { EntityIconDirective } from './entity-icon/entity-icon.directive';
import {
  AdditionalMetadataComponent
} from './object-list/search-result-list-element/additional-metadata/additional-metadata.component';
import { ItemCollectionComponent } from './object-collection/shared/mydspace-item-collection/item-collection.component';
import { ThemedItemListPreviewComponent } from './object-list/my-dspace-result-list-element/item-list-preview/themed-item-list-preview.component';
import { ItemListPreviewComponent } from './object-list/my-dspace-result-list-element/item-list-preview/item-list-preview.component';
import { MarkdownDirective } from './utils/markdown.directive';
import { DefaultBrowseElementsComponent } from './browse-most-elements/default-browse-elements/default-browse-elements.component';
import { ThemedDefaultBrowseElementsComponent } from './browse-most-elements/default-browse-elements/themed-default-browse-elements.component';
import { MetadataLinkViewPopoverComponent } from './metadata-link-view/metadata-link-view-popover/metadata-link-view-popover.component';
import { MetadataLinkViewAvatarPopoverComponent } from './metadata-link-view/metadata-link-view-avatar-popover/metadata-link-view-avatar-popover.component';
import { MetadataLinkViewOrcidComponent } from './metadata-link-view/metadata-link-view-orcid/metadata-link-view-orcid.component';
import { SwitchComponent } from './switch/switch.component';
import {StickyPopoverDirective} from './metadata-link-view/sticky-popover.directive';
import { SortPipe } from './utils/sort.pipe';

const MODULES = [
  CommonModule,
  FormsModule,
  InfiniteScrollModule,
  NgbCollapseModule,
  NgbNavModule,
  NgbTypeaheadModule,
  NgbPaginationModule,
  NgxPaginationModule,
  NgbDropdownModule,
  NgbTooltipModule,
  ReactiveFormsModule,
  RouterModule,
  DragDropModule,
  GoogleRecaptchaModule,
  MenuModule,
  NgxPaginationModule,
  MetricsModule,
  NgbModule
];

const ROOT_MODULES = [
  TranslateModule.forChild({
    missingTranslationHandler: {
      provide: MissingTranslationHandler,
      useClass: MissingTranslationHelper,
    },
    useDefaultLang: true,
  }),
  ChartsModule.withEntryComponents(),
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
  ObjectValuesPipe,
  ConsolePipe,
  ObjNgFor,
  BrowserOnlyPipe,
  ShortNumberPipe,
  SortPipe,
];

const COMPONENTS = [
  // put shared components here
  AlertComponent,
  AuthNavMenuComponent,
  ThemedAuthNavMenuComponent,
  UserMenuComponent,
  ThemedUserMenuComponent,
  DsSelectComponent,
  ErrorComponent,
  LangSwitchComponent,
  ThemedLangSwitchComponent,
  LoadingComponent,
  ThemedLoadingComponent,
  LogInComponent,
  ThemedLogInComponent,
  LogOutComponent,
  ObjectListComponent,
  ThemedObjectListComponent,
  ObjectDetailComponent,
  ObjectGridComponent,
  AbstractListableElementComponent,
  ObjectCollectionComponent,
  PaginationComponent,
  RSSComponent,
  SearchFormComponent,
  ThemedSearchFormComponent,
  PageWithSidebarComponent,
  SidebarDropdownComponent,
  ThumbnailComponent,
  ThemedThumbnailComponent,
  MyDSpaceStatusBadgeComponent,
  ThemedMyDSpaceStatusBadgeComponent,
  ItemCorrectionComponent,
  ItemSubmitterComponent,
  ViewModeSwitchComponent,
  TruncatableComponent,
  TruncatablePartComponent,
  InputSuggestionsComponent,
  FilterInputSuggestionsComponent,
  ValidationSuggestionsComponent,
  DsoInputSuggestionsComponent,
  DSOSelectorComponent,
  BulkImportSelectorComponent,
  ClaimItemSelectorComponent,
  SearchExportCsvComponent,
  PageSizeSelectorComponent,
  ListableObjectComponentLoaderComponent,
  AbstractTrackableComponent,
  ComcolMetadataComponent,
  TypeBadgeComponent,
  AccessStatusBadgeComponent,
  ThemedAccessStatusBadgeComponent,
  ThemedTypeBadgeComponent,
  StatusBadgeComponent,
  ThemedStatusBadgeComponent,
  BadgesComponent,
  ThemedBadgesComponent,

  ItemSelectComponent,
  CollectionSelectComponent,
  MetadataRepresentationLoaderComponent,
  SelectableListItemControlComponent,
  ImportableListItemControlComponent,
  LogInContainerComponent,
  ModifyItemOverviewComponent,
  ImpersonateNavbarComponent,
  EntityDropdownComponent,
  ExportMetadataCsvSelectorComponent,
  ExportMetadataXlsSelectorComponent,
  ImportBatchSelectorComponent,
  ExportBatchSelectorComponent,
  ConfirmationModalComponent,
  AuthorizedCollectionSelectorComponent,
  AdministeredCollectionSelectorComponent,
  SearchNavbarComponent,
  ItemPageTitleFieldComponent,
  ThemedSearchNavbarComponent,
  ListableNotificationObjectComponent,
  MetadataFieldWrapperComponent,
  ContextHelpWrapperComponent,
  EpersonGroupListComponent,
  EpersonSearchBoxComponent,
  GroupSearchBoxComponent,
  ThemedItemPageTitleFieldComponent,
  OrcidBadgeAndTooltipComponent,
  SearchChartsComponent,
  SearchChartBarComponent,
  SearchChartBarToLeftComponent,
  SearchChartBarToRightComponent,
  SearchChartPieComponent,
  SearchChartLineComponent,
  SearchChartFilterWrapperComponent,
  SearchChartComponent,
  SearchChartFilterComponent,
  VocabularyExternalSourceComponent,
  SearchNavbarComponent,
  RelationshipsListComponent,
  RelationshipsItemsActionsComponent,
  RelationshipsItemsListPreviewComponent,
  BrowseMostElementsComponent,
  EditMetadataSecurityComponent,
  MetadataLinkViewComponent,
  MetadataLinkViewPopoverComponent,
  MetadataLinkViewAvatarPopoverComponent,
  MetadataLinkViewOrcidComponent,
  ExportExcelSelectorComponent,
  ThemedBrowseMostElementsComponent,
  SearchChartBarHorizontalComponent,
  ItemListPreviewComponent,
  ThemedItemListPreviewComponent,
  ItemCollectionComponent,
  DefaultBrowseElementsComponent,
  ThemedDefaultBrowseElementsComponent,
];

const ENTRY_COMPONENTS = [
  // put only entry components that use custom decorator
  BundleListElementComponent,
  CollectionListElementComponent,
  CommunityListElementComponent,
  SearchResultListElementComponent,
  CommunitySearchResultListElementComponent,
  CollectionSearchResultListElementComponent,
  CollectionGridElementComponent,
  CommunityGridElementComponent,
  CommunitySearchResultGridElementComponent,
  CollectionSearchResultGridElementComponent,
  SearchResultGridElementComponent,
  ItemListElementComponent,
  ItemGridElementComponent,
  BitstreamListItemComponent,
  ItemSearchResultListElementComponent,
  ItemSearchResultGridElementComponent,
  BrowseEntryListElementComponent,
  SearchResultDetailElementComponent,
  StartsWithDateComponent,
  StartsWithTextComponent,
  CreateCommunityParentSelectorComponent,
  ThemedCreateCommunityParentSelectorComponent,
  CreateCollectionParentSelectorComponent,
  ThemedCreateCollectionParentSelectorComponent,
  CreateItemParentSelectorComponent,
  ThemedCreateItemParentSelectorComponent,
  BulkImportSelectorComponent,
  ClaimItemSelectorComponent,
  EditCommunitySelectorComponent,
  ThemedEditCommunitySelectorComponent,
  EditCollectionSelectorComponent,
  ThemedEditCollectionSelectorComponent,
  EditItemSelectorComponent,
  ThemedEditItemSelectorComponent,
  PlainTextMetadataListElementComponent,
  BrowseLinkMetadataListElementComponent,
  ItemMetadataListElementComponent,
  MetadataRepresentationListElementComponent,
  ItemMetadataRepresentationListElementComponent,
  LogInPasswordComponent,
  LogInExternalProviderComponent,
  ClaimedTaskActionsDeclineTaskComponent,
  CollectionDropdownComponent,
  ThemedCollectionDropdownComponent,
  FileDownloadLinkComponent,
  ThemedFileDownloadLinkComponent,
  CurationFormComponent,
  ExportMetadataCsvSelectorComponent,
  ExportMetadataXlsSelectorComponent,
  ImportBatchSelectorComponent,
  ExportBatchSelectorComponent,
  ConfirmationModalComponent,
  SidebarSearchListElementComponent,
  PublicationSidebarSearchListElementComponent,
  CollectionSidebarSearchListElementComponent,
  CommunitySidebarSearchListElementComponent,
  ScopeSelectorModalComponent,
  ListableNotificationObjectComponent,
  AdvancedClaimedTaskActionSelectReviewerComponent,
  AdvancedClaimedTaskActionRatingComponent,
  EpersonGroupListComponent,
  EpersonSearchBoxComponent,
  GroupSearchBoxComponent,
  LiveRegionComponent,
  SearchChartBarComponent,
  SearchChartBarToLeftComponent,
  SearchChartBarToRightComponent,
  SearchChartPieComponent,
  SearchChartLineComponent,
  ThemedBrowseMostElementsComponent,
  SearchChartBarHorizontalComponent,
  RelationshipsListComponent,
  AdditionalMetadataComponent,
  ThemedDefaultBrowseElementsComponent,
  SwitchComponent,
];

const PROVIDERS = [
  TruncatableService,
  MockAdminGuard,
  AbstractTrackableComponent,
  ThumbnailService
];

const DIRECTIVES = [
  VarDirective,
  DragClickDirective,
  DebounceDirective,
  ClickOutsideDirective,
  InListValidator,
  AutoFocusDirective,
  RoleDirective,
  MetadataRepresentationDirective,
  ListableObjectDirective,
  ClaimedTaskActionsDirective,
  FileValueAccessorDirective,
  FileValidator,
  NgForTrackByIdDirective,
  MetadataFieldValidator,
  HoverClassDirective,
  ContextHelpDirective,
  BtnDisabledDirective,
  EntityIconDirective,
  MarkdownDirective,
  StickyPopoverDirective
];

@NgModule({
  imports: [
    ...MODULES,
    ...ROOT_MODULES,
  ],
  declarations: [
    ...PIPES,
    ...COMPONENTS,
    ...ENTRY_COMPONENTS,
    ...DIRECTIVES,
  ],
  providers: [
    ...PROVIDERS
  ],
  exports: [
    ...MODULES,
    ...PIPES,
    ...COMPONENTS,
    ...ENTRY_COMPONENTS,
    ...DIRECTIVES,
    TranslateModule,
  ]
})

/**
 * This module handles all components and pipes that need to be shared among multiple other modules
 */
export class SharedModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during SSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: SharedModule,
      providers: ENTRY_COMPONENTS.map((component) => ({ provide: component }))
    };
  }
}
