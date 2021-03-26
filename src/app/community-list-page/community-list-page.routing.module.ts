import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CdkTreeModule } from '@angular/cdk/tree';

import { CommunityListService } from './community-list-service';
import { ThemedCommunityListPageComponent } from './themed-community-list-page.component';

/**
 * RouterModule to help navigate to the page with the community list tree
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ThemedCommunityListPageComponent,
        pathMatch: 'full',
        data: { title: 'communityList.tabTitle' }
      }
    ]),
    CdkTreeModule,
  ],
  providers: [CommunityListService]
})
export class CommunityListPageRoutingModule {
}
