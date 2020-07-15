import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { AuthenticatedGuard } from './core/auth/authenticated.guard';
import { DSpaceObject } from './core/shared/dspace-object.model';
import { Community } from './core/shared/community.model';
import { getCommunityPageRoute } from './+community-page/community-page-routing.module';
import { Collection } from './core/shared/collection.model';
import { Item } from './core/shared/item.model';
import { getItemPageRoute } from './+item-page/item-page-routing.module';
import { getCollectionPageRoute } from './+collection-page/collection-page-routing.module';

const ITEM_MODULE_PATH = 'items';

export function getItemModulePath() {
  return `/${ITEM_MODULE_PATH}`;
}

const COLLECTION_MODULE_PATH = 'collections';

export function getCollectionModulePath() {
  return `/${COLLECTION_MODULE_PATH}`;
}

const COMMUNITY_MODULE_PATH = 'communities';

export function getCommunityModulePath() {
  return `/${COMMUNITY_MODULE_PATH}`;
}
const BITSTREAM_MODULE_PATH = 'bitstreams';
export function getBitstreamModulePath() {
  return `/${BITSTREAM_MODULE_PATH}`;
}

export const ADMIN_MODULE_PATH = 'admin';

export function getAdminModulePath() {
  return `/${ADMIN_MODULE_PATH}`;
}

const PROFILE_MODULE_PATH = 'profile';

export function getProfileModulePath() {
  return `/${PROFILE_MODULE_PATH}`;
}

const REGISTER_PATH = 'register';

export function getRegisterPath() {
  return `/${REGISTER_PATH}`;

}

const FORGOT_PASSWORD_PATH = 'forgot';

export function getForgotPasswordPath() {
  return `/${FORGOT_PASSWORD_PATH}`;

}

const WORKFLOW_ITEM_MODULE_PATH = 'workflowitems';

export function getWorkflowItemModulePath() {
  return `/${WORKFLOW_ITEM_MODULE_PATH}`;
}

export function getDSOPath(dso: DSpaceObject): string {
  switch ((dso as any).type) {
    case Community.type.value:
      return getCommunityPageRoute(dso.uuid);
    case Collection.type.value:
      return getCollectionPageRoute(dso.uuid);
    case Item.type.value:
      return getItemPageRoute(dso.uuid);
  }
}

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
      { path: ADMIN_MODULE_PATH, loadChildren: './+admin/admin.module#AdminModule', canActivate: [AuthenticatedGuard] },
      { path: 'login', loadChildren: './+login-page/login-page.module#LoginPageModule' },
      { path: 'logout', loadChildren: './+logout-page/logout-page.module#LogoutPageModule' },
      { path: 'submit', loadChildren: './+submit-page/submit-page.module#SubmitPageModule' },
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
