import { ItemPageResolver } from '../item-page.resolver';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditItemPageComponent } from './edit-item-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: EditItemPageComponent,
        resolve: {
          item: ItemPageResolver
        }
      }
    ])
  ],
  providers: [
    ItemPageResolver,
  ]
})
export class EditItemPageRoutingModule {

}
