import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthBlockingGuard } from './core/auth/auth-blocking.guard';

import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { AuthenticatedGuard } from './core/auth/authenticated.guard';
import { SiteAdministratorGuard } from './core/data/feature-authorization/feature-authorization-guard/site-administrator.guard';
import {
  ADMIN_MODULE_PATH,
  BITSTREAM_MODULE_PATH,
  BULK_IMPORT_PATH,
  EDIT_ITEM_PATH,
  FORBIDDEN_PATH,
  FORGOT_PASSWORD_PATH,
  INFO_MODULE_PATH,
  PROFILE_MODULE_PATH,
  REGISTER_PATH,
  WORKFLOW_ITEM_MODULE_PATH
} from './app-routing-paths';
import { COLLECTION_MODULE_PATH } from './+collection-page/collection-page-routing-paths';
import { COMMUNITY_MODULE_PATH } from './+community-page/community-page-routing-paths';
import { ITEM_MODULE_PATH } from './+item-page/item-page-routing-paths';
import { PROCESS_MODULE_PATH } from './process-page/process-page-routing.paths';
import { ReloadGuard } from './core/reload/reload.guard';
import { EndUserAgreementCurrentUserGuard } from './core/end-user-agreement/end-user-agreement-current-user.guard';
import { SiteRegisterGuard } from './core/data/feature-authorization/feature-authorization-guard/site-register.guard';
import { ForbiddenComponent } from './forbidden/forbidden.component';

@NgModule({
  imports: [
    RouterModule.forRoot([{
      path: '', canActivate: [AuthBlockingGuard],
        children: [
          { path: '', redirectTo: '/home', pathMatch: 'full' },
          { path: 'reload/:rnd', component: PageNotFoundComponent, pathMatch: 'full', canActivate: [ReloadGuard] },
          {
            path: 'home',
            loadChildren: () => import('./+home-page/home-page.module')
              .then((m) => m.HomePageModule),
            data: { showBreadcrumbs: false },
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'community-list',
            loadChildren: () => import('./community-list-page/community-list-page.module')
              .then((m) => m.CommunityListPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'id',
            loadChildren: () => import('./+lookup-by-id/lookup-by-id.module')
              .then((m) => m.LookupIdModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'handle',
            loadChildren: () => import('./+lookup-by-id/lookup-by-id.module')
              .then((m) => m.LookupIdModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: REGISTER_PATH,
            loadChildren: () => import('./register-page/register-page.module')
              .then((m) => m.RegisterPageModule),
            canActivate: [SiteRegisterGuard]
          },
          {
            path: FORGOT_PASSWORD_PATH,
            loadChildren: () => import('./forgot-password/forgot-password.module')
              .then((m) => m.ForgotPasswordModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: COMMUNITY_MODULE_PATH,
            loadChildren: () => import('./+community-page/community-page.module')
              .then((m) => m.CommunityPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: COLLECTION_MODULE_PATH,
            loadChildren: () => import('./+collection-page/collection-page.module')
              .then((m) => m.CollectionPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: ITEM_MODULE_PATH,
            loadChildren: () => import('./+item-page/item-page.module')
              .then((m) => m.ItemPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: BITSTREAM_MODULE_PATH,
            loadChildren: () => import('./+bitstream-page/bitstream-page.module')
              .then((m) => m.BitstreamPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'mydspace',
            loadChildren: () => import('./+my-dspace-page/my-dspace-page.module')
              .then((m) => m.MyDSpacePageModule),
            canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'search',
            loadChildren: () => import('./+search-page/search-page-routing.module')
              .then((m) => m.SearchPageRoutingModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'browse',
            loadChildren: () => import('./+browse-by/browse-by-page.module')
              .then((m) => m.BrowseByPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'explore',
            loadChildren: () => import('./+explore/explore.module')
              .then((m) => m.ExploreModule)
          },
          {
            path: ADMIN_MODULE_PATH,
            loadChildren: () => import('./+admin/admin.module')
              .then((m) => m.AdminModule),
            canActivate: [SiteAdministratorGuard, EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'login',
            loadChildren: () => import('./+login-page/login-page.module')
              .then((m) => m.LoginPageModule),
          },
          {
            path: 'logout',
            loadChildren: () => import('./+logout-page/logout-page.module')
              .then((m) => m.LogoutPageModule),
          },
          {
            path: 'submit',
            loadChildren: () => import('./+submit-page/submit-page.module')
              .then((m) => m.SubmitPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'import-external',
            loadChildren: () => import('./+import-external-page/import-external-page.module')
              .then((m) => m.ImportExternalPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'workspaceitems',
            loadChildren: () => import('./+workspaceitems-edit-page/workspaceitems-edit-page.module')
              .then((m) => m.WorkspaceitemsEditPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: WORKFLOW_ITEM_MODULE_PATH,
            loadChildren: () => import('./+workflowitems-edit-page/workflowitems-edit-page.module')
              .then((m) => m.WorkflowItemsEditPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: EDIT_ITEM_PATH,
            loadChildren: () => import('./edit-item/edit-item.module')
              .then((m) => m.EditItemModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: PROFILE_MODULE_PATH,
            loadChildren: () => import('./profile-page/profile-page.module')
              .then((m) => m.ProfilePageModule),
            canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
          },
          {
            path: PROCESS_MODULE_PATH,
            loadChildren: () => import('./process-page/process-page.module')
              .then((m) => m.ProcessPageModule),
            canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
          },
          { path: 'auditlogs',
            loadChildren: () => import('./audit-page/audit-page.module')
              .then((m) => m.AuditPageModule),
            canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
          },
          {
            path: BULK_IMPORT_PATH,
            loadChildren: () => import('./bulk-import/bulk-import-page.module')
              .then((m) => m.BulkImportPageModule),
            canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
          },
          {
            path: INFO_MODULE_PATH,
            loadChildren: () => import('./info/info.module').then((m) => m.InfoModule),
          },
          {
            path: FORBIDDEN_PATH,
            component: ForbiddenComponent
          },
          {
            path: 'statistics',
            loadChildren: () => import('./statistics-page/statistics-page-routing.module')
              .then((m) => m.StatisticsPageRoutingModule),
          },
          { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
      ]}
    ],{
      onSameUrlNavigation: 'reload',
    })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {

}
