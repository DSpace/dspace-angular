import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HomeNewsComponent } from './home-news/home-news.component';
import { HomePageRoutingModule } from './home-page-routing.module';
import { HomePageComponent } from './home-page.component';
import { TopLevelCommunityListComponent } from './top-level-community-list/top-level-community-list.component';
import { SharedModule } from '../shared/shared.module';

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
  ]
})
export class HomePageModule {

}
