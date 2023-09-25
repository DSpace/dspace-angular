import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Site } from '../core/shared/site.model';
import { environment } from '../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { RecentItemListComponent } from './recent-item-list/recent-item-list.component';
import { ThemedTopLevelCommunityListComponent } from './top-level-community-list/themed-top-level-community-list.component';
import { ThemedSearchFormComponent } from '../shared/search-form/themed-search-form.component';
import { ViewTrackerComponent } from '../statistics/angulartics/dspace/view-tracker.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { ThemedHomeNewsComponent } from './home-news/themed-home-news.component';
@Component({
    selector: 'ds-home-page',
    styleUrls: ['./home-page.component.scss'],
    templateUrl: './home-page.component.html',
    standalone: true,
    imports: [ThemedHomeNewsComponent, NgIf, ViewTrackerComponent, ThemedSearchFormComponent, ThemedTopLevelCommunityListComponent, RecentItemListComponent, AsyncPipe, TranslateModule]
})
export class HomePageComponent implements OnInit {

  site$: Observable<Site>;
  recentSubmissionspageSize: number;
  constructor(
    private route: ActivatedRoute,
  ) {
    this.recentSubmissionspageSize = environment.homePage.recentSubmissions.pageSize;
  }

  ngOnInit(): void {
    this.site$ = this.route.data.pipe(
      map((data) => data.site as Site),
    );
  }
}
