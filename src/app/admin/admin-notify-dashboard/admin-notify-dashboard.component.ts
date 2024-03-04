import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../core/shared/search/search.service';
import { environment } from '../../../environments/environment';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { forkJoin, Observable } from 'rxjs';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { map } from 'rxjs/operators';
import { SearchObjects } from '../../shared/search/models/search-objects.model';
import { AdminNotifyMetricsBox, AdminNotifyMetricsRow } from './admin-notify-metrics/admin-notify-metrics.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { SEARCH_CONFIG_SERVICE } from '../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';


@Component({
  selector: 'ds-admin-notify-dashboard',
  templateUrl: './admin-notify-dashboard.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})

/**
 * Component used for visual representation and search of LDN messages for Admins
 */
export class AdminNotifyDashboardComponent implements OnInit{

  public notifyMetricsRows$: Observable<AdminNotifyMetricsRow[]>;

  private metricsConfig = environment.notifyMetrics;
  private singleResultOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'single-result-options',
    pageSize: 1
  });

  constructor(private searchService: SearchService) {
  }

  ngOnInit() {
    const mertricsRowsConfigurations = this.metricsConfig
      .map(row => row.boxes)
      .map(boxes => boxes.map(box => box.config).filter(config => !!config));
    const flatConfigurations = [].concat(...mertricsRowsConfigurations.map((config) => config));
    const searchConfigurations = flatConfigurations
      .map(config => Object.assign(new PaginatedSearchOptions({}),
      { configuration: config, pagination: this.singleResultOptions }
    ));

    this.notifyMetricsRows$ = forkJoin(searchConfigurations.map(config => this.searchService.search(config)
        .pipe(
          getFirstCompletedRemoteData(),
          map(response => this.mapSearchObjectsToMetricsBox(response.payload)),
        )
      )
    ).pipe(
      map(metricBoxes => this.mapUpdatedBoxesToMetricsRows(metricBoxes))
    );
  }

  /**
   * Function to map received SearchObjects to notify boxes config
   *
   * @param searchObject The object to map
   * @private
   */
  private mapSearchObjectsToMetricsBox(searchObject: SearchObjects<DSpaceObject>): AdminNotifyMetricsBox {
    const count = searchObject.pageInfo.totalElements;
    const objectConfig = searchObject.configuration;
    const metricsBoxes = [].concat(...this.metricsConfig.map((config) => config.boxes));

    return {
      ...metricsBoxes.find(box => box.config === objectConfig),
      count
    };
  }

  /**
   * Function to map updated boxes with count to each row of the configuration
   *
   * @param boxesWithCount The object to map
   * @private
   */
  private mapUpdatedBoxesToMetricsRows(boxesWithCount: AdminNotifyMetricsBox[]): AdminNotifyMetricsRow[] {
    return this.metricsConfig.map(row => {
        return {
          ...row,
          boxes: row.boxes.map(rowBox => boxesWithCount.find(boxWithCount => boxWithCount.config === rowBox.config))
        };
    });
  }
}
