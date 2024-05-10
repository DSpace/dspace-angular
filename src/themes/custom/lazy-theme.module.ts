import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { RootModule } from '../../app/root.module';
import { MetadataImportPageComponent } from './app/admin/admin-import-metadata-page/metadata-import-page.component';
import { AdminSidebarComponent } from './app/admin/admin-sidebar/admin-sidebar.component';
import { EditBitstreamPageComponent } from './app/bitstream-page/edit-bitstream-page/edit-bitstream-page.component';
import { BreadcrumbsComponent } from './app/breadcrumbs/breadcrumbs.component';
import { BrowseByDateComponent } from './app/browse-by/browse-by-date/browse-by-date.component';
import { BrowseByMetadataComponent } from './app/browse-by/browse-by-metadata/browse-by-metadata.component';
import { BrowseByTaxonomyComponent } from './app/browse-by/browse-by-taxonomy/browse-by-taxonomy.component';
import { BrowseByTitleComponent } from './app/browse-by/browse-by-title/browse-by-title.component';
import { CollectionPageComponent } from './app/collection-page/collection-page.component';
import { EditItemTemplatePageComponent } from './app/collection-page/edit-item-template-page/edit-item-template-page.component';
import { CommunityListComponent } from './app/community-list-page/community-list/community-list.component';
import { CommunityListPageComponent } from './app/community-list-page/community-list-page.component';
import { CommunityPageComponent } from './app/community-page/community-page.component';
import { CommunityPageSubCollectionListComponent } from './app/community-page/sections/sub-com-col-section/sub-collection-list/community-page-sub-collection-list.component';
import { CommunityPageSubCommunityListComponent } from './app/community-page/sections/sub-com-col-section/sub-community-list/community-page-sub-community-list.component';
import { DsoEditMetadataComponent } from './app/dso-shared/dso-edit-metadata/dso-edit-metadata.component';
import { ForbiddenComponent } from './app/forbidden/forbidden.component';
import { ForgotEmailComponent } from './app/forgot-password/forgot-password-email/forgot-email.component';
import { ForgotPasswordFormComponent } from './app/forgot-password/forgot-password-form/forgot-password-form.component';
import { HomePageComponent } from './app/home-page/home-page.component';
import { EndUserAgreementComponent } from './app/info/end-user-agreement/end-user-agreement.component';
import { FeedbackComponent } from './app/info/feedback/feedback.component';
import { FeedbackFormComponent } from './app/info/feedback/feedback-form/feedback-form.component';
import { PrivacyComponent } from './app/info/privacy/privacy.component';
import { ItemAlertsComponent } from './app/item-page/alerts/item-alerts.component';
import { ItemStatusComponent } from './app/item-page/edit-item-page/item-status/item-status.component';
import { FullFileSectionComponent } from './app/item-page/full/field-components/file-section/full-file-section.component';
import { FullItemPageComponent } from './app/item-page/full/full-item-page.component';
import { MediaViewerComponent } from './app/item-page/media-viewer/media-viewer.component';
import { MediaViewerImageComponent } from './app/item-page/media-viewer/media-viewer-image/media-viewer-image.component';
import { MediaViewerVideoComponent } from './app/item-page/media-viewer/media-viewer-video/media-viewer-video.component';
import { FileSectionComponent } from './app/item-page/simple/field-components/file-section/file-section.component';
import { ItemPageTitleFieldComponent } from './app/item-page/simple/field-components/specific-field/title/item-page-title-field.component';
import { ItemPageComponent } from './app/item-page/simple/item-page.component';
import { MetadataRepresentationListComponent } from './app/item-page/simple/metadata-representation-list/metadata-representation-list.component';
import { LoginPageComponent } from './app/login-page/login-page.component';
import { LogoutPageComponent } from './app/logout-page/logout-page.component';
import { ObjectNotFoundComponent } from './app/lookup-by-id/objectnotfound/objectnotfound.component';
import { MyDSpacePageComponent } from './app/my-dspace-page/my-dspace-page.component';
import { ExpandableNavbarSectionComponent } from './app/navbar/expandable-navbar-section/expandable-navbar-section.component';
import { PageNotFoundComponent } from './app/pagenotfound/pagenotfound.component';
import { ProfilePageComponent } from './app/profile-page/profile-page.component';
import { ProfilePageMetadataFormComponent } from './app/profile-page/profile-page-metadata-form/profile-page-metadata-form.component';
import { RegisterEmailFormComponent } from './app/register-email-form/register-email-form.component';
import { CreateProfileComponent } from './app/register-page/create-profile/create-profile.component';
import { RegisterEmailComponent } from './app/register-page/register-email/register-email.component';
import { DenyRequestCopyComponent } from './app/request-copy/deny-request-copy/deny-request-copy.component';
import { EmailRequestCopyComponent } from './app/request-copy/email-request-copy/email-request-copy.component';
import { GrantRequestCopyComponent } from './app/request-copy/grant-request-copy/grant-request-copy.component';
import { RootComponent } from './app/root/root.component';
import { ConfigurationSearchPageComponent } from './app/search-page/configuration-search-page.component';
import { SearchPageComponent } from './app/search-page/search-page.component';
import { AuthNavMenuComponent } from './app/shared/auth-nav-menu/auth-nav-menu.component';
import { UserMenuComponent } from './app/shared/auth-nav-menu/user-menu/user-menu.component';
import { BrowseByComponent } from './app/shared/browse-by/browse-by.component';
import { ComcolPageBrowseByComponent } from './app/shared/comcol/comcol-page-browse-by/comcol-page-browse-by.component';
import { ComcolPageContentComponent } from './app/shared/comcol/comcol-page-content/comcol-page-content.component';
import { ComcolPageHandleComponent } from './app/shared/comcol/comcol-page-handle/comcol-page-handle.component';
import { DsDynamicLookupRelationExternalSourceTabComponent } from './app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/dynamic-lookup-relation-external-source-tab.component';
import { ExternalSourceEntryImportModalComponent } from './app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/external-source-entry-import-modal/external-source-entry-import-modal.component';
import { DsDynamicLookupRelationSearchTabComponent } from './app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/search-tab/dynamic-lookup-relation-search-tab.component';
import { LoadingComponent } from './app/shared/loading/loading.component';
import { AccessStatusBadgeComponent } from './app/shared/object-collection/shared/badges/access-status-badge/access-status-badge.component';
import { BadgesComponent } from './app/shared/object-collection/shared/badges/badges.component';
import { MyDSpaceStatusBadgeComponent } from './app/shared/object-collection/shared/badges/my-dspace-status-badge/my-dspace-status-badge.component';
import { StatusBadgeComponent } from './app/shared/object-collection/shared/badges/status-badge/status-badge.component';
import { TypeBadgeComponent } from './app/shared/object-collection/shared/badges/type-badge/type-badge.component';
import { ItemDetailPreviewFieldComponent } from './app/shared/object-detail/my-dspace-result-detail-element/item-detail-preview/item-detail-preview-field/item-detail-preview-field.component';
import { ItemListPreviewComponent } from './app/shared/object-list/my-dspace-result-list-element/item-list-preview/item-list-preview.component';
import { ObjectListComponent } from './app/shared/object-list/object-list.component';
import { ResultsBackButtonComponent } from './app/shared/results-back-button/results-back-button.component';
import { SearchComponent } from './app/shared/search/search.component';
import { SearchFiltersComponent } from './app/shared/search/search-filters/search-filters.component';
import { SearchResultsComponent } from './app/shared/search/search-results/search-results.component';
import { SearchSettingsComponent } from './app/shared/search/search-settings/search-settings.component';
import { SearchSidebarComponent } from './app/shared/search/search-sidebar/search-sidebar.component';
import { SearchFormComponent } from './app/shared/search-form/search-form.component';
import { CollectionStatisticsPageComponent } from './app/statistics-page/collection-statistics-page/collection-statistics-page.component';
import { CommunityStatisticsPageComponent } from './app/statistics-page/community-statistics-page/community-statistics-page.component';
import { ItemStatisticsPageComponent } from './app/statistics-page/item-statistics-page/item-statistics-page.component';
import { SiteStatisticsPageComponent } from './app/statistics-page/site-statistics-page/site-statistics-page.component';
import { SubmissionEditComponent } from './app/submission/edit/submission-edit.component';
import { SubmissionUploadFilesComponent } from './app/submission/form/submission-upload-files/submission-upload-files.component';
import { SubmissionImportExternalComponent } from './app/submission/import-external/submission-import-external.component';
import { SubmissionSectionUploadFileComponent } from './app/submission/sections/upload/file/section-upload-file.component';
import { SubmissionSubmitComponent } from './app/submission/submit/submission-submit.component';
import { ThumbnailComponent } from './app/thumbnail/thumbnail.component';
import { WorkflowItemDeleteComponent } from './app/workflowitems-edit-page/workflow-item-delete/workflow-item-delete.component';
import { WorkflowItemSendBackComponent } from './app/workflowitems-edit-page/workflow-item-send-back/workflow-item-send-back.component';
import { WorkspaceItemsDeletePageComponent } from './app/workspaceitems-edit-page/workspaceitems-delete-page/workspaceitems-delete-page.component';

