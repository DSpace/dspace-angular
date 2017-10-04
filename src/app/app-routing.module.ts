import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', loadChildren: './+home/home.module#HomeModule' },
      { path: 'communities', loadChildren: './+community-page/community-page.module#CommunityPageModule' },
      { path: 'collections', loadChildren: './+collection-page/collection-page.module#CollectionPageModule' },
      { path: 'items', loadChildren: './+item-page/item-page.module#ItemPageModule' },
      { path: 'search', loadChildren: './+search-page/search-page.module#SearchPageModule' },
      { path: 'forms', loadChildren: './+form-page/form-page.module#FormPageModule' },
      { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
    ])
  ],
})
export class AppRoutingModule {

}
