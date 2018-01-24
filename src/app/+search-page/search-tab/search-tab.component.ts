import { Component, Input, OnInit } from '@angular/core';
import { SearchService } from '../search-service/search.service';
import { SearchOptions, ViewMode } from '../search-options.model';
import { SortBy, SortDirection } from '../../core/cache/models/sort-options.model';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MyDspaceService } from '../../+my-dspace-page/my-dspace-service/my-dspace.service';

export enum SearchTabOptions {
  'Your submissions',
  'All tasks'
}

@Component({
  selector: 'ds-search-tab',
  styleUrls: ['./search-tab.component.scss'],
  templateUrl: './search-tab.component.html',
})
export class SearchTabComponent {

  public tabOptions = SearchTabOptions;

}