const DECLARATIONS = [
  FileSectionComponent,
  HomePageComponent,
  RootComponent,
  CommunityListPageComponent,
  SearchPageComponent,
  ConfigurationSearchPageComponent,
  SearchFormComponent,
  EndUserAgreementComponent,
  PageNotFoundComponent,
  ObjectNotFoundComponent,
  ForbiddenComponent,
  PrivacyComponent,
  CollectionStatisticsPageComponent,
  CommunityStatisticsPageComponent,
  ItemStatisticsPageComponent,
  SiteStatisticsPageComponent,
  CommunityPageComponent,
  CommunityPageSubCommunityListComponent,
  CommunityPageSubCollectionListComponent,
  CollectionPageComponent,
  ItemPageComponent,
  FullItemPageComponent,
  LoginPageComponent,
  LogoutPageComponent,
  CreateProfileComponent,
  ForgotEmailComponent,
  ForgotPasswordFormComponent,
  ProfilePageComponent,
  RegisterEmailComponent,
  MyDSpacePageComponent,
  SubmissionEditComponent,
  SubmissionImportExternalComponent,
  SubmissionSubmitComponent,
  WorkflowItemDeleteComponent,
  WorkflowItemSendBackComponent,
  BreadcrumbsComponent,
  FeedbackComponent,
  FeedbackFormComponent,
  CommunityListComponent,
  ComcolPageHandleComponent,
  AuthNavMenuComponent,
  ExpandableNavbarSectionComponent,
  EditItemTemplatePageComponent,
  LoadingComponent,
  SearchResultsComponent,
  AdminSidebarComponent,
  SearchSettingsComponent,
  ComcolPageBrowseByComponent,
  ObjectListComponent,
  BrowseByMetadataComponent,
  BrowseByDateComponent,
  BrowseByTitleComponent,
  BrowseByTaxonomyComponent,
  ExternalSourceEntryImportModalComponent,
  SearchFiltersComponent,
  SearchSidebarComponent,
  BadgesComponent,
  StatusBadgeComponent,
  TypeBadgeComponent,
  MyDSpaceStatusBadgeComponent,
  AccessStatusBadgeComponent,
  ResultsBackButtonComponent,
  DsoEditMetadataComponent,
  ItemAlertsComponent,
  FullFileSectionComponent,
  MetadataRepresentationListComponent,
  DsDynamicLookupRelationSearchTabComponent,
  DsDynamicLookupRelationExternalSourceTabComponent,
  ItemPageTitleFieldComponent,
  MediaViewerComponent,
  MediaViewerImageComponent,
  MediaViewerVideoComponent,
  DenyRequestCopyComponent,
  EmailRequestCopyComponent,
  GrantRequestCopyComponent,
  WorkspaceItemsDeletePageComponent,
  ThumbnailComponent,
  SubmissionSectionUploadFileComponent,
  ItemStatusComponent,
  EditBitstreamPageComponent,
  UserMenuComponent,
  BrowseByComponent,
  RegisterEmailFormComponent,
  SearchComponent,
  ItemListPreviewComponent,
  MetadataImportPageComponent,
  ItemDetailPreviewFieldComponent,
  ProfilePageMetadataFormComponent,
  SubmissionUploadFilesComponent,
  ComcolPageContentComponent,
];

@NgModule({
  imports: [
    RootModule,
    CommonModule,
    DragDropModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule,
    ScrollToModule,
    StoreModule,
    StoreRouterConnectingModule,
    TranslateModule,
    FormsModule,
    NgxGalleryModule,
    ...DECLARATIONS,
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
