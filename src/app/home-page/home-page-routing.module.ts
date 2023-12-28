import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuProviderService } from '../shared/menu/menu-provider.service';
import { resolveRouteMenus } from '../shared/menu/menu.resolver';
import { StatisticsMenuProvider } from '../shared/menu/providers/statistics.menu';

import { HomePageResolver } from './home-page.resolver';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { ThemedHomePageComponent } from './themed-home-page.component';
import { MenuItemType } from '../shared/menu/menu-item-type.model';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ThemedHomePageComponent,
        pathMatch: 'full',
        data: {
          title: 'home.title',
        },
        resolve: {
          site: HomePageResolver,
          menu: resolveRouteMenus(StatisticsMenuProvider), // todo: sometimes this doesn't show up!
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
