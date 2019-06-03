import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { AuthenticatedGuard } from './core/auth/authenticated.guard';
var ITEM_MODULE_PATH = 'items';
export function getItemModulePath() {
    return "/" + ITEM_MODULE_PATH;
}
var COLLECTION_MODULE_PATH = 'collections';
export function getCollectionModulePath() {
    return "/" + COLLECTION_MODULE_PATH;
}
var COMMUNITY_MODULE_PATH = 'communities';
export function getCommunityModulePath() {
    return "/" + COMMUNITY_MODULE_PATH;
}
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                RouterModule.forRoot([
                    { path: '', redirectTo: '/home', pathMatch: 'full' },
                    { path: 'home', loadChildren: './+home-page/home-page.module#HomePageModule' },
                    { path: COMMUNITY_MODULE_PATH, loadChildren: './+community-page/community-page.module#CommunityPageModule' },
                    { path: COLLECTION_MODULE_PATH, loadChildren: './+collection-page/collection-page.module#CollectionPageModule' },
                    { path: ITEM_MODULE_PATH, loadChildren: './+item-page/item-page.module#ItemPageModule' },
                    { path: 'mydspace', loadChildren: './+my-dspace-page/my-dspace-page.module#MyDSpacePageModule', canActivate: [AuthenticatedGuard] },
                    { path: 'search', loadChildren: './+search-page/search-page.module#SearchPageModule' },
                    { path: 'browse', loadChildren: './+browse-by/browse-by.module#BrowseByModule' },
                    { path: 'admin', loadChildren: './+admin/admin.module#AdminModule', canActivate: [AuthenticatedGuard] },
                    { path: 'login', loadChildren: './+login-page/login-page.module#LoginPageModule' },
                    { path: 'logout', loadChildren: './+logout-page/logout-page.module#LogoutPageModule' },
                    { path: 'submit', loadChildren: './+submit-page/submit-page.module#SubmitPageModule' },
                    { path: 'workspaceitems', loadChildren: './+workspaceitems-edit-page/workspaceitems-edit-page.module#WorkspaceitemsEditPageModule' },
                    { path: 'workflowitems', loadChildren: './+workflowitems-edit-page/workflowitems-edit-page.module#WorkflowitemsEditPageModule' },
                    { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
                ])
            ],
            exports: [RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map