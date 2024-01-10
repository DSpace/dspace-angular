import { HomePageResolver } from './home-page.resolver';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { ThemedHomePageComponent } from './themed-home-page.component';
import { MenuItemType } from '../shared/menu/menu-item-type.model';
import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    component: ThemedHomePageComponent,
    providers: [
      HomePageResolver
    ],
    pathMatch: 'full',
    data: {
      title: 'home.title',
      menu: {
        public: [{
          id: 'statistics_site',
          active: true,
          visible: true,
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
      site: HomePageResolver
    }
  }
];
