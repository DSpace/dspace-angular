import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { CommonModule } from '@angular/common';
import { TopLevelCommunityListComponent } from './top-level-community-list/top-level-community-list.component';
import { HomeNewsComponent } from './home-news/home-news.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    RouterModule,
    SharedModule,
    TranslateModule
  ],
  declarations: [
    HomeComponent,
    TopLevelCommunityListComponent,
    HomeNewsComponent
  ]
})
export class HomeModule { }
