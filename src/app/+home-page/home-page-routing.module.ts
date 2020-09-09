import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomePageComponent } from './home-page.component';
import { HomePageResolver } from './home-page.resolver';
import { MenuItemType } from '../shared/menu/initial-menus-state';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: HomePageComponent,
        pathMatch: 'full',
        data: {
          title: 'home.title',
          menu: {
            public: [{
              id: 'statistics_site',
              active: true,
              visible: true,
              model: {
                type: MenuItemType.LINK,
                text: 'menu.section.statistics',
                link: 'statistics',
              } as LinkMenuItemModel,
            }],
          },
        },
        resolve: {
          site: HomePageResolver
        }
      }
    ])
  ],
  providers: [
    HomePageResolver
  ]
})
export class HomePageRoutingModule {
}
