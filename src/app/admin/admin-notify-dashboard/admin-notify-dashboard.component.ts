import { AsyncPipe } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AdminNotifyMetricsBox,
  AdminNotifyMetricsRow,
} from '@dspace/config/admin-notify-metrics.config';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { SearchObjects } from '@dspace/core/shared/search/models/search-objects.model';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  forkJoin,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { SEARCH_CONFIG_SERVICE } from '../../my-dspace-page/my-dspace-configuration.service';
import { SearchService } from '../../shared/search/search.service';
import { SearchConfigurationService } from '../../shared/search/search-configuration.service';
import { AdminNotifyMetricsComponent } from './admin-notify-metrics/admin-notify-metrics.component';

@Component({
  selector: 'ds-admin-notify-dashboard',
  templateUrl: './admin-notify-dashboard.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
  standalone: true,
  imports: [
    AdminNotifyMetricsComponent,
    AsyncPipe,
    RouterLink,
    TranslateModule,
  ],
})

/**
 * Component used for visual representation and search of LDN messages for Admins
 */
export class AdminNotifyDashboardComponent implements OnInit {

  public notifyMetricsRows$: BehaviorSubject<AdminNotifyMetricsRow[]> = new BehaviorSubject<AdminNotifyMetricsRow[]>([]);

  private metricsConfig: AdminNotifyMetricsRow[];

  private singleResultOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'single-result-options',
    pageSize: 1,
  });

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    private searchService: SearchService,
  ) {
  }

  ngOnInit() {
    this.metricsConfig = this.appConfig.notifyMetrics;
    const mertricsRowsConfigurations = this.metricsConfig
      .map(row => row.boxes)
      .map(boxes => boxes.map(box => box.config).filter(config => !!config));
    const flatConfigurations = [].concat(...mertricsRowsConfigurations.map((config) => config));
    const searchConfigurations = flatConfigurations
      .map(config => Object.assign(new PaginatedSearchOptions({}),
        { configuration: config, pagination: this.singleResultOptions },
      ));

    forkJoin(
      searchConfigurations.map(config => this.searchService.search(config)
        .pipe(
          getFirstCompletedRemoteData(),
          map(response => this.mapSearchObjectsToMetricsBox(config.configuration, response.payload)),
        ),
      ),
    ).pipe(
      map(metricBoxes => this.mapUpdatedBoxesToMetricsRows(metricBoxes)),
    ).subscribe((metricBoxes: AdminNotifyMetricsRow[]) => {
      this.notifyMetricsRows$.next(metricBoxes);
    });
  }

  /**
   * Function to map received SearchObjects to notify boxes config
   *
   * @param searchObject The object to map
   * @private
   */
  private mapSearchObjectsToMetricsBox(configuration: string, searchObject: SearchObjects<DSpaceObject>): AdminNotifyMetricsBox {
    const count = searchObject.pageInfo.totalElements;
    const metricsBoxes = [].concat(...this.metricsConfig.map((config: AdminNotifyMetricsRow) => config.boxes));

    return {
      ...metricsBoxes.find(box => box.config === configuration),
      count,
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
        boxes: row.boxes.map(rowBox => boxesWithCount.find(boxWithCount => boxWithCount.config === rowBox.config)),
      };
    });
  }
}
