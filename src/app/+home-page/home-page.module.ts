import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HomeNewsComponent } from './home-news/home-news.component';
import { HomePageRoutingModule } from './home-page-routing.module';

import { HomePageComponent } from './home-page.component';
import { TopLevelCommunityListComponent } from './top-level-community-list/top-level-community-list.component';
import { NotificationComponent } from '../shared/notifications/notification/notification.component';
import { NotificationsBoardComponent } from '../shared/notifications/notifications-board/notifications-board.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomePageComponent,
    TopLevelCommunityListComponent,
    HomeNewsComponent,
    // NotificationComponent,
    // NotificationsBoardComponent
  ]
})
export class HomePageModule {

}
