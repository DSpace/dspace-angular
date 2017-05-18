import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { CommonModule } from "@angular/common";
import { TopLevelCommunityListComponent } from "./top-level-community-list/top-level-community-list.component";
import { HomeNewsComponent } from "./home-news/home-news.component";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    RouterModule,
    TranslateModule
  ],
  declarations: [
    HomeComponent,
    TopLevelCommunityListComponent,
    HomeNewsComponent
  ]
})
export class HomeModule { }
