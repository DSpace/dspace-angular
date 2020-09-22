import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthBlockingGuard } from './core/auth/auth-blocking.guard';

import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { AuthenticatedGuard } from './core/auth/authenticated.guard';
import { SiteAdministratorGuard } from './core/data/feature-authorization/feature-authorization-guard/site-administrator.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import {
  UNAUTHORIZED_PATH,
  WORKFLOW_ITEM_MODULE_PATH,
  FORGOT_PASSWORD_PATH,
  REGISTER_PATH,
  PROFILE_MODULE_PATH,
  ADMIN_MODULE_PATH,
  BITSTREAM_MODULE_PATH,
  INFO_MODULE_PATH
} from './app-routing-paths';
import { COLLECTION_MODULE_PATH } from './+collection-page/collection-page-routing-paths';
import { COMMUNITY_MODULE_PATH } from './+community-page/community-page-routing-paths';
import { ITEM_MODULE_PATH } from './+item-page/item-page-routing-paths';
import { ReloadGuard } from './core/reload/reload.guard';
import { EndUserAgreementCurrentUserGuard } from './core/end-user-agreement/end-user-agreement-current-user.guard';
import { SiteRegisterGuard } from './core/data/feature-authorization/feature-authorization-guard/site-register.guard';

@NgModule({
  imports: [
    RouterModule.forRoot([
        { path: '', canActivate: [AuthBlockingGuard],
          children: [
            { path: '', redirectTo: '/home', pathMatch: 'full' },
            { path: 'reload/:rnd', component: PageNotFoundComponent, pathMatch: 'full', canActivate: [ReloadGuard] },
            { path: 'home', loadChildren: './+home-page/home-page.module#HomePageModule', data: { showBreadcrumbs: false }, canActivate: [EndUserAgreementCurrentUserGuard] },
            { path: 'community-list', loadChildren: './community-list-page/community-list-page.module#CommunityListPageModule', canActivate: [EndUserAgreementCurrentUserGuard] },
            { path: 'id', loadChildren: './+lookup-by-id/lookup-by-id.module#LookupIdModule', canActivate: [EndUserAgreementCurrentUserGuard] },
            { path: 'handle', loadChildren: './+lookup-by-id/lookup-by-id.module#LookupIdModule', canActivate: [EndUserAgreementCurrentUserGuard] },
            { path: REGISTER_PATH, loadChildren: './register-page/register-page.module#RegisterPageModule', canActivate: [SiteRegisterGuard] },
            { path: FORGOT_PASSWORD_PATH, loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule', canActivate: [EndUserAgreementCurrentUserGuard] },
            { path: COMMUNITY_MODULE_PATH, loadChildren: './+community-page/community-page.module#CommunityPageModule', canActivate: [EndUserAgreementCurrentUserGuard] },
            { path: COLLECTION_MODULE_PATH, loadChildren: './+collection-page/collection-page.module#CollectionPageModule', canActivate: [EndUserAgreementCurrentUserGuard] },
            { path: ITEM_MODULE_PATH, loadChildren: './+item-page/item-page.module#ItemPageModule', canActivate: [EndUserAgreementCurrentUserGuard] },
            { path: BITSTREAM_MODULE_PATH, loadChildren: './+bitstream-page/bitstream-page.module#BitstreamPageModule', canActivate: [EndUserAgreementCurrentUserGuard] },
            {
              path: 'mydspace',
              loadChildren: './+my-dspace-page/my-dspace-page.module#MyDSpacePageModule',
              canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
            },
            { path: 'search', loadChildren: './+search-page/search-page-routing.module#SearchPageRoutingModule', canActivate: [EndUserAgreementCurrentUserGuard] },
            { path: 'browse', loadChildren: './+browse-by/browse-by.module#BrowseByModule', canActivate: [EndUserAgreementCurrentUserGuard] },
            { path: ADMIN_MODULE_PATH, loadChildren: './+admin/admin.module#AdminModule', canActivate: [SiteAdministratorGuard, EndUserAgreementCurrentUserGuard] },
            { path: 'login', loadChildren: './+login-page/login-page.module#LoginPageModule' },
            { path: 'logout', loadChildren: './+logout-page/logout-page.module#LogoutPageModule' },
            { path: 'submit', loadChildren: './+submit-page/submit-page.module#SubmitPageModule', canActivate: [EndUserAgreementCurrentUserGuard] },
            { path: 'import-external', loadChildren: './+import-external-page/import-external-page.module#ImportExternalPageModule', canActivate: [EndUserAgreementCurrentUserGuard] },
            {
              path: 'workspaceitems',
              loadChildren: './+workspaceitems-edit-page/workspaceitems-edit-page.module#WorkspaceitemsEditPageModule',
              canActivate: [EndUserAgreementCurrentUserGuard]
            },
            {
              path: WORKFLOW_ITEM_MODULE_PATH,
              loadChildren: './+workflowitems-edit-page/workflowitems-edit-page.module#WorkflowItemsEditPageModule',
              canActivate: [EndUserAgreementCurrentUserGuard]
            },
            {
              path: PROFILE_MODULE_PATH,
              loadChildren: './profile-page/profile-page.module#ProfilePageModule', canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
            },
            { path: 'processes', loadChildren: './process-page/process-page.module#ProcessPageModule', canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard] },
            { path: INFO_MODULE_PATH, loadChildren: './info/info.module#InfoModule' },
            { path: UNAUTHORIZED_PATH, component: UnauthorizedComponent },
            { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
          ]}
      ],
    {
      onSameUrlNavigation: 'reload',
    })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {

}
