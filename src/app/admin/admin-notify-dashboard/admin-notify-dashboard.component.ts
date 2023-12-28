import { Component, OnInit } from '@angular/core';
import { SearchService } from "../../core/shared/search/search.service";
import { environment } from "../../../environments/environment";
import { PaginatedSearchOptions } from "../../shared/search/models/paginated-search-options.model";
import { PaginationComponentOptions } from "../../shared/pagination/pagination-component-options.model";
import { concatAll, concatWith, flatMap, forkJoin, from, mergeAll, switchMap } from "rxjs";
import { concat, delay } from "rxjs/operators";
import { getFirstSucceededRemoteData } from "../../core/shared/operators";

@Component({
  selector: 'ds-admin-notify-dashboard',
  templateUrl: './admin-notify-dashboard.component.html',
  styleUrls: ['./admin-notify-dashboard.component.scss'],
})
export class AdminNotifyDashboardComponent implements OnInit{

  metricsConfig = environment.notifyMetrics;
  private singleResultOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'single-result-options',
    pageSize: 1
  });
  constructor(private searchService: SearchService) {}

  ngOnInit() {
    const discoveryConfigurations = this.metricsConfig
      .map(row => row.boxes)
      .map(boxes => boxes.map(box => box.config).filter(config => !!config));
    const mergedConfigurations = discoveryConfigurations[0].concat(discoveryConfigurations[1]);
    const searchConfigurations = mergedConfigurations
      .map(config => Object.assign(new PaginatedSearchOptions({}),
      { configuration: config, pagination: this.singleResultOptions }
    ));
    // TODO: check for search completion before executing next one
  }
}
