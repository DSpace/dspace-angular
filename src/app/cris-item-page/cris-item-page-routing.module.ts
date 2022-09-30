import { CrisItemPageTabResolver } from './../item-page/cris-item-page-tab.resolver';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrisItemPageResolver } from './cris-item-page.resolver';
import { CrisItemPageComponent } from './cris-item-page.component';
import { ItemBreadcrumbResolver } from '../core/breadcrumbs/item-breadcrumb.resolver';
import { MenuItemType } from '../shared/menu/menu-item-type.model';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';

const routes: Routes = [
  {
    path: ':id',
    component: CrisItemPageComponent,
    resolve: {
      dso: CrisItemPageResolver,
      breadcrumb: ItemBreadcrumbResolver,
      tabs: CrisItemPageTabResolver
    },
    data: {
      menu: {
        public: [{
          id: 'statistics_item_:id',
          active: true,
          visible: true,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.statistics',
            link: 'statistics/items/:id/',
          } as LinkMenuItemModel,
        }],
      }
      , showSocialButtons: true
    }
  },
  { // used for activate specific tab
    path: ':id/:tab',
    component: CrisItemPageComponent,
    resolve: {
      dso: CrisItemPageResolver,
      breadcrumb: ItemBreadcrumbResolver,
      tabs: CrisItemPageTabResolver
    },
    data: {
      menu: {
        public: [{
          id: 'statistics_item_:id',
          active: true,
          visible: true,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.statistics',
            link: 'statistics/items/:id/',
          } as LinkMenuItemModel,
        }],
      }, showSocialButtons: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    CrisItemPageResolver,
    ItemBreadcrumbResolver
  ]
})
export class CrisItemPageRoutingModule { }
