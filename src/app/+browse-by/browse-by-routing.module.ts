import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowseByTitlePageComponent } from './+browse-by-title-page/browse-by-title-page.component';
import { BrowseByAuthorPageComponent } from './+browse-by-author-page/browse-by-author-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'title', component: BrowseByTitlePageComponent },
      { path: 'author', component: BrowseByAuthorPageComponent }
    ])
  ]
})
export class BrowseByRoutingModule {

}
