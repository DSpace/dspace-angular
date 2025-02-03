import { Route } from '@angular/router';

import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { MenuItemType } from '../shared/menu/menu-item-type.model';
import { homePageResolver } from './home-page.resolver';
import { ThemedHomePageComponent } from './themed-home-page.component';

export const ROUTES: Route[] = [
  {
    path: '',
    component: ThemedHomePageComponent,
    pathMatch: 'full',
    data: {
      title: 'home.title',
      menu: {
        public: [
          {
            id: 'statistics',
            active: true,
            visible: true,
            index: 2,
            model: {
              type: MenuItemType.TEXT,
              text: 'menu.section.statistics',
            } as LinkMenuItemModel,
          },
          {
            id: 'statistics_site',
            parentID: 'statistics',
            active: false,
            visible: true,
            model: {
              type: MenuItemType.LINK,
              text: 'menu.section.statistics.site',
              link: 'statistics',
            } as LinkMenuItemModel,
          }
        ],
      },
    },
    resolve: {
      site: homePageResolver,
    },
  },
];
