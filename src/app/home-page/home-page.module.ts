import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HomeNewsComponent } from './home-news/home-news.component';
import { HomePageRoutingModule } from './home-page-routing.module';

import { HomePageComponent } from './home-page.component';
import { TopLevelCommunityListComponent } from './top-level-community-list/top-level-community-list.component';
import { StatisticsModule } from '../statistics/statistics.module';
import { ThemedHomeNewsComponent } from './home-news/themed-home-news.component';
import { ThemedHomePageComponent } from './themed-home-page.component';
import { DevTableComponent } from '../dev-table/dev-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ItemPageModule } from '../item-page/item-page.module';
import { UsageReportService } from '../core/statistics/usage-report-data.service';

const DECLARATIONS = [
  HomePageComponent,
  ThemedHomePageComponent,
  TopLevelCommunityListComponent,
  ThemedHomeNewsComponent,
  HomeNewsComponent,
  DevTableComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HomePageRoutingModule,
    StatisticsModule.forRoot(),
    MatTableModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    ScrollingModule,
    NgbCarouselModule,
    ItemPageModule
  ],
  declarations: [
    ...DECLARATIONS,
  ],
  exports: [
    ...DECLARATIONS,
  ],
  providers: [
    UsageReportService,
  ],
})
export class HomePageModule {

}
