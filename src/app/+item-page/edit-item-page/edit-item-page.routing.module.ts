import {ItemPageResolver} from '../item-page.resolver';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {EditItemPageComponent} from './edit-item-page.component';
import {ItemMoveComponent} from './item-move/item-move.component';
import {URLCombiner} from '../../core/url-combiner/url-combiner';
import {getItemEditPath} from '../item-page-routing.module';

const ITEM_EDIT_MOVE_PATH = 'move';

export function getItemEditMovePath(id: string) {
  return new URLCombiner(getItemEditPath(id), ITEM_EDIT_MOVE_PATH);
}

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
        path: ITEM_EDIT_MOVE_PATH,
        component: ItemMoveComponent,
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
