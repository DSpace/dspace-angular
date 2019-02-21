import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowseByTitlePageComponent } from './+browse-by-title-page/browse-by-title-page.component';
import { BrowseByMetadataPageComponent } from './+browse-by-metadata-page/browse-by-metadata-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'title', component: BrowseByTitlePageComponent },
      { path: ':metadata', component: BrowseByMetadataPageComponent }
    ])
  ]
})
export class BrowseByRoutingModule {

}
