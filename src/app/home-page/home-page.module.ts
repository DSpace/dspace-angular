import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { JournalEntitiesModule } from '../entity-groups/journal-entities/journal-entities.module';
import { ResearchEntitiesModule } from '../entity-groups/research-entities/research-entities.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ExploreModule } from '../shared/explore/explore.module';
import { SearchModule } from '../shared/search/search.module';
import { SharedModule } from '../shared/shared.module';
import { StatisticsModule } from '../statistics/statistics.module';
import { HomeNewsComponent } from './home-news/home-news.component';
import { ThemedHomeNewsComponent } from './home-news/themed-home-news.component';
import { HomePageComponent } from './home-page.component';
import { HomePageRoutingModule } from './home-page-routing.module';
import { RecentItemListComponent } from './recent-item-list/recent-item-list.component';
import { ThemedHomePageComponent } from './themed-home-page.component';
import { ThemedTopLevelCommunityListComponent } from './top-level-community-list/themed-top-level-community-list.component';
import { TopLevelCommunityListComponent } from './top-level-community-list/top-level-community-list.component';

const DECLARATIONS = [
  HomePageComponent,
  ThemedHomePageComponent,
  TopLevelCommunityListComponent,
  ThemedTopLevelCommunityListComponent,
  ThemedHomeNewsComponent,
  HomeNewsComponent,
  RecentItemListComponent,
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule.withEntryComponents(),
    SearchModule,
    JournalEntitiesModule.withEntryComponents(),
    ResearchEntitiesModule.withEntryComponents(),
    ExploreModule,
    HomePageRoutingModule,
    StatisticsModule.forRoot(),
    NotificationsModule,
  ],
  declarations: [
    ...DECLARATIONS,
  ],
  exports: [
    ...DECLARATIONS,
  ],
})
export class HomePageModule {

}
