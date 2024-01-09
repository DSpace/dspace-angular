import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HomeNewsComponent } from './home-news/home-news.component';
import { HomePageRoutingModule } from './home-page-routing.module';

import { HomePageComponent } from './home-page.component';
import { TopLevelCommunityListComponent } from './top-level-community-list/top-level-community-list.component';
import { StatisticsModule } from '../statistics/statistics.module';
import { ThemedHomeNewsComponent } from './home-news/themed-home-news.component';
import { ThemedHomePageComponent } from './themed-home-page.component';
import { RecentItemListComponent } from './recent-item-list/recent-item-list.component';
import {
  ThemedTopLevelCommunityListComponent
} from './top-level-community-list/themed-top-level-community-list.component';

const DECLARATIONS = [
  HomePageComponent,
  ThemedHomePageComponent,
  TopLevelCommunityListComponent,
  ThemedTopLevelCommunityListComponent,
  ThemedHomeNewsComponent,
  HomeNewsComponent,
  RecentItemListComponent
];

@NgModule({
    imports: [
        CommonModule,
        HomePageRoutingModule,
        StatisticsModule.forRoot(),
        ...DECLARATIONS
    ],
    exports: [
        ...DECLARATIONS,
    ]
})
export class HomePageModule {

}
