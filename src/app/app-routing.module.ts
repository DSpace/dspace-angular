import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

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
  BITSTREAM_MODULE_PATH
} from './app-routing-paths';
import { COLLECTION_MODULE_PATH } from './+collection-page/collection-page-routing-paths';
import { COMMUNITY_MODULE_PATH } from './+community-page/community-page-routing-paths';
import { ITEM_MODULE_PATH } from './+item-page/item-page-routing-paths';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'reload/:rnd', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', loadChildren: './+home-page/home-page.module#HomePageModule', data: { showBreadcrumbs: false } },
      { path: 'community-list', loadChildren: './community-list-page/community-list-page.module#CommunityListPageModule' },
      { path: 'id', loadChildren: './+lookup-by-id/lookup-by-id.module#LookupIdModule' },
      { path: 'handle', loadChildren: './+lookup-by-id/lookup-by-id.module#LookupIdModule' },
      { path: REGISTER_PATH, loadChildren: './register-page/register-page.module#RegisterPageModule' },
      { path: FORGOT_PASSWORD_PATH, loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule' },
      { path: COMMUNITY_MODULE_PATH, loadChildren: './+community-page/community-page.module#CommunityPageModule' },
      { path: COLLECTION_MODULE_PATH, loadChildren: './+collection-page/collection-page.module#CollectionPageModule' },
      { path: ITEM_MODULE_PATH, loadChildren: './+item-page/item-page.module#ItemPageModule' },
      { path: BITSTREAM_MODULE_PATH, loadChildren: './+bitstream-page/bitstream-page.module#BitstreamPageModule' },
      {
        path: 'mydspace',
        loadChildren: './+my-dspace-page/my-dspace-page.module#MyDSpacePageModule',
        canActivate: [AuthenticatedGuard]
      },
      { path: 'search', loadChildren: './+search-page/search-page-routing.module#SearchPageRoutingModule' },
      { path: 'browse', loadChildren: './+browse-by/browse-by.module#BrowseByModule'},
      { path: 'explore', loadChildren: './+explore/explore.module#ExploreModule'},
      { path: ADMIN_MODULE_PATH, loadChildren: './+admin/admin.module#AdminModule', canActivate: [SiteAdministratorGuard] },
      { path: 'login', loadChildren: './+login-page/login-page.module#LoginPageModule' },
      { path: 'logout', loadChildren: './+logout-page/logout-page.module#LogoutPageModule' },
      { path: 'submit', loadChildren: './+submit-page/submit-page.module#SubmitPageModule' },
      { path: 'import-external', loadChildren: './+import-external-page/import-external-page.module#ImportExternalPageModule' },
      {
        path: 'workspaceitems',
        loadChildren: './+workspaceitems-edit-page/workspaceitems-edit-page.module#WorkspaceitemsEditPageModule'
      },
      {
        path: WORKFLOW_ITEM_MODULE_PATH,
        loadChildren: './+workflowitems-edit-page/workflowitems-edit-page.module#WorkflowItemsEditPageModule'
      },
      {
        path: PROFILE_MODULE_PATH,
        loadChildren: './profile-page/profile-page.module#ProfilePageModule', canActivate: [AuthenticatedGuard]
      },
      { path: 'processes', loadChildren: './process-page/process-page.module#ProcessPageModule', canActivate: [AuthenticatedGuard] },
      { path: UNAUTHORIZED_PATH, component: UnauthorizedComponent },
      { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
    ],
    {
      onSameUrlNavigation: 'reload',
    })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {

}
