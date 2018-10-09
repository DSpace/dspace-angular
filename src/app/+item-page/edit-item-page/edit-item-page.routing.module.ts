import { ItemPageResolver } from '../item-page.resolver';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditItemPageComponent } from './edit-item-page.component';
import { ItemCollectionMapperComponent } from './item-collection-mapper/item-collection-mapper.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: EditItemPageComponent,
        resolve: {
          item: ItemPageResolver
        }
      },
      {
        path: 'mapper',
        component: ItemCollectionMapperComponent,
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
