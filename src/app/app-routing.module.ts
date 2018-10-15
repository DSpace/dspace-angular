import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', loadChildren: './+home-page/home-page.module#HomePageModule' },
      { path: 'communities', loadChildren: './+community-page/community-page.module#CommunityPageModule' },
      { path: 'collections', loadChildren: './+collection-page/collection-page.module#CollectionPageModule' },
      { path: 'items', loadChildren: './+item-page/item-page.module#ItemPageModule' },
      { path: 'search', loadChildren: './+search-page/search-page.module#SearchPageModule' },
      { path: 'browse', loadChildren: './+browse-by/browse-by.module#BrowseByModule' },
      { path: 'admin', loadChildren: './+admin/admin.module#AdminModule' },
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
export class AppRoutingModule {

}
