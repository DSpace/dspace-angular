import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { HomePageComponent } from './home-page.component';
import { HomePageRoutingModule } from './home-page-routing.module';
import { TopLevelCommunityListComponent } from './top-level-community-list/top-level-community-list.component';
import { HomeNewsComponent } from './home-news/home-news.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomePageComponent,
    TopLevelCommunityListComponent,
    HomeNewsComponent
  ]
})
export class HomePageModule {

}
