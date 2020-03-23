import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdminAccessControlModule } from './admin-access-control/admin-access-control.module';
import { AdminRegistriesModule } from './admin-registries/admin-registries.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminSearchPageComponent } from './admin-search-page/admin-search-page.component';
import { SearchPageModule } from '../+search-page/search-page.module';
import { ItemAdminSearchResultListElementComponent } from './admin-search-page/admin-search-results/admin-search-result-list-element/item-search-result/item-admin-search-result-list-element.component';
import { CommunityAdminSearchResultListElementComponent } from './admin-search-page/admin-search-results/admin-search-result-list-element/community-search-result/community-admin-search-result-list-element.component';
import { CollectionAdminSearchResultListElementComponent } from './admin-search-page/admin-search-results/admin-search-result-list-element/collection-search-result/collection-admin-search-result-list-element.component';
import { ItemAdminSearchResultGridElementComponent } from './admin-search-page/admin-search-results/admin-search-result-grid-element/item-search-result/item-admin-search-result-grid-element.component';
import { CommunityAdminSearchResultGridElementComponent } from './admin-search-page/admin-search-results/admin-search-result-grid-element/community-search-result/community-admin-search-result-grid-element.component';
import { CollectionAdminSearchResultGridElementComponent } from './admin-search-page/admin-search-results/admin-search-result-grid-element/collection-search-result/collection-admin-search-result-grid-element.component';
import { ItemAdminSearchResultActionsComponent } from './admin-search-page/admin-search-results/item-admin-search-result-actions.component';

@NgModule({
  imports: [
    AdminRoutingModule,
    AdminRegistriesModule,
    AdminAccessControlModule,
    SharedModule,
    SearchPageModule
  ],
  declarations: [
    AdminSearchPageComponent,
    ItemAdminSearchResultListElementComponent,
    CommunityAdminSearchResultListElementComponent,
    CollectionAdminSearchResultListElementComponent,
    ItemAdminSearchResultGridElementComponent,
    CommunityAdminSearchResultGridElementComponent,
    CollectionAdminSearchResultGridElementComponent,
    ItemAdminSearchResultActionsComponent
  ],
  entryComponents: [
    ItemAdminSearchResultListElementComponent,
    CommunityAdminSearchResultListElementComponent,
    CollectionAdminSearchResultListElementComponent,
    ItemAdminSearchResultGridElementComponent,
    CommunityAdminSearchResultGridElementComponent,
    CollectionAdminSearchResultGridElementComponent,
    ItemAdminSearchResultActionsComponent
  ]
})
export class AdminModule {

}
