import { Component, Input, OnInit } from '@angular/core';
import { PaginatedSearchOptions } from '../paginated-search-options.model';
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { ScriptDataService } from '../../../core/data/processes/script-data.service';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { map, tap } from 'rxjs/operators';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { hasValue, isNotEmpty } from '../../empty.util';
import { RemoteData } from '../../../core/data/remote-data';
import { Process } from '../../../process-page/processes/process.model';
import { getProcessDetailRoute } from '../../../process-page/process-page-routing.paths';
import { NotificationsService } from '../../notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ds-search-export-csv',
  styleUrls: ['./search-export-csv.component.scss'],
  templateUrl: './search-export-csv.component.html',
})
/**
 * Display a button to export the current search results as csv
 */
export class SearchExportCsvComponent implements OnInit {

  /**
   * The current configuration of the search
   */
  @Input() searchConfig: PaginatedSearchOptions;

  /**
   * Observable used to determine whether the button should be shown
   */
  shouldShowButton$: Observable<boolean>;

  /**
   * The message key used for the tooltip of the button
   */
  tooltipMsg = 'metadata-export-search.tooltip';

  constructor(private scriptDataService: ScriptDataService,
              private authorizationDataService: AuthorizationDataService,
              private notificationsService: NotificationsService,
              private translateService: TranslateService,
              private router: Router
  ) {
  }

  ngOnInit(): void {
    const scriptExists$ = this.scriptDataService.findById('metadata-export-search').pipe(
      getFirstCompletedRemoteData(),
      map((rd) => rd.isSuccess && hasValue(rd.payload))
    );

    const isAuthorized$ = this.authorizationDataService.isAuthorized(FeatureID.AdministratorOf);

    this.shouldShowButton$ = observableCombineLatest([scriptExists$, isAuthorized$]).pipe(
      tap((v) => console.log('showbutton', v)),
      map(([scriptExists, isAuthorized]: [boolean, boolean]) => scriptExists && isAuthorized)
    );
  }

  /**
   * Start the export of the items based on the current search configuration
   */
  export() {
    const parameters = [];
    if (hasValue(this.searchConfig)) {
      if (isNotEmpty(this.searchConfig.query)) {
        parameters.push({name: '-q', value: this.searchConfig.query});
      }
      if (isNotEmpty(this.searchConfig.scope)) {
        parameters.push({name: '-s', value: this.searchConfig.scope});
      }
      if (isNotEmpty(this.searchConfig.configuration)) {
        parameters.push({name: '-c', value: this.searchConfig.configuration});
      }
      if (isNotEmpty(this.searchConfig.filters)) {
        this.searchConfig.filters.forEach((filter) => {
          let operator = 'equals';
          if (hasValue(filter.values)) {
            operator = filter.values[0].substring(filter.values[0].indexOf(',') + 1);
          }
          const filterValue = `${filter.key.substring(2)},${operator}=${filter.values.map((v) => v.substring(0, v.indexOf(','))).join()}`;
          parameters.push({name: '-f', value: filterValue});
        });
      }
    }

    this.scriptDataService.invoke('metadata-export-search', parameters, []).pipe(
      getFirstCompletedRemoteData()
    ).subscribe((rd: RemoteData<Process>) => {
      if (rd.hasSucceeded) {
        this.notificationsService.success(this.translateService.get('metadata-export-search.submit.success'));
        this.router.navigateByUrl(getProcessDetailRoute(rd.payload.processId));
      } else {
        this.notificationsService.error(this.translateService.get('metadata-export-search.submit.error'));
      }
    });
  }
}
