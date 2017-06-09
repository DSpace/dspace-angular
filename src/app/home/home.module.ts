import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { CommonModule } from "@angular/common";
import { TopLevelCommunityListComponent } from "./top-level-community-list/top-level-community-list.component";
import { HomeNewsComponent } from "./home-news/home-news.component";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ObjectListComponent } from "../object-list/object-list.component";
import { ObjectListElementComponent } from "../object-list/object-list-element/object-list-element.component";
import { ItemListElementComponent } from "../object-list/item-list-element/item-list-element.component";
import { CollectionListElementComponent } from "../object-list/collection-list-element/collection-list-element.component";
import { CommunityListElementComponent } from "../object-list/community-list-element/community-list-element.component";
import { SharedModule } from "../shared/shared.module";

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
    HomeNewsComponent,
    ObjectListComponent,
    ObjectListElementComponent,
    ItemListElementComponent,
    CollectionListElementComponent,
    CommunityListElementComponent
  ]
})
export class HomeModule { }
