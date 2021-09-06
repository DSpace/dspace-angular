import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemVersionHistoryComponent } from './item-version-history/item-version-history.component';
import { ItemVersionHistoryFormComponent } from './item-version-history-form/item-version-history-form.component';


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
        component: ItemVersionHistoryFormComponent,
      },
      {
        path: ':versionId/edit',
        component: ItemVersionHistoryFormComponent,
      }
    ])
  ],
  providers: [
  ]
})
export class VersionHistoryRoutingModule {

}
