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
      showSocialButtons: true,
      menu: {
        public: [{
          id: 'statistics_site',
          active: true,
          visible: false,
          index: 2,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.statistics',
            link: 'statistics',
          } as LinkMenuItemModel,
        }],
      },
    },
    resolve: {
      site: homePageResolver,
    },
  },
];
