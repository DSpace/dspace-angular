import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { TopLevelCommunityListComponent } from './top-level-community-list/top-level-community-list.component';
import { HomeNewsComponent } from './home-news/home-news.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent,
    TopLevelCommunityListComponent,
    HomeNewsComponent
  ]
})
export class HomeModule {

}
