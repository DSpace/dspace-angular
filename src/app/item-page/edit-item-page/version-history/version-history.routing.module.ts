import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemVersionHistoryComponent } from './item-version-history/item-version-history.component';
import { ItemVersionHistoryEditComponent } from './item-version-history-edit/item-version-history-edit.component';


/**
 * Routing module that handles the routing for the Edit Item page administrator functionality
 */
@NgModule({
  imports: [
    // items/<id>/edit/''/version-history
    RouterModule.forChild([
      {
        path: '',
        component: ItemVersionHistoryComponent,
        // children: [
        //   {
        //     path: '',
        //     pathMatch: 'full',
        //
        //   }
        // ]
      },
      {
        path: 'create',
        component: ItemVersionHistoryEditComponent,
      },
      {
        path: ':versionId/edit',
        component: ItemVersionHistoryEditComponent,
      }
    ])
  ],
  providers: [
  ]
})
export class VersionHistoryRoutingModule {

}
